// Script is executed when web app is started via command "npm run start"

const dotenv = require('dotenv');
const axios = require('axios');
const imageSchema = require("./image_authorship_schema");
const photographerCertificationSchema = require("./photographer_certification_schema");
const WebSocket = require('ws');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

const common = require('../src/helper/common');
const endorser = require('../src/helper/endorser');
const wallet = require('../src/helper/wallet');
const trustPing = require('../src/helper/trustPing');
const schema = require('../src/helper/schema');
const ledger = require('../src/helper/ledger');
const cred_def = require('../src/helper/cred_def');
const connection = require('../src/helper/connection');

dotenv.config({path: '.env'});

const trustAnchor = {
  "did": "V4SGRU86Z58d6TV7PBUe6f",
  "verkey": "GJ1SzoWzavQYfNL9XkaJdrQejfztN4XqdsiV4ct3LXKL",
  "posture": "posted",
  "key_type": "ed25519",
  "method": "sov"
};

const endorserURL = process.env.REACT_APP_ENDORSER_API;
const endorserSocketURL = process.env.REACT_APP_ENDORSER_HOOK;
const cavendishURL = process.env.REACT_APP_CAVENDISH_API;
const cavendishSocketURL = process.env.REACT_APP_CAVENDISH_HOOK;
const thodayURL = process.env.REACT_APP_THODAY_API;
const thodaySocketURL = process.env.REACT_APP_THODAY_HOOK;
const franklinURL = process.env.REACT_APP_FRANKLIN_API;
const ruthURL = process.env.REACT_APP_RUTH_API;

let cavendishEndorserConnectionId;
let thodayEndorserConnectionId;

let universalObject = {};

async function configureAgents(){
  if(await ledger.getRole(endorserURL, (await wallet.getPublicDid(endorserURL)).did ) === "ENDORSER"){
    let did = (await wallet.getPublicDid(endorserURL)).did;
    await wallet.assignPublicDid(endorserURL, trustAnchor.did);
    if(await wallet.getPublicDid(thodayURL) === null){
      const thodayDid = await wallet.createDid(thodayURL);
      await ledger.registerPublicDid(endorserURL, thodayDid.did, thodayDid.verkey);
      await wallet.assignPublicDid(thodayURL, thodayDid.did);
    }
    if(await wallet.getPublicDid(cavendishURL) === null){
      const cavendishDid = await wallet.createDid(cavendishURL);
      await ledger.registerPublicDid(endorserURL, cavendishDid.did, cavendishDid.verkey);
      await wallet.assignPublicDid(cavendishURL, cavendishDid.did);
    }
    await wallet.assignPublicDid(endorserURL, did);
  } else {
    if(await wallet.getPublicDid(thodayURL) === null){
      const thodayDid = await wallet.createDid(thodayURL);
      await ledger.registerPublicDid(endorserURL, thodayDid.did, thodayDid.verkey);
      await wallet.assignPublicDid(thodayURL, thodayDid.did);
    }
    if(await wallet.getPublicDid(cavendishURL) === null){
      const cavendishDid = await wallet.createDid(cavendishURL);
      await ledger.registerPublicDid(endorserURL, cavendishDid.did, cavendishDid.verkey);
      await wallet.assignPublicDid(cavendishURL, cavendishDid.did);
    }
    const endorserDid = await wallet.createDid(endorserURL);
    await ledger.registerPublicDid(endorserURL, endorserDid.did, endorserDid.verkey, undefined, "ENDORSER");
    await wallet.assignPublicDid(endorserURL, endorserDid.did);
  }
}

async function configureConnections(){
  if((await connection.getConnections(cavendishURL, "endorser")).length === 0){
    let alias = uuidv4();
    const invite1 = (await connection.createInvitation(endorserURL, alias, true)).invitation;
    const connection1 = await connection.receiveInvitation(cavendishURL, "endorser", true, undefined, invite1);
    await new Promise(resolve => {
      wsCC.onmessage = async (e) => {
        let state = JSON.parse(e.data).rfc23_state;
        let connectionId = JSON.parse(e.data).connection_id;
        if((state === "response-received") && (connection1.connection_id === connectionId)){
          await trustPing.trustPing(cavendishURL, connection1.connection_id, {
            "comment": "trust-ping"
          });
          resolve();
        }
      }
    })
  }
  if((await connection.getConnections(thodayURL, "endorser")).length === 0){
    let alias = uuidv4();
    const invite2 = (await connection.createInvitation(endorserURL, alias, true)).invitation;
    const connection2 = await connection.receiveInvitation(thodayURL, "endorser", true, undefined, invite2);
    await new Promise(resolve => {
      wsCT.onmessage = async (e) => {
        let state = JSON.parse(e.data).rfc23_state;
        let connectionId = JSON.parse(e.data).connection_id;
        if((state === "response-received") && (connection2.connection_id === connectionId)){
          await trustPing.trustPing(thodayURL, connection2.connection_id, {
            "comment": "trust-ping"
          });
          resolve();
        }
      }
    })
  }
}

async function configureEndorser(){
  const endorserConnections = await connection.getConnections(endorserURL);
  for (let conn in endorserConnections){
    await endorser.setEndorserRole(endorserURL, endorserConnections[conn].connection_id, "TRANSACTION_ENDORSER");
  }
  const cavendishEndorserConnection = (await connection.getConnections(cavendishURL, "endorser"))[0];
  cavendishEndorserConnectionId = cavendishEndorserConnection.connection_id;
  const thodayEndorserConnection = (await connection.getConnections(thodayURL, "endorser"))[0];
  thodayEndorserConnectionId = thodayEndorserConnection.connection_id;
  await endorser.setEndorserRole(cavendishURL, cavendishEndorserConnection.connection_id, "TRANSACTION_AUTHOR");
  await endorser.setEndorserRole(thodayURL, thodayEndorserConnection.connection_id, "TRANSACTION_AUTHOR");
  const endorserDid = (await wallet.getPublicDid(endorserURL)).did;
  await endorser.setEndorserInfo(cavendishURL, cavendishEndorserConnection.connection_id, endorserDid);
  await endorser.setEndorserInfo(thodayURL, thodayEndorserConnection.connection_id, endorserDid);
}

async function configureSchemas(){
  const schemas1 = await schema.getSchemas(thodayURL);
  let flag = false;
  for (let i in schemas1){
    const sch = await schema.getSchemaId(thodayURL, schemas1[i]);
    try{
      if(sch.name === imageSchema.schema_name){
        flag = true;
      }
    }catch(e){}
  }
  if(!flag){
    const txn = await schema.createSchema(thodayURL, thodayEndorserConnectionId, true, imageSchema);
    await endorser.endorserCreateRequest(thodayURL, txn.txn.transaction_id, true);
    await new Promise(resolve => {
      ws.onmessage = async (e) => {
        let state = JSON.parse(e.data).state;
        let threadId = JSON.parse(e.data).thread_id;
        if((state === "request_received") && (threadId === txn.txn.transaction_id)){
          await endorser.endorseTransactions(endorserURL, JSON.parse(e.data).transaction_id)
          resolve();
        }
      }
    })
  }
  const schemas2 = await schema.getSchemas(cavendishURL);
  flag = false;
  for (let i in schemas2){
    const sch = await schema.getSchemaId(cavendishURL, schemas2[i]);
    try{
      if(sch.name === photographerCertificationSchema.schema_name){
        flag = true;
      }
    }catch(e){}
  }
  if(!flag){
    const txn = await schema.createSchema(cavendishURL, cavendishEndorserConnectionId, true, photographerCertificationSchema);
    await endorser.endorserCreateRequest(cavendishURL, txn.txn.transaction_id, true);
    await new Promise(resolve => {
      ws.onmessage = async (e) => {
        let state = JSON.parse(e.data).state;
        let threadId = JSON.parse(e.data).thread_id;
        if((state === "request_received") && (threadId === txn.txn.transaction_id)){
          await endorser.endorseTransactions(endorserURL, JSON.parse(e.data).transaction_id)
          resolve();
        }
      }
    })
  }
}

async function configureCredDefs(){
  const schemas1 = await schema.getSchemas(thodayURL);
  let imageSchemaSeqNo;
  let imageSchemaId;
  for (let i in schemas1){
    const sch = await schema.getSchemaId(thodayURL, schemas1[i]);
    try{
      if(sch.name === imageSchema.schema_name){
        imageSchemaSeqNo = sch.seqNo;
        imageSchemaId = sch.id;
      }  
    }catch(e){}
  }
  const credDefs1 = await cred_def.getCredDefs(thodayURL);
  let flag = false;
  for (let i in credDefs1){
    const crd = await cred_def.getCredDefId(thodayURL, credDefs1[i]);
    if(parseInt(crd.credential_definition.schemaId) === imageSchemaSeqNo){
      flag = true;
    }
  }
  if(!flag){
    const txn = await cred_def.createCredDef(thodayURL, thodayEndorserConnectionId, true, { "schema_id": imageSchemaId });
    await endorser.endorserCreateRequest(thodayURL, txn.txn.transaction_id, true);
    await new Promise(resolve => {
      ws.onmessage = async (e) => {
        let state = JSON.parse(e.data).state;
        let threadId = JSON.parse(e.data).thread_id;
        if((state === "request_received") && (threadId === txn.txn.transaction_id)){
          await endorser.endorseTransactions(endorserURL, JSON.parse(e.data).transaction_id)
          resolve();
        }
      }
    })
  }
  const schemas2 = await schema.getSchemas(cavendishURL);
  let photographerSchemaSeqNo;
  let photographerSchemaId;
  for (let i in schemas2){
    const sch = await schema.getSchemaId(cavendishURL, schemas2[i]);
    try{
      if(sch.name === photographerCertificationSchema.schema_name){
        photographerSchemaSeqNo = sch.seqNo;
        photographerSchemaId = sch.id;
      }
    }catch(e){}
  }
  const credDefs2 = await cred_def.getCredDefs(cavendishURL);
  flag = false;
  for (let i in credDefs2){
    const crd = await cred_def.getCredDefId(cavendishURL, credDefs2[i]);
    if(parseInt(crd.credential_definition.schemaId) === photographerSchemaSeqNo){
      flag = true;
    }
  }
  if(!flag){
    const txn = await cred_def.createCredDef(cavendishURL, cavendishEndorserConnectionId, true, { "schema_id": photographerSchemaId });
    await endorser.endorserCreateRequest(cavendishURL, txn.txn.transaction_id, true);
    await new Promise(resolve => {
      ws.onmessage = async (e) => {
        let state = JSON.parse(e.data).state;
        let threadId = JSON.parse(e.data).thread_id;
        if((state === "request_received") && (threadId === txn.txn.transaction_id)){
          await endorser.endorseTransactions(endorserURL, JSON.parse(e.data).transaction_id)
          resolve();
        }
      }
    })
  }
}

async function configureGlobalStore(){
  const schemas1 = await schema.getSchemas(thodayURL);
  let imageSchemaSeqNo;
  let shm;
  for (let i in schemas1){
    const sch = await schema.getSchemaId(thodayURL, schemas1[i]);
    try{
      if(sch.name === imageSchema.schema_name){
        imageSchemaSeqNo = sch.seqNo;
        shm = sch;
      }  
    }catch(e){}
  }
  let cdr;
  const credDefs1 = await cred_def.getCredDefs(thodayURL);
  for (let i in credDefs1){
    const crd = await cred_def.getCredDefId(thodayURL, credDefs1[i]);
    if(parseInt(crd.credential_definition.schemaId) === imageSchemaSeqNo){
      cdr = crd;
    }
  }
  let thodayDid = await wallet.getPublicDid(thodayURL);
  let obj = {
    schema_name: shm.name,
    schema_version: shm.version,
    schema_id: shm.id,
    cred_def_id: cdr.credential_definition.id,
    issuer_did: thodayDid.did,
    schema_issuer_did: thodayDid.did
  }
  universalObject = {
    imageAuthorship: obj,
    ...universalObject
  }
  const schemas2 = await schema.getSchemas(cavendishURL);
  let photographerSchemaSeqNo;
  for (let i in schemas2){
    const sch = await schema.getSchemaId(cavendishURL, schemas2[i]);
    try{
      if(sch.name === photographerCertificationSchema.schema_name){
        photographerSchemaSeqNo = sch.seqNo;
        shm = sch;
      }
    }catch(e){}
  }
  const credDefs2 = await cred_def.getCredDefs(cavendishURL);
  for (let i in credDefs2){
    const crd = await cred_def.getCredDefId(cavendishURL, credDefs2[i]);
    if(parseInt(crd.credential_definition.schemaId) === photographerSchemaSeqNo){
      cdr = crd;
    }
  }
  let cavendishDid = await wallet.getPublicDid(cavendishURL);
  obj = {
    schema_name: shm.name,
    schema_version: shm.version,
    schema_id: shm.id,
    cred_def_id: cdr.credential_definition.id,
    issuer_did: cavendishDid.did,
    schema_issuer_did: cavendishDid.did
  }
  universalObject = {
    photographerCertification: obj,
    ...universalObject
  }
}

const ws = new WebSocket(endorserSocketURL+'topic/endorse_transaction');

ws.onopen = function open() {
  ws.send('web controller connected to /topic/endorse_transaction/');
};

const wsCC = new WebSocket(cavendishSocketURL+'topic/connections')

wsCC.onopen = function open() {
  wsCC.send('web controller connected to /topic/connections/')
}

const wsCT = new WebSocket(thodaySocketURL+'topic/connections')

wsCT.onopen = function open() {
  wsCT.send('web controller connected to /topic/connections/')
}

async function startup(){
  console.log('Running startup config...');
  console.log('Configuring agents...');
  await configureAgents();
  console.log('Endorser: '+await ledger.getRole(endorserURL, (await wallet.getPublicDid(endorserURL)).did )+" "+(await wallet.getPublicDid(endorserURL)).did);
  console.log('Thoday: '+await ledger.getRole(thodayURL, (await wallet.getPublicDid(thodayURL)).did )+" "+(await wallet.getPublicDid(thodayURL)).did);
  console.log('Cavendish: '+await ledger.getRole(cavendishURL, (await wallet.getPublicDid(cavendishURL)).did )+" "+(await wallet.getPublicDid(cavendishURL)).did);
  console.log('Configuring connections...');
  await configureConnections();
  console.log('Configuring endorsers...');
  await configureEndorser();
  console.log('Configuring schemas...');
  await configureSchemas();
  console.log('Configuring credential definitions...');
  await configureCredDefs();
  console.log('Configuring the global store...');
  await configureGlobalStore();
  console.log('Configuration complete');
  ws.close();
  wsCC.close();
  wsCT.close();
  const data = JSON.stringify(universalObject);
  fs.writeFile('./src/universalObject.json', data, (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
  });
}

startup();