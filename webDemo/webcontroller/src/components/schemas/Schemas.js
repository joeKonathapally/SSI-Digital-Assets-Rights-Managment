import {getSchemas} from "../../helper/schema/getSchemas";
import { useState, useEffect } from "react";
import Schema from "./Schema";
import CreateSchema from "./CreateSchema";

function Schemas(props){

  const [results, setresults] = useState([]);
  const [schemaId, setschemaId] = useState(undefined);
  const [schemaIssuerId, setschemaIssuerId] = useState(undefined);
  const [schemaName, setschemaName] = useState(undefined);
  const [schemaVersion, setschemaVersion] = useState(undefined);

  useEffect(() => {
    async function fetchData(){
      let data = await getSchemas(props.api_url);
      setresults(data);
    }
    fetchData();
  }, []);

  async function updateResults(){
    let schemaIdRaw = schemaId;
    let schemaIssuerIdRaw = schemaIssuerId;
    let schemaVersionRaw = schemaVersion;
    let schemaNameRaw = schemaName;

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

    let data = await getSchemas(props.api_url, schemaIdRaw, schemaIssuerIdRaw, schemaNameRaw, schemaVersionRaw);
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
          <button type="submit">Search schemas</button>
        </form>
      </div>
      <br/>
      <CreateSchema api_url={props.api_url} hook_url={props.hook_url}/>
      <br/>
      {results.map((conn) => {
        // return(<Connection conn={conn} key={conn.connection_id} api_url={props.api_url}/>);
        return(<Schema api_url={props.api_url} hook_url={props.hook_url} schema_id={conn}/>);
      })}
    </>
  );
}

export default Schemas;