import { useEffect, useState } from "react";
import { getImagesFromRegistry } from "../../helper/fileServer/getImagesFromRegistry";
import { imageHash } from "../../helper/fileServer/imageHash";
import { createInvitation } from "../../helper/connection/createInvitation";
import QRCode from "qrcode.react";
import { acceptRequest } from "../../helper/connection/acceptRequest";
import { trustPing } from "../../helper/trustPing/trustPing";
import { verifyPresentation } from "../../helper/presentations/verifyPresentation";
import { sendPresentationRequest } from "../../helper/presentations/sendPresentationRequest";
import universalStore from "../../universalObject.json";

function ArtCompetition() {
  const API_URL = process.env.REACT_APP_FRANKLIN_API;
  const HOOK_URL = process.env.REACT_APP_FRANKLIN_HOOK;

  const [args, setArgs] = useState({});
  const [isForm, setisForm] = useState(true);
  const [isVerifier, setisVerifier] = useState(false);
  const [isVerified, setisVerified] = useState(false);
  const [isConnected, setisConnected] = useState(false);
  const [requestSent, setrequestSent] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isFailure, setisFailure] = useState(false);
  const [presentationReqeustSent, setpresentationRequestSent] = useState(false);
  const [images, setimages] = useState([]);
  const [connectionId, setconnectionId] = useState("");
  const [invite, setinvite] = useState(undefined);
  const [inviteUrl, setinviteUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      let image = await getImagesFromRegistry();
      setimages(image);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let invite = await createInvitation(API_URL);
      setconnectionId(invite.connection_id);
      setinvite(invite.invitation);
      setinviteUrl(invite.invitation_url);
    }
    fetchData();
  }, []);

  function updateArgs(arg) {
    setArgs((prevState) => ({
      ...prevState,
      ...arg,
    }));
  }

  function submitFormStage1() {
    setisForm(false);
    setisVerifier(true);
  }

  useEffect(() => {
    const ws = new WebSocket(HOOK_URL + "topic/connections");

    ws.onopen = function open() {
      ws.send("web controller connected");
    };

    ws.onmessage = (e) => {
      setconnectionId((connId) => {
        // console.log(JSON.parse(e.data));
        if (JSON.parse(e.data).connection_id === connId) {
          if (JSON.parse(e.data).rfc23_state === "request-received") {
            acceptRequest(API_URL, connId);
            return connId;
          } else if (JSON.parse(e.data).rfc23_state === "response-sent") {
            setTimeout(() => {
              trustPing(API_URL, connId);
            }, 1000);
            return connId;
          } else if (JSON.parse(e.data).rfc23_state === "completed") {
            setisConnected(true);
            return connId;
          } else {
            return connId;
          }
        } else {
          return connId;
        }
      });
    };

    return () => {
      ws.close();
    };
  }, [args]);

  useEffect(() => {
    if (isConnected) {
      let body = {};
      body.connection_id = connectionId;
      body.comment = JSON.stringify({
        flag: "ImageAuthorshipRequest",
        imgHash: args.imgHash,
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
      sendPresentationRequest(API_URL, body);
      setrequestSent(true);
    }
  }, [isConnected, args]);

  useEffect(() => {
    const ws = new WebSocket(HOOK_URL + "topic/present_proof");

    ws.onopen = function open() {
      ws.send("web controller connected");
    };

    ws.onmessage = (e) => {
      setconnectionId((connId) => {
        if (JSON.parse(e.data).connection_id === connId) {
          if (JSON.parse(e.data).state === "presentation_received") {
            verifyPresentation(
              API_URL,
              JSON.parse(e.data).presentation_exchange_id
            );
            return connId;
          } else if (JSON.parse(e.data).state === "verified") {
            setisVerified(true);
            return connId;
          } else {
            return connId;
          }
        }
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      {isForm && (
        <div>
          <form onSubmit={(event) => submitFormStage1()} id="competition">
            <label>
              Name:
              <input
                type="text"
                name="name"
                onChange={(event) => {
                  updateArgs({ name: event.target.value });
                }}
              />
              <br />
            </label>
            <br />
            <label>
              Description:
              <input
                type="text"
                name="description"
                onChange={(event) => {
                  updateArgs({ name: event.target.value });
                }}
              />
            </label>
            <br />
            <label>
              Select Image:
              <br />
              {images.map((image) => {
                return (
                  <img
                    src={
                      process.env.REACT_APP_FILE_SERVER_URL +
                      "imageRegistry/" +
                      image
                    }
                    height={200}
                    onClick={async () => {
                      let hash = (await imageHash(image)).data.message;
                      updateArgs({ imgUrl: image });
                      updateArgs({ imgHash: hash });
                    }}
                  />
                );
              })}
              <br />
            </label>
            <br />
            <button type="submit">Begin verification</button>
          </form>
        </div>
      )}
      {isVerifier && (
        <>
          <QRCode value={inviteUrl} size={400} />
          <p>{JSON.stringify(invite)}</p>
          {!isConnected ? (
            <p>You are not connected</p>
          ) : (
            <p>You are connected</p>
          )}
          {!requestSent ? (
            <p>Presentation request has not been sent</p>
          ) : (
            <p>Presentation request has been sent</p>
          )}
          {!isVerified ? (
            <p>Your image is yet to be verified as yours</p>
          ) : (
            <>
              <p>Verified!!!</p>
              <button
                onClick={() => {
                  setisSuccess(true);
                }}
              />
            </>
          )}
        </>
      )}
      {isSuccess && <p>Success</p>}
      {isFailure && <p>Fail</p>}
    </>
  );
}

export default ArtCompetition;
