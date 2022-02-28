import InvitationGenerator from "./InvitationGenerator";
import InvitationReceiver from "./InvitationReceiver";

function Invitation(props){
 
  return(
    <div className="invitation-parent-container">
      <div className="invitation-generator-container">
        <div className="invitation-generator-header">
          <h1>Generate Invitation:</h1>
        </div>
        <div className="invitation-generator-body">
          <InvitationGenerator api_url={props.api_url}/>
        </div>
      </div>
      <div className="invitation-receiver-container">
        <div className="invitation-receiver-header">
          <h1>Receive Invitation:</h1>
        </div>
        <div className="invitation-receiver-body">
          <InvitationReceiver api_url={props.api_url}/>
        </div>
      </div>
    </div>
  );

};

export default Invitation;

