import { useEffect } from "react";
import { useState } from "react";
import { getConnections } from "../../helper/connection/getConnections";
import Connection from "./Connection";
import "./Connections.css";

function Connections(props) {
  const [results, setresults] = useState([]);
  const [alias, setalias] = useState(undefined);
  const [connectionProtocol, setconnectionProtocol] = useState(undefined);
  const [invitationKey, setinvitationKey] = useState(undefined);
  const [myDid, setmyDid] = useState(undefined);
  const [state, setstate] = useState(undefined);
  const [theirDid, settheirDid] = useState(undefined);
  const [theirRole, settheirRole] = useState(undefined);

  useEffect(() => {
    async function fetchData(){
      let data = await getConnections(props.api_url, undefined,undefined,undefined,undefined,undefined,undefined,undefined);
      data = await data.filter((element) =>  {
        if(element.alias === undefined){
          return true;
        } else {
          if((element.alias === "public") && (element.rfc23_state === "invitation-sent")){
            return false;
          } else {
            return true;
          }
        }
      })
      await data.sort(function (a, b) {
        return Date.parse(b.updated_at) - Date.parse(a.updated_at);
      });
      setresults(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(props.hook_url + "topic/connections");

    ws.onopen = function open() {
      ws.send("web controller connected");
    };

    ws.onmessage = (e) => {
      //   console.log(JSON.parse(e.data));
      //   console.log(Date.parse(JSON.parse(e.data).updated_at));
      setresults((results) => {
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

  async function updateResults() {
    let connectionProtocolRaw = connectionProtocol;
    let stateRaw = state;
    let theirRoleRaw = theirRole;
    let aliasRaw = alias;
    let invitationKeyRaw = invitationKey;
    let myDidRaw = myDid;
    let theirDidRaw = theirDid;

    if (!(connectionProtocol === undefined) && connectionProtocol === "--") {
      connectionProtocolRaw = undefined;
    }
    if (!(state === undefined) && state === "--") {
      stateRaw = undefined;
    }
    if (!(theirRole === undefined) && theirRole === "--") {
      theirRoleRaw = undefined;
    }
    if (!(alias === undefined) && alias === "") {
      aliasRaw = undefined;
    }
    if (!(invitationKey === undefined) && invitationKey === "") {
      invitationKeyRaw = undefined;
    }
    if (!(myDid === undefined) && myDid === "") {
      myDidRaw = undefined;
    }
    if (!(theirDid === undefined) && theirDid === "") {
      theirDidRaw = undefined;
    }

    // console.log(alias, connectionProtocol, invitationKey, myDid, state, theirDid, theirRole);
    // console.log(aliasRaw, connectionProtocolRaw, invitationKeyRaw, myDidRaw, stateRaw, theirDidRaw, theirRoleRaw);

    let data = await getConnections(
      props.api_url,
      aliasRaw,
      connectionProtocolRaw,
      invitationKeyRaw,
      myDidRaw,
      stateRaw,
      theirDidRaw,
      theirRoleRaw
    );
    data.sort(function (a, b) {
      return Date.parse(b.updated_at) - Date.parse(a.updated_at);
    });
    setresults(data);
  }

  useEffect(() => {
    updateResults();
  }, [alias, connectionProtocol, state, theirRole]);

  async function submitFilterforConnections(event) {
    event.preventDefault();
    updateResults();
  }

  return (
    <>
      <div>
        <form
          onSubmit={(event) => submitFilterforConnections(event)}
          id="filter"
        >
          <label>
            Alias:
            <input
              type="text"
              name="alias"
              onChange={(event) => {
                setalias(event.target.value);
              }}
            />
            <br />
          </label>
          <br />
          <label>
            Connection Protocol:
            <select
              name="connection_protocol"
              id="connection_protocol"
              form="filter"
              onChange={(event) => {
                setconnectionProtocol(event.target.value);
              }}
            >
              <option value="--" selected>
                --
              </option>
              <option value="connections/1.0">connections/1.0</option>
              <option value="didexchange/1.0">didexchange/1.0</option>
            </select>
          </label>
          <br />
          <label>
            Invitation Key:
            <input
              type="text"
              name="invitation_key"
              onChange={(event) => {
                setinvitationKey(event.target.value);
              }}
            />
            <br />
          </label>
          <br />
          <label>
            My DID:
            <input
              type="text"
              name="my_did"
              onChange={(event) => {
                setmyDid(event.target.value);
              }}
            />
            <br />
          </label>
          <br />
          <label>
            Connection state:
            <select
              name="connection_state"
              id="connection_state"
              form="filter"
              onChange={(event) => {
                setstate(event.target.value);
              }}
            >
              <option value="--" selected>
                --
              </option>
              <option value="request">request</option>
              <option value="completed">completed</option>
              <option value="start">start</option>
              <option value="active">active</option>
              <option value="response">response</option>
              <option value="invitation">invitation</option>
              <option value="init">init</option>
              <option value="error">error</option>
              <option value="abandoned">abandoned</option>
            </select>
          </label>
          <br />
          <label>
            Their DID:
            <input
              type="text"
              name="their_did"
              onChange={(event) => {
                settheirDid(event.target.value);
              }}
            />
            <br />
          </label>
          <br />
          <label>
            Their role:
            <select
              name="their_role"
              id="their_role"
              form="filter"
              onChange={(event) => {
                settheirRole(event.target.value);
              }}
            >
              <option value="--" selected>
                --
              </option>
              <option value="invitee">invitee</option>
              <option value="requester">requester</option>
              <option value="inviter">inviter</option>
              <option value="responder">responder</option>
            </select>
          </label>
          <br />
          <button type="submit">Search connections</button>
        </form>
      </div>
      <br />
      {results.map((conn, index) => {
        return (
          <Connection
            conn={conn}
            key={conn.connection_id}
            api_url={props.api_url}
            styleObj={
              index % 2 == 1
                ? { backgroundColor: "white" }
                : { backgroundColor: "#D3D3D3" }
            }
          />
        );
        // return(<p>{JSON.stringify(conn)}</p>);
      })}
    </>
  );
}

export default Connections;
