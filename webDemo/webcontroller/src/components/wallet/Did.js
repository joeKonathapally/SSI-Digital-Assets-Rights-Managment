import { useState, useEffect } from "react";
import {registerPublicDid} from "../../helper/ledger/registerPublicDid";
import {getRole} from "../../helper/ledger/getRole";
import {assignPublicDid} from "../../helper/wallet/assignPublicDid";

function Did(props){

  const [alias, setalias] = useState(undefined);
  const [role, setrole] = useState(undefined);

  function getAttributes(){
    let content=[];
    for (var val in props.did){
      let temp = <>{val}: {JSON.stringify(props.did[val])}<br/></>;
      content.push(temp)
    }
    return content;
  }

  useEffect(() => {
    getR()
  }, [props.did.posture]);

  async function registerPublic(e) {
    e.preventDefault();
    let temp;
    if(role === "--"){
      temp = undefined;
    } else {
      temp = role;
    }
    await registerPublicDid(props.api_url, props.did.did, props.did.verkey, alias, temp);
    props.updateCB();
  }

  async function getR(){
    let role;
    if(props.did.posture === "posted"){
      let data = await getRole(props.api_url, props.did.did);
      setrole(data) 
    } else {
      setrole(undefined)
    }
  }

  async function assignPubDid() {
    await assignPublicDid(props.api_url, props.did.did);
    props.updateCB();
  }

  function actionControl(){
    if(props.did.posture === undefined){
      return <></>;
    }else{
      if(props.did.posture=== "wallet_only"){
        return(
          <>
             <div>
              <form onSubmit={(event) => registerPublic(event)} id="filtery">
                <label>
                  Alias:
                  <input type="text" name="alias" onChange={(event) => {
                    setalias(event.target.value);
                  }} />
                  <br/>
                </label>
                <br/>
                <label>
                  Role:
                  <select id="alias" onChange={(event) => {
                    setalias(event.target.value);
                  }}>
                    <option value={"--"} checked>--</option>
                    <option value={"STEWARD"}>STEWARD</option>
                    <option value={"TRUSTEE"}>TRUSTEE</option>
                    <option value={"ENDORSER"}>ENDORSER</option>
                    <option value={"NETWORK_MONITOR"}>NETWORK_MONITOR</option>
                    <option value={"reset"}>reset</option>
                  </select> 
                </label>
                <br/>
                <button type="submit">Register public did</button>
              </form>
            </div>
            {/* <button onClick={registerPublic}>Register public did</button> */}
          </>
        );
      }
      if((props.did.posture === "posted") && (!props.isPublic)){
        return(
          <>
            <button onClick={assignPubDid}>Assign as public did</button>
          </>
        );
      }
    }
  }

  return(
    <>
      {getAttributes()}
      {(role === undefined) ? (
        <></>
      ) : (
        <>
          <p>Public role: {role}</p>
        </>
      )}
      {actionControl()}
      <br/>
    </>
  );

};

export default Did;