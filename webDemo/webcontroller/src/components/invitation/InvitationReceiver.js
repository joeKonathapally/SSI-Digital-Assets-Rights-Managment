import './Invitation.css';
import { useState } from "react";
import {receiveInvitation} from '../../helper/connection/receiveInvitation';

function InvitationReceiver(props){

  const [alias, setalias] = useState(undefined);
  const [autoAccept, setautoAccept] = useState(true);
  const [mediationId, setmediationId] = useState(undefined)
  const [body, setbody] = useState(undefined);
  const [inviteStoreSuccess, setinviteStoreSuccess] = useState(undefined)


  async function submitRequestForInvitation(event){
    event.preventDefault();

    let bodyRaw;
    let aliasRaw;
    let mediationIdRaw;

    if(!(alias===undefined)){
      if((alias==='')){
        setalias(undefined);
      }else{
        aliasRaw = alias.trim();
      }
    }
    if(!(mediationId===undefined)){
      if((mediationId==='')){
        setmediationId(undefined);
      }else{
        mediationIdRaw = mediationId.trim();
      }
    }
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
    // console.log(aliasRaw, autoAccept, mediationId, bodyRaw);
    let storeFlag = await receiveInvitation(props.api_url, aliasRaw, autoAccept, mediationIdRaw, bodyRaw)
    setautoAccept(true);
    setalias(undefined);
    setmediationId(undefined);
    setbody(undefined);
    setinviteStoreSuccess(storeFlag.status);
    if(!storeFlag.status){
      console.log(storeFlag.error);
    }
  }

  return(
    <>
      <div className="invitation-receiver">
        <form onSubmit={(event) => submitRequestForInvitation(event)}>
          <label>
            Alias:
            <input type="text" name="alias" onChange={(event) => {
              setalias(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <label>
            Mediation ID:
            <input type="text" name="alias" onChange={(event) => {
              setmediationId(event.target.value);
            }} />
            <br/>
          </label>
          <br/>
          <label>
            Auto accept:
            <input type="radio" id="auto_accept_true" name="auto_accept" value="True" onChange={() => setautoAccept(true)} checked/>
            <label>True</label>
            <input type="radio" id="auto_accept_false" name="auto_accept" value="False" onChange={() => setautoAccept(false)}/>
            <label>False</label><br/>
          </label>
          <br/>
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
      <div className="invitation-receiver">
        {(inviteStoreSuccess === undefined) ? (
          <></>
        ) : (
          (inviteStoreSuccess) ?(
            <p>Succesfully stored invite in the wallet</p>
          ) : (
            <p>Failed to store the invite in the wallet</p>
          )
        )}
      </div>
    </>
  );

};

export default InvitationReceiver;