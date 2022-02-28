import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import LazyToast from "../lazyToast/LazyToast";
import { useState, useEffect } from "react";
import Connection from "../connections/Connections";
import Schema from "../schemas/Schemas";
import Invitation from "../invitation/Invitation";
import Credentials from "../credential/credentials";
import Presentations from "../presentation/presentations";
import Wallet from "../wallet/Wallet";
import CredDef from "../credentialDefinitions/CredDefs";
import EndorseTransaction from "../endorseTransactions/EndorseTransactions";
function Ruth() {
  const API_URL = process.env.REACT_APP_RUTH_API;
  const HOOK_URL = process.env.REACT_APP_RUTH_HOOK;

  const [key, setKey] = useState("invitation");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(HOOK_URL + "topic/basicmessages");

    ws.onopen = function open() {
      ws.send("web controller connected");
    };

    ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log(data);
      //   console.log(Date.parse(JSON.parse(e.data).updated_at));
      setMessages((prevState) => [...prevState, data]);
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      {messages != [] &&
        messages.map((messageData) => (
          <LazyToast
            key={messageData.message_id}
            from={messageData.connection_id}
            message={messageData.content}
            clearMessage={() =>
              setMessages((prevState) =>
                prevState.filter(
                  (message) => message.message_id !== messageData.message_id
                )
              )
            }
          />
        ))}

      <h3>Ruth Page</h3>
      <Tabs
        id="cavendish-tabs"
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
        <Tab eventKey="wallet" title="Wallet">
          <h1>Wallet</h1>
          <Wallet api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
        <Tab eventKey="endorseTransaction" title="Endorse Transactions">
          <h1>Manage endorsing transactions</h1>
          <EndorseTransaction api_url={API_URL} hook_url={HOOK_URL} />
        </Tab>
      </Tabs>
    </>
  );
}

export default Ruth;
