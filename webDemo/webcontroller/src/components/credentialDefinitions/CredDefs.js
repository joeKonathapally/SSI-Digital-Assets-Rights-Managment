import {getCredDefs} from "../../helper/cred_def/getCredDefs";
import { useState, useEffect } from "react";
import CredDef from "./CredDef";
import CreateCredDef from "./CreateCredDef";

function CredDefs(props){

  const [results, setresults] = useState([]);
  const [credDefId, setcredDefId] = useState(undefined);
  const [issuerDid, setissuerDid] = useState(undefined);
  const [schemaId, setschemaId] = useState(undefined);
  const [schemaIssuerId, setschemaIssuerId] = useState(undefined);
  const [schemaName, setschemaName] = useState(undefined);
  const [schemaVersion, setschemaVersion] = useState(undefined);

  useEffect(() => {
    async function fetchData(){
      let data = await getCredDefs(props.api_url);
      setresults(data);
    }
    fetchData();
  }, []);

  async function updateResults(){
    let credDefIdRaw = credDefId;
    let issuerDidRaw = issuerDid;
    let schemaIdRaw = schemaId;
    let schemaIssuerIdRaw = schemaIssuerId;
    let schemaVersionRaw = schemaVersion;
    let schemaNameRaw = schemaName;

    if(!(credDefId === undefined) && (credDefId === '')){
      credDefIdRaw=undefined;
    }
    if(!(issuerDid === undefined) && (issuerDid === '')){
      issuerDidRaw=undefined;
    }
    if(!(schemaId === undefined) && (schemaId === '')){
      schemaIdRaw=undefined;
    }
    if(!(schemaIssuerId === undefined) && (schemaIssuerId === '')){
      schemaIssuerIdRaw=undefined;
    }
    if(!(schemaVersion === undefined) && (schemaVersion === '')){
      schemaVersionRaw=undefined;
    }
    if(!(schemaName === undefined) && (schemaName === '')){
      schemaNameRaw=undefined;
    }

    // console.log(alias, schemaId, invitationKey, myDid, state, theirDid, theirRole);
    // console.log(aliasRaw, schemaIdRaw, invitationKeyRaw, myDidRaw, stateRaw, theirDidRaw, theirRoleRaw);

    let data = await getCredDefs(props.api_url, credDefIdRaw, issuerDidRaw, schemaIdRaw, schemaIssuerIdRaw, schemaNameRaw, schemaVersionRaw);
    // data.sort(function(a,b){
    //   return Date.parse(b.updated_at) - Date.parse(a.updated_at);
    // })
    setresults(data);
  }

  async function submitFilterforSchemas(event){
    event.preventDefault();
    updateResults();
  }
  
  return(
    <>
      <div>
        <form onSubmit={(event) => submitFilterforSchemas(event)} id="filter">
        <label>
            Credential Definition ID:
            <input type="text" name="cred_def_id" onChange={(event) => {
              setcredDefId(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <label>
            Issuer Did:
            <input type="text" name="issuer_did" onChange={(event) => {
              setissuerDid(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <label>
            Schema ID:
            <input type="text" name="schema_id" onChange={(event) => {
              setschemaId(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <label>
            Schema Issuer ID:
            <input type="text" name="schema_issuer_id" onChange={(event) => {
              setschemaIssuerId(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <label>
            Schema Name:
            <input type="text" name="schema_name" onChange={(event) => {
              setschemaName(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <label>
            Schema Version:
            <input type="text" name="schema_version" onChange={(event) => {
              setschemaVersion(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <button type="submit">Search credential definitions</button>
        </form>
      </div>
      <br/>
      <CreateCredDef api_url={props.api_url} hook_url={props.hook_url}/>
      <br/>
      {results.map((conn) => {
        // return(<Connection conn={conn} key={conn.connection_id} api_url={props.api_url}/>);
        return(<CredDef api_url={props.api_url} hook_url={props.hook_url} cred_def_id={conn}/>);
      })}
    </>
  );
}

export default CredDefs;