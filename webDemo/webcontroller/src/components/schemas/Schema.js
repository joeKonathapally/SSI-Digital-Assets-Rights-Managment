import { useState, useEffect } from "react";
import {getSchemaId} from "../../helper/schema/getSchemaId";

function Schema(props){

  const [schema, setschema] = useState(undefined);

  useEffect(async () => {
    async function getDetails(){
      let data = await getSchemaId(props.api_url, props.schema_id);
      setschema(data);
    }

    await getDetails();
  }, [props.schema_id]);

  function getAttributes(){
    let content=[];
    for (var val in schema){
      let temp = <>{val}: {schema[val]}<br/></>;
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

export default Schema;