# TODO: Migrate to aiohttp instead of using in a seperate thread for making requests
import asyncio
import requests
import random
import string
import socket
import json
import random
class Agent:
    def __init__(
        self,
        loop,
        adminUrl: str,
        endorserServerUrl: str = "http://localhost:9000",
        alias: str = None,
        seed: str = 'random',
        publicDid: str = None,
    ):
        self.loop = loop
        self.alias = alias
        self.base_url = adminUrl
        self.seed = seed if seed != "random" else ("my_seed_000000000000000000000000" + str(random.randint(100_000, 999_999)))[-32:]
        self.publicDid = publicDid
        self.endorserServerUrl = endorserServerUrl
        self.adminUrl = adminUrl

    async def createLocalDid(self):
        future = self.loop.run_in_executor(None, requests.post,f'{self.adminUrl}/wallet/did/create')
        resp = await future
        self.newDid = json.loads(resp.content.decode("utf-8"))["result"]
        return(self.newDid)

    async def createInvite(self):
        future = self.loop.run_in_executor(None, requests.post,f'{self.adminUrl}/connections/create-invitation')
        invite = await future
        return(json.loads(invite.content.decode("utf-8")))
    async def receiveInvite(self, invitation_data):
        future = self.loop.run_in_executor(None, requests.post,f'{self.adminUrl}/connections/receive-invitation/' + invitation_data)
        invitation = await future
        return json.loads(invitation.content.decode("utf-8"))
    async def registerWithLedger(self):
        # TODO: add if check for if public; when public we can just use wallet/create with the DID.... 
        # TODO: Fix the webrequest
        print("Registering with ledger")
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.endorserServerUrl}/register', json={
            "did":self.newDid["did"],
            "verkey":self.newDid["verkey"],
            "alias":self.alias
        })
        )
        resp = await future
        # TODO:When updating to use the seed, won't need to assign the value on the object.
        self.publicDid = json.loads(resp.content.decode("utf-8"))["did"]
        return resp
    # TODO:(NOW) Fix it... why doesn't it recognise the did?
    # TODO:(Future)Update to do somehow based on the seed?
    async def assignPublicDID(self):
        print('Assigning the public DID to the acapy instance')
        print(f"Posting to {self.adminUrl}/wallet/did/?did={self.publicDid}")
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/wallet/did/public?did={self.publicDid}')
        )
        resp = await future
        return resp
    async def postSchema(self, name, version, attributes):
        print(f'Posting {name} schema to the ledger')
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/schemas', json={
            "schema_name":name,
            "schema_version":version,
            "attributes":attributes
        })
        )
        resp = await future
        schema_id = json.loads(resp.content.decode("utf-8"))["schema_id"]
        return schema_id
    
    async def postCredentialDefinition(self, schema_id, tag):
        print(f"posting credential definition onto ledger")
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/credential-definitions', json={
            "support_revocation": False,
            "schema_id":schema_id,
            "tag": tag
        })
        )
        resp = await future
        credential_definition_id = json.loads(resp.content.decode("utf-8"))["credential_definition_id"]
        return credential_definition_id 
    
    # TODO: Is broken, get working.
    async def acceptInvitation(self, invitationBody):
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/connections/receive-invitation', json=(json.loads(invitationBody.replace("'",'"'))))
        )
        resp = await future
        connectionId = json.loads(resp.content.decode("utf-8"))["connection_id"]
        future2 = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/connections/{connectionId}/accept-invitation')
        )
        resp2 = await future2
        return connectionId

    async def sendTrustPing(self, connectionID):
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/connections/{connectionID}/send-ping', json={"comment":"Establishing Connection"})
        )
        resp = await future
        return resp

    async def acceptConnectionRequest(self, connectionID):
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/connections/{connectionID}/accept-request')
        )
        resp = await future

        ping = await self.sendTrustPing(connectionID)
        return ping
    
    async def offerCredential(self, attributes, connectionID,schemaId, credDefID,schemaName, schemaVersion = "1.0"):
        future = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/issue-credential-2.0/send-offer', json={
        "auto_remove": False,
        "comment": "Image ownership credential",
        "connection_id" : connectionID,
        "credential_preview": {
            "@type": "issue-credential/2.0/credential-preview",
            "attributes": attributes
        },
        "filter": {
            "indy": {
            "cred_def_id": credDefID,
            "issuer_did": self.newDid["did"],
            "schema_id": schemaId,
            "schema_issuer_did": self.newDid["did"],
            "schema_name": schemaName,
            "schema_version": schemaVersion
            },
    
        },
        "trace": True
        })
        )
        
        resp = await future
        threadID = json.loads(resp.content.decode('utf-8'))['cred_ex_id']
        return threadID

    async def requestReceievedCredentialOffer(self, connID):
        fetchFuture = self.loop.run_in_executor(None, 
        lambda: requests.get(f'{self.adminUrl}/issue-credential-2.0/records?connection_id={connID}'
        ))
        fetchResp = await fetchFuture
        jsonFetchResp = json.loads(fetchResp.content.decode('utf-8'))
        credExchangeID = jsonFetchResp['results'][0]['cred_ex_record']['cred_ex_id']
        print(f'Fetched Cred Exchange ID:{credExchangeID}')
        reqFuture = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/issue-credential-2.0/records/{credExchangeID}/send-request'
        ))
        reqResp = await reqFuture
        return reqResp

    async def issueRequestedCredential(self, connID):
        fetchFuture = self.loop.run_in_executor(None, 
        lambda: requests.get(f'{self.adminUrl}/issue-credential-2.0/records?connection_id={connID}'
        ))
        fetchResp = await fetchFuture
        jsonFetchResp = json.loads(fetchResp.content.decode('utf-8'))
        credExchangeID = jsonFetchResp['results'][0]['cred_ex_record']['cred_ex_id']
        print(f'Fetched Cred Exchange ID:{credExchangeID}')
        reqFuture = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/issue-credential-2.0/records/{credExchangeID}/issue', json={"comment":"Issuing image ownership credential"}
        ))
        reqResp = await reqFuture
        return reqResp

    async def storeCredential(self, connID):
        fetchFuture = self.loop.run_in_executor(None, 
        lambda: requests.get(f'{self.adminUrl}/issue-credential-2.0/records?connection_id={connID}'
        ))
        fetchResp = await fetchFuture
        jsonFetchResp = json.loads(fetchResp.content.decode('utf-8'))
        credExchangeID = jsonFetchResp['results'][0]['cred_ex_record']['cred_ex_id']
        print(f'Fetched Cred Exchange ID:{credExchangeID}')
        reqFuture = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/issue-credential-2.0/records/{credExchangeID}/store'
        ))
        reqResp = await reqFuture

        return reqResp
    
    async def requestPresentation(self, connID, name = "Presentation Request" ,attributes = {} , predicates = {}, comment = "Presentation Request"):
        reqFuture = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/present-proof/send-request', json = {
            "comment": comment,
            "connection_id": connID,
            "proof_request": {
                "name": name,
                "nonce": str(random.getrandbits(256)),
                "requested_attributes": attributes,
                "requested_predicates": predicates, 
                "version": "1.0"
            },
            "trace": True
            }
        ))
        reqResp = await reqFuture
        return reqResp

    async def sendPresentation(self, connectionID, attributes = {}, predicates ={}):
        fetchFuture = self.loop.run_in_executor(None, 
        lambda: requests.get(f'{self.adminUrl}/present-proof/records?connection_id={connectionID}'
        ))
        fetchResp = await fetchFuture
        jsonFetchResp = json.loads(fetchResp.content.decode('utf-8'))
        presExchangeID = jsonFetchResp['results'][0]['presentation_exchange_id']
        print(f'Presentation Exchange: {presExchangeID}')
        reqFuture = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/present-proof/records/{presExchangeID}/send-presentation',
        json={
              "requested_attributes": attributes,
            "requested_predicates": predicates,
            "self_attested_attributes": {
            },
            "trace": False
        }
        ))
        reqResp = await reqFuture
        return reqResp

    async def fetchCredID(self, cred_def_id):
        credFetchFuture = self.loop.run_in_executor(None, 
        lambda: requests.get(f'{self.adminUrl}/credentials'
        ))
        credFetchResp = await credFetchFuture
        jsonCredFetchResp = json.loads(credFetchResp.content.decode('utf-8'))
        for credential in jsonCredFetchResp['results']:
            if credential['cred_def_id'] == cred_def_id:
                credRef = credential['referent']
        return credRef
    
    async def verifyPresentation(self, connectionID):
        fetchFuture = self.loop.run_in_executor(None, 
        lambda: requests.get(f'{self.adminUrl}/present-proof/records?connection_id={connectionID}'
        ))
        fetchResp = await fetchFuture
        jsonFetchResp = json.loads(fetchResp.content.decode('utf-8'))
        presExchangeID = jsonFetchResp['results'][0]['presentation_exchange_id']
        reqFuture = self.loop.run_in_executor(None, 
        lambda: requests.post(f'{self.adminUrl}/present-proof/records/{presExchangeID}/verify-presentation'))
        reqResp = await reqFuture
        return reqResp




    
    # Proposal
    # Verificaiton
    # rest of functions needed to complete a presentation.