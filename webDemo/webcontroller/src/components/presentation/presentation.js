import { useState, useEffect } from "react";
import { sendPresentationRequest } from "../../helper/presentations/sendPresentationRequest";
import { sendPresentation } from "../../helper/presentations/sendPresentation";
import { verifyPresentation } from "../../helper/presentations/verifyPresentation";
import { getPresentationCredentials } from "../../helper/presentations/getPresentationCredentials";
import { downloadImage } from "../../helper/fileServer/downloadImage";
import { moveToRegistry } from "../../helper/fileServer/moveToRegistry";
import { uploadImageToRegistry } from "../../helper/fileServer/uploadImageToRegistry";
import universalStore from "../../universalObject.json";
import { sendCredentialOfferDirect } from "../../helper/credentialExchange/sendCredentialOfferDirect";

const keyValues = [
  "presentation_exchange_id",
  "presentation_acked",
  "presentation_request_dict",
  "presentation",
  "connection_id",
];

function Presentation(props) {
  const [cred, setCred] = useState("--");
  const [shown, setShown] = useState(false);

  const sendImageAuthorshipPresentation = async (e) => {
    e.preventDefault();
    let body = {};
    body.requested_attributes = {
      additionalProp1: {
        cred_id: props.credentialResults[cred].referent,
        revealed: true,
      },
    };
    body.requested_predicates = {};
    body.self_attested_attributes = {};
    body.trace = true;
    console.log(body);
    const presResp = await sendPresentation(
      props.api_url,
      props.conn.presentation_exchange_id,
      body
    );
    console.log(presResp);
  };

  function actionControl() {
    if (props.conn.state === undefined) {
      return <></>;
    } else {
      if (props.conn.state === "proposal_received") {
        return (
          <button
            onClick={() =>
              sendPresentationRequest(
                props.api_url,
                {},
                props.conn.presentation_exchange_id
              )
            }
          >
            Send Request
          </button>
        );
      }
      if (
        props.conn.state === "request_received" &&
        props.conn.presentation_request_dict &&
        props.conn.presentation_request_dict.comment.includes(
          "ImageAuthorshipRequest"
        ) &&
        props.conn.role == "prover"
      ) {
        return (
          <>
            <form onSubmit={(e) => sendImageAuthorshipPresentation(e)}>
              <label>
                Credential:
                <select
                  name="verifier_label"
                  id="verifier_label"
                  form="propose_presentation"
                  onChange={(event) => {
                    setCred(event.target.value);
                  }}
                >
                  <option value={undefined} selected>
                    --
                  </option>
                  {props.credentialResults.map((cred, index) => (
                    <option value={index}>{cred.referent}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Send Presentation</button>
            </form>
          </>
        );
      }
      if (props.conn.state === "presentation_received") {
        return (
          <button
            onClick={() =>
              verifyPresentation(
                props.api_url,
                props.conn.presentation_exchange_id
              )
            }
          >
            Verify
          </button>
        );
      }
    }
  }

  async function issueCredential() {
    let info = JSON.parse(props.conn.presentation_proposal_dict.comment);
    let image = await moveToRegistry(info.imgUrl);
    let body = {};
    body.connection_id = props.conn.connection_id;
    body.credential_preview = {};
    body.credential_preview.type = "issue-credential/2.0/credential-preview";
    body.credential_preview.attributes = [
      {
        name: "imgHash",
        value: info.imgHash,
      },
      {
        name: "imgUrl",
        value:
          process.env.REACT_APP_FILE_SERVER_URL +
          "imageRegistry/" +
          info.imgUrl,
      },
      {
        name: "imgTimestamp",
        value: info.imgTimestamp,
      },
      {
        name: "macAddress",
        value: info.macAddress,
      },
      {
        name: "geolocation",
        value: info.geolocation,
      },
    ];
    body.filter = {};
    body.filter.indy = universalStore.imageAuthorship;
    const proposalResponse = await sendCredentialOfferDirect(
      props.api_url,
      body
    );
    console.log(proposalResponse);
    console.log(body);
  }

  function imageCredentialControl() {
    if (
      props.conn.presentation_proposal_dict &&
      props.conn.presentation_proposal_dict.comment.includes(
        "ImageCredentialRequest"
      ) &&
      props.conn.role === "verifier" &&
      props.conn.state === "verified"
    ) {
      // issueCredential();
      return (
        <>
          <p>Special Proposal request!</p>
          <img
            src={
              process.env.REACT_APP_FILE_SERVER_URL +
              "uploads/" +
              JSON.parse(props.conn.presentation_proposal_dict.comment).imgUrl
            }
            height={200}
          />
          <br />
          <button onClick={issueCredential}>Issue credential</button>
        </>
      );
    } else {
      return <></>;
    }
  }

  // function imagePresentationControl(){
  //   if((props.conn.state === "request_received")){
  //     return(
  //       <>
  //       <p>Image authorship presentation request!</p>
  //       <button onClick={sendPresentation()}>Send Presentation</button>
  //       </>
  //     )
  //   }else{
  //     return <></>
  //   }
  // }
  const franklinCheckHash = () => {
    if (
      props.conn.state == "verified" &&
      props.conn.presentation_request_dict &&
      props.conn.presentation_request_dict.comment.includes(
        "ImageAuthorshipRequest"
      ) &&
      props.conn.role == "verifier" &&
      props.conn.presentation.requested_proof.revealed_attrs.additionalProp1
        .raw ===
        JSON.parse(props.conn.presentation_request_dict.comment).imgHash
    ) {
      return (
        <p>
          <b style={{ color: "green" }}>
            Image Hash matches the request sent by franklin.
          </b>
        </p>
      );
    } else if (
      props.conn.state == "verified" &&
      props.conn.presentation_request_dict &&
      props.conn.presentation_request_dict.comment.includes(
        "ImageAuthorshipRequest"
      ) &&
      props.conn.role == "verifier" &&
      props.conn.presentation.requested_proof.revealed_attrs.additionalProp1
        .raw !==
        JSON.parse(props.conn.presentation_request_dict.comment).imgHash
    ) {
      return (
        <p>
          <b style={{ color: "red" }}>
            Image does not match the hash requested by Franklin.
          </b>
        </p>
      );
    }
  };

  return (
    <div style={props.styleObj}>
      {Object.entries(props.conn).map(([key, val]) => {
        if (keyValues.includes(key)) {
          return (
            <>
              <b>{key}:</b> {JSON.stringify(val, null, 2)}
              <br />
            </>
          );
        }
      })}
      {!shown && (
        <button onClick={() => setShown((prevState) => setShown(!prevState))}>
          More Details
        </button>
      )}
      {shown && (
        <>
          {Object.entries(props.conn).map(([key, val]) => {
            if (!keyValues.includes(key)) {
              return (
                <>
                  <b>{key}:</b> {JSON.stringify(val, null, 2)}
                  <br />
                </>
              );
            }
          })}
          <button onClick={() => setShown((prevState) => setShown(!prevState))}>
            Hide
          </button>
        </>
      )}
      <br />
      <b>State management:</b> {props.conn.state}
      <br />
      {actionControl()}
      {imageCredentialControl()}
      {/* {imagePresentationControl()} */}
      {franklinCheckHash()}
      <br />
      <br />
    </div>
  );
}

export default Presentation;
