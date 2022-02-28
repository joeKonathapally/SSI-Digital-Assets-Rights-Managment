import { useState, useEffect } from "react";
import { sendCredentialOffer } from "../../helper/credentialExchange/sendCredentialOffer";
import { sendCredentialRequest } from "../../helper/credentialExchange/sendCredentialRequest";
import { issueCredentials } from "../../helper/credentialExchange/issueCredentials";
import { storeCredentials } from "../../helper/credentialExchange/storeCredentials";

const keyValues = [
  "cred_ex_id",
  "connection_id",
  "cred_proposal",
  "cred_offer",
];

function Credential(props) {
  const [shown, setShown] = useState(false);

  function actionControl() {
    if (props.conn.state === undefined) {
      return <></>;
    } else {
      if (props.conn.state === "proposal-received") {
        return (
          <button
            onClick={() =>
              sendCredentialOffer(props.api_url, props.conn.cred_ex_id)
            }
          >
            Send offer
          </button>
        );
      }
      if (props.conn.state === "offer-received") {
        return (
          <button
            onClick={() =>
              sendCredentialRequest(props.api_url, props.conn.cred_ex_id)
            }
          >
            Send request
          </button>
        );
      }
      if (props.conn.state === "request-received") {
        return (
          <button
            onClick={() =>
              issueCredentials(props.api_url, props.conn.cred_ex_id)
            }
          >
            Send credentials
          </button>
        );
      }
      if (props.conn.state === "credential-received") {
        return (
          <button
            onClick={() =>
              storeCredentials(props.api_url, props.conn.cred_ex_id)
            }
          >
            store credential
          </button>
        );
      }
    }
  }

  return (
    <div style={props.styleObj}>
      {Object.entries(props.conn).map(([key, val]) => {
        if (keyValues.includes(key)) {
          return (
            <>
              <b>{key}:</b> {JSON.stringify(val)}
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
                  <b>{key}:</b> {JSON.stringify(val)}
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
      State management: {props.conn.state}
      <br />
      {actionControl()}
      <br />
      <br />
    </div>
  );
}

export default Credential;
