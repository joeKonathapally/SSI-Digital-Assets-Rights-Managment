import { useState, useEffect } from "react";
import { acceptInvitation } from "../../helper/connection/acceptInvitation";
import { acceptRequest } from "../../helper/connection/acceptRequest";
import { trustPing } from "../../helper/trustPing/trustPing";

function Connection(props) {
  const [state, setstate] = useState(undefined);
  const [shown, setShown] = useState(false);
  const keyValues = [
    "request_id",
    "my_did",
    "their_label",
    "their_did",
    "connection_id",
  ];

  async function acceptInvite() {
    await acceptInvitation(props.api_url, props.conn.connection_id);
  }

  async function acceptReq() {
    await acceptRequest(props.api_url, props.conn.connection_id);
  }

  async function trustping() {
    await trustPing(props.api_url, props.conn.connection_id);
  }

  function actionControl() {
    if (props.conn.rfc23_state === undefined) {
      return <></>;
    } else {
      if (props.conn.rfc23_state === "request-received") {
        return <button onClick={acceptReq}>Accept Request</button>;
      }
      if (props.conn.rfc23_state === "invitation-received") {
        return <button onClick={acceptInvite}>Accept Invitation</button>;
      }
      if (props.conn.rfc23_state === "response-received") {
        return <button onClick={trustping}>Trust Ping</button>;
      }
    }
  }

  useEffect(() => {
    setstate(props.conn.rfc23_state);
  }, [props.conn.rfc23_state]);

  return (
    <div style={props.styleObj}>
      {Object.entries(props.conn).map(([key, val]) => {
        if (keyValues.includes(key)) {
          return (
            <>
              <b>{key}:</b> {val}
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
                  <b>{key}:</b> {val}
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
      <b>State management:</b> {state}
      <br />
      {actionControl()}
      <br />
    </div>
  );
}

export default Connection;
