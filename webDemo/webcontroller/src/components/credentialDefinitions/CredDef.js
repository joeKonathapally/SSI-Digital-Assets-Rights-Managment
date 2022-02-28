import { useState, useEffect } from "react";
import {getCredDefId} from "../../helper/cred_def/getCredDefId";

function CredDef(props){

  const [credDef, setcredDef] = useState(undefined);

  useEffect(async () => {
    async function getDetails(){
      let data = await getCredDefId(props.api_url, props.cred_def_id);
      setcredDef(data.credential_definition);
    }

    await getDetails();
  }, [props.cred_def_id]);

  function getAttributes(){
    let content=[];
    for (var val in credDef){
      let temp = <>{val}: {JSON.stringify(credDef[val])}<br/></>;
      content.push(temp)
    }
    return content;
  }

  return(
    <>
      {getAttributes()}
      <br/>
    </>
  );

};

export default CredDef;