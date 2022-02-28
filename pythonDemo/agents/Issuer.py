# Baseline implementation of an issuer
import asyncio
import aioconsole
from utils.agent import(
    Agent
)
import json

async def main():
    issuer = Agent(
        loop=loop,
        adminUrl="http://localhost:8121",
        alias="Issuer",
        # endorserServerUrl= "http://localhost:9000",
        # seed="random",
        )
    did = await issuer.createLocalDid()
    print(f"Newly created DID in wallet: {did}")
    await issuer.registerWithLedger()
    await issuer.assignPublicDID()
    ImageOwnershipSchemaID = await issuer.postSchema(name = "ImageOwnership", version ="1.0", attributes=["imgHash", "timestamp", "geolocation", "deviceID"])
    print(f"ID for Image ownership schema is {ImageOwnershipSchemaID}")
    ImageCredentialDefinitionID = await issuer.postCredentialDefinition(schema_id=ImageOwnershipSchemaID, tag="default")
    print(f"ID for Image ownership Credential Definition is {ImageCredentialDefinitionID}")

    invitation = await issuer.createInvite()
    print(invitation["invitation"])
    await aioconsole.ainput('Press enter to accepted invitation request') 
    print(invitation["connection_id"])
    await issuer.acceptConnectionRequest(invitation["connection_id"])

    await aioconsole.ainput('Press enter to send credential offer') 
    await issuer.offerCredential(
        connectionID=invitation["connection_id"],
        schemaId=ImageOwnershipSchemaID,
        credDefID=ImageCredentialDefinitionID,
        schemaName="ImageOwnership",
        attributes=[
            {"name": "imgHash","value":"abc12345"},
            {"name": "timestamp","value":"100"},
            {"name": "geolocation","value":"NW17298181.18271"},
            {"name": "deviceID","value":"Phone18729171821_10"}        ]

    )
    # credential_offer_id = json.loads(offerReq.content.decode("utf-8"))['cred_offer']['@id']
    await aioconsole.ainput(f"Press Enter after holder sends request")
    await issuer.issueRequestedCredential(invitation["connection_id"])
    await aioconsole.ainput(f"Press Enter to request a presentation")
    test = await issuer.requestPresentation(
        connID=invitation['connection_id'],
        name= "Presentation of Image hash",
        attributes= {
        "additionalProp1": {
                "name": "imgHash",
                "restrictions": [
                {
                    "cred_def_id": ImageCredentialDefinitionID
                }
                ]
            }
        }
    )
    print(test)
    await aioconsole.ainput(f"Press Enter to verify the presentation")
    verifyReq = await issuer.verifyPresentation(invitation['connection_id'])
    print(verifyReq)



loop = asyncio.get_event_loop()
loop.run_until_complete(main())