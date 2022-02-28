import {createInvitation} from "../../helper/connection/createInvitation";
import './Invitation.css';
import QRCode from 'qrcode.react';
import { useState } from "react";

function InvitationGenerator(props){

  const [invite, setinvite] = useState(undefined);
  const [inviteUrl, setinviteUrl] = useState('');
  const [alias, setalias] = useState(undefined);
  const [publicDid, setpublicDid] = useState(false);
  const [autoAccept, setautoAccept] = useState(false);
  const [multiUse, setmultiUse] = useState(false);
  const [body, setbody] = useState(undefined);


  async function submitRequestForInvitation(event){
    event.preventDefault();

    let bodyRaw;
    let aliasRaw;

    if(!(alias===undefined)){
      if((alias==='')){
        setalias(undefined);
      }else{
        aliasRaw = alias.trim();
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
    let invite = await createInvitation(props.api_url, aliasRaw, autoAccept, multiUse, publicDid, bodyRaw)
    setalias(undefined);
    setautoAccept(false);
    setmultiUse(false);
    setpublicDid(false);
    setbody(undefined);
    if(invite === undefined){
      console.log('failed to generate invite');
      return;
    }
    setinvite(invite.invitation);
    setinviteUrl(invite.invitation_url)
  }

  return(
    <>
      <div className="invitation-generator">
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
            Auto accept:
            <input type="radio" id="auto_accept_true" name="auto_accept" value="True" onChange={() => setautoAccept(true)}/>
            <label>True</label>
            <input type="radio" id="auto_accept_false" name="auto_accept" value="False" onChange={() => setautoAccept(false)} checked/>
            <label>False</label><br/>
          </label>
          <br/>
          <label>
            Mulitple Use:
            <input type="radio" id="multi_use_true" name="multi_use" value="True" onChange={() => setmultiUse(true)}/>
            <label>True</label>
            <input type="radio" id="multi_use_false" name="multi_use" value="False" onChange={() => setmultiUse(false)} checked/>
            <label>False</label><br/>
          </label>
          <br/>
          <label>
            Public DID:
            <input type="radio" id="public_did_true" name="public_did" value="True" onClick={() => {
              console.log('true event triggerd');
              setpublicDid(true);
            }}/>
            <label>True</label>
            <input type="radio" id="public_did_false" name="public_did" value="False" onClick={() => {
              console.log('false event triggered');
              setpublicDid(false);
            }} checked/>
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
          <button type="submit">Request invitation</button>
        </form>
      </div>
      <div className="invitation-generator">
        {(invite === undefined) ? (
          <></>
        ) : (
          <>
            <QRCode value={inviteUrl} size={600}/>
            <p>{JSON.stringify(invite)}</p>
          </>
        )}
      </div>
    </>
  );

};

export default InvitationGenerator;