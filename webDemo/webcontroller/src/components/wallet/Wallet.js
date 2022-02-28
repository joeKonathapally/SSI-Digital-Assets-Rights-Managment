import { useEffect, useState } from "react";
import { getDids } from "../../helper/wallet";
import { getPublicDid } from "../../helper/wallet";
import { getConnections } from "../../helper/connection/getConnections";
import Did from "./Did";
import { getCredentials } from "../../helper/credential/getCredentials";
import Credential from "./Credential";
import CreateDid from "./CreateDid";

function Wallet(props){

  const [didResults, setdidResults] = useState([]);
  const [publicDid, setpublicDid] = useState(undefined);
  const [flag, setflag] = useState(true);
  const [credResults, setcredResults] = useState([]);

  useEffect(() => {
    async function fetchData(){
      let data = await getDids(props.api_url);
      let pDid = await getPublicDid(props.api_url);
      let creds = await getCredentials(props.api_url);
      data = await data.filter((did) => {
        try{
          return !(did.did === pDid.did);
        }catch(e){
          return true;
        }
      })
      setpublicDid(pDid)
      setdidResults(data);
      setcredResults(creds);
    }
    fetchData();
  }, [flag]);

  function updateDids(){
    setflag(!flag);
  }

  return(
    <>
      <h1>Did management</h1>
      <br/>
      <h3>Public Did</h3>
      {(!(publicDid === undefined) && !(publicDid === null)) ? (
        <>
          <Did did={publicDid} key={publicDid.did} api_url={props.api_url} updateCB={updateDids} isPublic={true}/>
        </>
      ) : (
        <h4>No public did</h4>
      )}
      <hr/>
      <CreateDid api_url={props.api_url} updateCB={updateDids}/>
      <hr/>
      {didResults.map((conn) => {
        return(<><Did did={conn} key={conn.did} api_url={props.api_url} updateCB={updateDids} isPublic={false}/><br/></>);
      })}
      <hr/>
      <h1>Credential management</h1>
      {credResults.map((conn) => {
        return(<><Credential cred={conn} key={conn.cred_def_id} api_url={props.api_url} updateCB={updateDids}/><br/></>);
      })}
    </>
  ); 
}

export default Wallet;