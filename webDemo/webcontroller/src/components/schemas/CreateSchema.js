import {createSchema} from "../../helper/schema/createSchema";
import {getConnections} from "../../helper/connection/getConnections";
import { useState, useEffect } from "react";
import {endorserCreateRequest} from "../../helper/endorser/endorserCreateRequest";


function CreateSchema(props){

  const [body, setbody] = useState({});
  const [connId, setconnId] = useState(undefined);
  const [endorseTransaction, setEndorseTransaction] = useState(false);
  const [connections, setConnections] = useState(new Array());

  async function createSchemaSubmit(event){
    event.preventDefault();

    let bodyRaw;

    if((body===undefined) || (body==='{}') || (body==='')){
      bodyRaw = {};
    }else{
      try{
        bodyRaw = await JSON.parse(body);
      }catch(e){
        console.log(e);
        console.log("Invalid JSON in the body");
        return;
      }
    }
    // console.log(connId, endorseTransaction, bodyRaw);
    let txn = await createSchema(props.api_url, connId, endorseTransaction, bodyRaw);
    let end = await endorserCreateRequest(props.api_url, txn.txn.transaction_id, true);
    // console.log(end);
  }

  useEffect(() => {
    async function fetchEndorserConnections(){
      let tempConnections = [];
      let data = await getConnections(props.api_url, 'endorser');
      // console.log(data);
      for (var val in data){
        // console.log(data[val]);
        tempConnections.push(data[val].connection_id);
      }
      // console.log(tempConnections);
      setConnections(tempConnections);
    }
    fetchEndorserConnections();
  }, [])

  return(
    <>
      <div>
        <form onSubmit={(event) => createSchemaSubmit(event)} id="filtery">
        <label>
            Body:
            <br/>
            <textarea rows="5" cols="60" name="body" placeholder="{}" onChange={(event) => setbody(event.target.value)}/>
            <br/>
          </label>
          <br/>
          <label>
            Connection Id:
            <select id="connection_id" onChange={(event) => {
              // console.log(event.target.value);
              setconnId(event.target.value);
            }}>
              <option value={"--"}>--</option>
              {connections.map((conn, key) => <option key={key} value={conn}>{conn}</option>)}
            </select> 
          </label>
          <br/>
          <label>
            Endorse transaction:
            <input type="radio" id="endorse_transaction_true" name="endorse_transaction" value="True" onChange={() => setEndorseTransaction(true)}/>
            <label>True</label>
            <input type="radio" id="endorse_transaction_false" name="endorse_transaction" value="False" onChange={() => setEndorseTransaction(false)} checked/>
            <label>False</label><br/>
          </label>
          <br/>
          <button type="submit">Create schema</button>
        </form>
      </div>
    </>
  );
};

export default CreateSchema;