import {useState, useEffect} from "react";
import {createDid} from "../../helper/wallet/createDid";

function CreateDid(props){

  const [body, setbody] = useState(undefined);

  async function submitRequestForDid(event){
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
    let res = await createDid(props.api_url, bodyRaw);
    props.updateCB();
  }

  return (
    <>
      <h2>Create Did</h2>
      <div className="did_creator">
        <form onSubmit={(event) => submitRequestForDid(event)}>
          <label>
            Body:
            <br/>
            <textarea rows="5" cols="60" name="body" placeholder="{}" onChange={(event) => setbody(event.target.value)}/>
            <br/>
          </label>
          <br/>
          <button type="submit">Receive invitation</button>
        </form>
      </div>
    </>
  );
}

export default CreateDid;