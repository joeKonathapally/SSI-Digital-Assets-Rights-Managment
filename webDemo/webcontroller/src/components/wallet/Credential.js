import { deleteCredentialId } from "../../helper/credential/deleteCredentialId";

function Credential(props){

  function getAttributes(){
    let content=[];
    for (var val in props.cred){
      let temp = <>{val}: {JSON.stringify(props.cred[val])}<br/></>;
      content.push(temp)
    }
    return content;
  }

  async function deleteCred() {
    await deleteCredentialId(props.api_url, props.cred.referent);
    props.updateCB();
  }

  return(
    <>
      {getAttributes()}
      <button onClick={deleteCred}>Delete credential</button>
      <br/>
    </>
  );

};

export default Credential;