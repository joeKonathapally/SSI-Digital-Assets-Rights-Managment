import Invitation from "../invitation/Invitation";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useState } from "react";
import Connection from "../connections/Connections";
import CredDef from "../credentialDefinitions/CredDefs";
import Schema from "../schemas/Schemas";
import Credentials from "../credential/credentials";
import Presentations from "../presentation/presentations";
import EndorseTransaction from "../endorseTransactions/EndorseTransactions";
import Wallet from "../wallet/Wallet";

function Endorser() {
  const API_URL = process.env.REACT_APP_ENDORSER_API;
  const HOOK_URL = process.env.REACT_APP_ENDORSER_HOOK;

  const [key, setKey] = useState("invitation");

  return (
    <>
      <h3>Endorser Page</h3>
      <Tabs
        id="endorser-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <Tab eventKey="invitation" title="Invitations">
          <Invitation api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="connection" title="Connections">
          <h1>Connection Page</h1>
          <Connection api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="schema" title="Schemas">
          <h1>Schema Page</h1>
          <Schema api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="creddef" title="Credential definitions">
          <h1>Cred def Page</h1>
          <CredDef api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="credentials" title="Credentials">
          <h1>Manage Credentials</h1>
          <Credentials api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="presentations" title="Presentations">
          <h1>Manage Presentations</h1>
          <Presentations api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="endorseTransaction" title="Endorse Transactions">
          <h1>Manage endorsing transactions</h1>
          <EndorseTransaction api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="wallet" title="Wallet">
          <h1>Wallet</h1>
          <Wallet api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
      </Tabs>
    </>
  );
}

export default Endorser;
