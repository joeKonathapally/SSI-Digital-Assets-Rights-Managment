# Baseline implementation of a holder
import asyncio
import aioconsole
from utils.agent import(
    Agent
)
import time
import json

async def main():
    holder = Agent(
        loop=loop,
        adminUrl="http://localhost:8221",
        alias="Holder",
        # endorserServerUrl= "http://localhost:9000",
        # seed="random",
        )
    # did = await issuer.createLocalDid()
    invitation = await aioconsole.ainput('Input invitation: ') 
    print(invitation)
    connection_id = await holder.acceptInvitation(invitation)
    print(connection_id)
    await aioconsole.ainput('Press enter to send trust ping (to confirm the connection)')
    response_ping = await holder.sendTrustPing(connection_id)
    print(response_ping)
    await aioconsole.ainput('Press enter once offer has been  received.')
    await holder.requestReceievedCredentialOffer(connection_id)
    await aioconsole.ainput('Press enter once credential has been issued.')
    await holder.storeCredential(connection_id)
    cred_def_id = await aioconsole.ainput('Input Cred Def ID: ') 
    cred_id = await holder.fetchCredID(cred_def_id)
    sendPres = await holder.sendPresentation(
        connectionID=connection_id,
        attributes={
            "additionalProp1": {
            "cred_id": cred_id,
            "revealed": True
        }},
    #     predicates={
    #     "additionalProp1": {
    #     "cred_id": cred_def_id,
    #     "timestamp": int(round(time.time()))
    # }
    # }
    )
    print(sendPres)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())