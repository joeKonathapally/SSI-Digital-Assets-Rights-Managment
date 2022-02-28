import { useEffect } from "react";
import { useState } from "react";
import { getConnections } from "../../helper/connection/getConnections";
import { getCredentialExchanges } from "../../helper/credentialExchange/getCredentialExchanges";
import { getCredentials } from "../../helper/credential/getCredentials";
import { sendCredentialProposal } from "../../helper/credentialExchange/sendCredentialProposal";
import { sendPresentationProposal } from "../../helper/presentations/sendPresentationProposal";
import Credential from "./credential";
import universalStore from "../../universalObject.json";
import crypto from "crypto-js";
import random from "random-string-generator";
import { uploadImage } from "../../helper/fileServer/uploadImage";

import "./Credentials.css";

function Credentials(props) {
  const [credentialExchangeResults, setCredentialExchangeResults] = useState(
    []
  );
  const [credentialResults, setCredentialResults] = useState([]);
  const [connectionResults, setConnectionResults] = useState([]);
  const [issuer, setIssuer] = useState("--");
  const [args, setArgs] = useState({});
  const [credential, setCredential] = useState("--");

  useEffect(() => {
    async function fetchData() {
      let connectionsData = await getConnections(props.api_url);
      // console.log(connectionsData);
      setConnectionResults(connectionsData);
      let credentialsData = await getCredentialExchanges(props.api_url);
      // console.log(credentialsData);
      let temp = [];
      credentialsData.map((conn) => {
        if (typeof conn.cred_ex_record === typeof {}) {
          temp.push(conn.cred_ex_record);
        } else {
          let tempy = {
            state: "Invalid",
            ...conn,
          };
          temp.push(tempy);
        }
      });
      setCredentialExchangeResults(temp);
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
    const ws = new WebSocket(props.hook_url + "topic/issue_credential_v2_0");

    ws.onopen = function open() {
      ws.send("web controller connected");
    };

    ws.onmessage = (e) => {
      // console.log('Something:'+JSON.parse(e.data));
      // console.log(Date.parse(JSON.parse(e.data).updated_at));
      console.log("incoming");
      setCredentialExchangeResults((results) => {
        let temp = [];
        results.map((element) => {
          console.log(JSON.parse(e.data).cred_ex_id);
          console.log(element);
          if (!(JSON.parse(e.data).cred_ex_id === element.cred_ex_id)) {
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
  async function updateCredentialResults() {
    let data = await getCredentialExchanges(props.api_url);
    data.sort(function (a, b) {
      return Date.parse(b.updated_at) - Date.parse(a.updated_at);
    });
    setCredentialResults(data);
  }

  async function cavendishCredentialProposal(e) {
    e.preventDefault();
    let issuerConnectionRecord = connectionResults[issuer];
    let body = {};
    body.connection_id = issuerConnectionRecord.connection_id;
    body.credential_preview = {};
    body.credential_preview.type = "issue-credential/2.0/credential-preview";
    //Loop through args and add the other information that is needed for that specific "attribute" in the request
    body.credential_preview.attributes = Object.entries(args).map((item) => ({
      name: item[0],
      value: item[1],
    }));

    body.filter = {};
    body.filter.indy =
      connectionResults[issuer].their_label === "cavendish"
        ? universalStore.photographerCertification
        : universalStore.imageAuthorship;
    const proposalResponse = await sendCredentialProposal(props.api_url, body);
    console.log(proposalResponse);
  }

  function updateArgs(arg) {
    setArgs((prevState) => ({
      ...prevState,
      ...arg,
    }));
  }

  const thodayCredentialProposal = async (e) => {
    e.preventDefault();
    let issuerConnectionRecord = connectionResults[issuer];
    let body = {};
    body.connection_id = issuerConnectionRecord.connection_id;
    body.comment = JSON.stringify({
      flag: "ImageCredentialRequest",
      ...args,
    });
    body.presentation_proposal = {};
    body.presentation_proposal["@type"] =
      "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/present-proof/1.0/presentation-preview";
    body.auto_present = true;
    body.presentation_proposal.attributes = [
      {
        referent: credentialResults[credential].referent,
        name: "isMember",
        cred_def_id: credentialResults[credential].cred_def_id,
      },
    ];
    body.presentation_proposal.predicates = [];
    console.log(body);
    const proposalResponse = await sendPresentationProposal(
      props.api_url,
      body
    );
    console.log(proposalResponse);
  };

  return (
    <>
      <div>
        <form
          onSubmit={(e) =>
            connectionResults[issuer].their_label === "cavendish"
              ? cavendishCredentialProposal(e)
              : thodayCredentialProposal(e)
          }
          id="propose_credential"
        >
          <h3>Apply for a Credential</h3>
          <label>
            Issuer:
            <select
              name="issuer_label"
              id="issuer_label"
              form="propose_credential"
              onChange={(event) => {
                setIssuer(event.target.value);

                connectionResults[event.target.value].their_label ===
                "cavendish"
                  ? setArgs({ isMember: "true" })
                  : setArgs({});
              }}
            >
              <option value={undefined} selected>
                --
              </option>
              {connectionResults.map((connection, index) => {
                if(connection.their_label === undefined){
                  return <></>;
                } else {
                  return <option value={index}>{connection.their_label}</option>;
                }
              })}
            </select>
          </label>
          {issuer !== "--" &&
            connectionResults[issuer].their_label === "endorser" && (
              <>
                <br />
                <b>Endorser does not issue any credentials.</b>
              </>
            )}

          {issuer !== "--" &&
            connectionResults[issuer].their_label === "cavendish" && (
              <>
                <br />
                <label>
                  <br />
                  Legal Name:
                  <input
                    type="text"
                    name="legal_name"
                    onChange={(event) => {
                      updateArgs({ legalName: event.target.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  Username:
                  <input
                    type="text"
                    name="username"
                    onChange={(event) => {
                      updateArgs({ userName: event.target.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  Employer:
                  <input
                    type="text"
                    name="employer"
                    onChange={(event) => {
                      updateArgs({ employer: event.target.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  Instagram Handle:
                  <input
                    type="text"
                    name="instagram_handle"
                    onChange={(event) => {
                      updateArgs({ instagramHandle: event.target.value });
                    }}
                  />
                  <br />
                </label>
              </>
            )}
          {issuer !== "--" &&
            connectionResults[issuer].their_label === "thoday" && (
              <>
                <br />
                <label>
                  Credential:
                  <select
                    name="credential_label"
                    id="credential_label"
                    onChange={(event) => {
                      setCredential(event.target.value);
                    }}
                  >
                    <option value={undefined} selected>
                      --
                    </option>
                    {credentialResults.map((cred, index) => {
                      // console.log(cred.cred_def_id);
                      if(cred.cred_def_id === universalStore.photographerCertification.cred_def_id){
                        return <option value={index}>{cred.referent}</option>;
                      } else {
                        return <></>;
                      }
                    })}
                  </select>
                </label>
                <br />
                <label>
                  <br />
                  Image File:
                  <input
                    type="file"
                    name="image_hash"
                    onChange={(event) => {
                      updateArgs({ imgHash: event.target.value });
                      let image = new FileReader();
                      image.onload = function (e) {
                        console.log(e.target.result);
                        let input = e.target.result.split(",")[1];
                        let hash = crypto.SHA3(input);
                        hash = hash.toString(crypto.enc.Hex);
                        let filename = "";
                        filename += random(20);
                        filename += event.target.files[0].name;
                        console.log(filename);
                        updateArgs({ imgHash: hash });
                        updateArgs({ imgUrl: filename });
                        uploadImage(event.target.files[0], filename);
                      };
                      image.onerror = function (e) {
                        console.log(e);
                      };
                      image.readAsDataURL(event.target.files[0]);
                    }}
                  />
                </label>
                <br />
                <label>
                  <br />
                  Image Hash:
                  <input
                    type="text"
                    name="image_hash"
                    value={args.imgHash === undefined ? "" : args.imgHash}
                    onChange={(event) => {
                      updateArgs({ imgHash: event.target.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  Image Timestamp:
                  <input
                    type="text"
                    name="image_timestamp"
                    onChange={(event) => {
                      updateArgs({ imgTimestamp: event.target.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  Cameras Mac Address:
                  <input
                    type="text"
                    name="mac_address"
                    onChange={(event) => {
                      updateArgs({ macAddress: event.target.value });
                    }}
                  />
                  <br />
                </label>
                <br />
                <label>
                  GeoLocation Data:
                  <input
                    type="text"
                    name="mac_address"
                    onChange={(event) => {
                      updateArgs({ geolocation: event.target.value });
                    }}
                  />
                  <br />
                </label>
              </>
            )}

          {issuer !== "--" && args !== [] && (
            <>
              <br />
              <button type="submit">Apply</button>
            </>
          )}
        </form>
      </div>
      <br />
      <h3>Credential Exchange Records</h3>
      {credentialExchangeResults.map((conn, index) => {
        if (typeof conn.cred_ex_record === typeof {}) {
          return (
            <Credential
              conn={conn.cred_ex_record}
              key={conn.connection_id}
              api_url={props.api_url}
            />
          );
        } else {
          let temp = {
            state: "Invalid",
            ...conn,
          };
          return (
            <Credential
              conn={temp}
              key={conn.connection_id}
              api_url={props.api_url}
              styleObj={
                index % 2 == 1
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "#D3D3D3" }
              }
            />
          );
        }
      })}
    </>
  );
}

export default Credentials;
