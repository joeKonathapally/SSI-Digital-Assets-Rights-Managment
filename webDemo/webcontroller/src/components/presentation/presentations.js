import { useEffect } from "react";
import { useState } from "react";
import { getConnections } from "../../helper/connection/getConnections";
import { getPresentationExchanges } from "../../helper/presentations/getPresentationExchanges";
import universalStore from "../../universalObject.json";
import { getCredentials } from "../../helper/credentialExchange/getCredentials";
import { sendPresentationProposal } from "../../helper/presentations/sendPresentationProposal";
import Presentation from "./presentation";
import { sendPresentationRequest } from "../../helper/presentations/sendPresentationRequest";

import "./Presentations.css";

function Presentations(props) {
  const [presentationResults, setPresentationResults] = useState([]);
  const [connectionResults, setConnectionResults] = useState([]);
  const [credentialResults, setCredentialResults] = useState([]);
  const [verifier, setVerifier] = useState("--");
  const [holder, setHolder] = useState("--");
  const [attributes, setAttributes] = useState([]);
  const [credential, setCredential] = useState("--");
  const [imageHash, setImageHash] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      let connectionsData = await getConnections(props.api_url);
      setConnectionResults(connectionsData);
      let presentationData = await getPresentationExchanges(props.api_url);
      presentationData.sort(function (a, b) {
        return Date.parse(b.updated_at) - Date.parse(a.updated_at);
      });
      setPresentationResults(presentationData);
      let credentialData = await getCredentials(props.api_url);
      setCredentialResults(credentialData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(props.hook_url + "topic/connections");

    ws.onopen = function open() {
      ws.send("web controller connected");
    };

    ws.onmessage = (e) => {
      // console.log(JSON.parse(e.data));
      // console.log(Date.parse(JSON.parse(e.data).updated_at));
      setConnectionResults((results) => {
        let temp = [];
        results.map((element) => {
          if (!(JSON.parse(e.data).connection_id === element.connection_id)) {
            temp.push(element);
          }
        });
        temp.push(JSON.parse(e.data));
        temp.sort(function (a, b) {
          return Date.parse(b.updated_at) - Date.parse(a.updated_at);
        });
        return temp;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket(props.hook_url + "topic/present_proof");

    ws.onopen = function open() {
      ws.send("web controller connected");
    };

    ws.onmessage = (e) => {
      // console.log('Something:'+JSON.parse(e.data));
      // console.log(Date.parse(JSON.parse(e.data).updated_at));
      setPresentationResults((results) => {
        let temp = [];
        results.map((element) => {
          console.log(JSON.parse(e.data).presentation_exchange_id);
          console.log(element);
          if (
            !(
              JSON.parse(e.data).presentation_exchange_id ===
              element.presentation_exchange_id
            )
          ) {
            temp.push(element);
          }
        });
        temp.push(JSON.parse(e.data));
        temp.sort(function (a, b) {
          return Date.parse(b.updated_at) - Date.parse(a.updated_at);
        });
        return temp;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  async function updateConnectionResults() {
    let data = await getConnections(props.api_url);
    data.sort(function (a, b) {
      return Date.parse(b.updated_at) - Date.parse(a.updated_at);
    });
    setConnectionResults(data);
  }
  //   async function updateCredentialResults(){
  //     let data = await getCredentialExchanges(props.api_url);
  //     data.sort(function(a,b){
  //       return Date.parse(b.updated_at) - Date.parse(a.updated_at);
  //     })
  //     setPresentationResults(data);
  //   }

  async function submitPresentationProposal(e) {
    e.preventDefault();
    let verifierConnectionRecord = connectionResults[verifier];
    let body = {};
    body.connection_id = verifierConnectionRecord.connection_id;
    body.comment = "Custom Presentation proposal sent via web-controller";
    body.presentation_proposal = {};
    body.presentation_proposal["@type"] =
      "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/present-proof/1.0/presentation-preview";
    body.auto_present = true;
    body.presentation_proposal.attributes = attributes.map((attribute) => ({
      cred_def_id: credentialResults[credential].cred_def_id,
      name: attribute,
      referent: credentialResults[credential].referent,
    }));
    body.presentation_proposal.predicates = [];
    const proposalResponse = await sendPresentationProposal(
      props.api_url,
      body
    );
  }

  const requestPresentation = async (e) => {
    e.preventDefault();
    let holderConnectionRecord = connectionResults[holder];
    let body = {};
    body.connection_id = holderConnectionRecord.connection_id;
    body.comment = JSON.stringify({
      flag: "ImageAuthorshipRequest",
      imgHash: imageHash,
    });
    body.proof_request = { name: "Proof Request" };
    body.proof_request.nonce = "1"; //Temporary nonce
    body.proof_request.requested_attributes = {
      additionalProp1: {
        name: "imgHash",
        restrictions: [
          {
            cred_def_id: universalStore.imageAuthorship.cred_def_id,
          },
        ],
      },
    };
    body.proof_request.requested_predicates = {};
    body.proof_request.version = "1.0";

    // console.log(body);
    const requestResp = await sendPresentationRequest(props.api_url, body);
    // console.log(requestResp);
  };

  return (
    <>
      <div>
        <form
          onSubmit={(e) => submitPresentationProposal(e)}
          id="propose_presentation"
        >
          <h3>Propose a Presentation Exchange</h3>
          <label>
            Credential:
            <select
              name="verifier_label"
              id="verifier_label"
              form="propose_presentation"
              onChange={(event) => {
                setCredential(event.target.value);
                setAttributes([]);
                setVerifier("--");
              }}
            >
              <option value={undefined} selected>
                --
              </option>
              {credentialResults.map((cred, index) => (
                <option value={index}>{cred.referent}</option>
              ))}
            </select>
          </label>
          {credential !== "--" && (
            <>
              <br />
              <label>
                Verifier:
                <select
                  name="verifier_label"
                  id="verifier_label"
                  form="propose_presentation"
                  onChange={(event) => {
                    setVerifier(event.target.value);
                    setAttributes([]);
                  }}
                >
                  <option value={undefined} selected>
                    --
                  </option>
                  {connectionResults.map((connection, index) => (
                    <option value={index}>{connection.their_label}</option>
                  ))}
                </select>
              </label>
            </>
          )}

          {verifier !== "--" &&
            connectionResults[verifier].their_label === "endorser" && (
              <>
                <br />
                <b>Endorser does not process any presentations.</b>
              </>
            )}

          {verifier !== "--" &&
            connectionResults[verifier].their_label !== "endorser" && (
              <AttributeToggles
                updateAttributes={(attribute) =>
                  setAttributes(
                    (prevState) =>
                      prevState.includes(attribute)
                        ? prevState.filter((i) => i !== attribute) // remove item
                        : [...prevState, attribute] // add item
                  )
                }
                credential={credentialResults[credential]}
              />
            )}

          {verifier !== "--" && attributes !== [] && (
            <>
              <br />
              <button type="submit">Propose</button>
            </>
          )}
        </form>
      </div>
      <br />
      {props.is_franklin && (
        <>
          <form onSubmit={(e) => requestPresentation(e)}>
            <h3>Request A Presentation</h3>
            <select
              name="verifier_label"
              id="verifier_label"
              form="propose_presentation"
              onChange={(event) => {
                setHolder(event.target.value);
                setAttributes([]);
              }}
            >
              <option value={undefined} selected>
                --
              </option>
              {connectionResults.map((connection, index) => (
                <option value={index}>{connection.their_label}</option>
              ))}
            </select>
            <br />
            <label>
              Image Hash:
              <input
                type="text"
                name="image_hash"
                onChange={(event) => {
                  setImageHash(event.target.value);
                }}
              />
            </label>
            <button type="submit">Request</button>
          </form>
        </>
      )}
      <h3>Presentation Exchange Records</h3>
      {presentationResults.map((conn, index) => {
        if (typeof conn.cred_ex_record === typeof {}) {
          return (
            <Presentation
              credentialResults={credentialResults}
              conn={conn.presentation_exchange_id}
              key={conn.connection_id}
              api_url={props.api_url}
              styleObj={
                index % 2 == 1
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "#D3D3D3" }
              }
            />
          );
        } else {
          let temp = {
            state: "Invalid",
            ...conn,
          };
          return (
            <Presentation
              credentialResults={credentialResults}
              conn={temp}
              key={conn.connection_id}
              api_url={props.api_url}
            />
          );
        }
        // return(<p>{JSON.stringify(conn)}</p>);
      })}
    </>
  );
}

const AttributeToggles = ({ credential, updateAttributes }) => (
  <>
    <h4>Attributes to Present</h4>
    {Object.entries(credential.attrs).map((item) => (
      <>
        <label>
          {item[0]}:
          <input
            type="checkbox"
            name={item[0]}
            onChange={() => {
              updateAttributes(item[0]);
            }}
          />
        </label>
        <br />
      </>
    ))}
  </>
);

export default Presentations;
