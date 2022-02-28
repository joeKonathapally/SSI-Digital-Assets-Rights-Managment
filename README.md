# SSI platform development

# Contents of the Repository

From a top-down view this repository has been divided into two main "demo" directories with several sub-directories:

1. **pythonDemo:** Contains the code for running a baseline CLI run-through of the functonalities required by an SSI system. This code was an important stepping stone for understanding how to apply ACA-Py to our problem. The code within this demo is quite generalised.

- **Agents:** Python source code for the various roles _(Issuer, Holder, & Verifier)_. Each of these roles inherit from the agent class that is within the utils folder.
- **dev-venv:** Virtual environment that includes all of the python packages needed for running the python demo.

2. **webDemo:** Contains the code for the responsive web application demonstration of our SSI system. This demonstration provides the ability to explore all features of a generalised SSI system. However, it has been heavily tailored to allow for a complete walk-through of our scenario.

- **cloudAgents:** All of the code for managing unique docker containers which execute the ACA-Py instances needed for each actor within the scenario.

- **file-server:** Code for the placeholder file server which fulfils the role of the image repository for our scenario.

- **webcontroller:** All of the code for our React web-application which implements a UI that allows each actor within our scenario to interact with their ACA-Py instance _(Manage credentials, connections, perform presentations etc.)_

<!-- distinguish between the python and web demo in terms of scope and functionality -->

# The Scenario

step-by-step of the scenario (use slides -- Storyboard on Teams -- as a template)
couple of sentences describing each scenario followed by diagram

Actors -

## Cavendish

- Accredit photographers and issues them credentials
- Issuer

## Thoday

- Issues authorship credentials on photos to accredited photographers
- Verifies photographer accreditation credentials issued by cavendish
- Register photos to the photo registry
- Issuer and Verifier

## Franklin

- Runs an art competition and verifies authorship credentials
- Verifier

## Ruth

- Independent photographer
- Requests photographer accreditation credentials from Cavendish
- Requests individual photographs authorship credentials from Thoday
- Holder

## Scenario 0: Initialization

1. All actors setup their respective wallets
2. Cavendish and Thoday both register Public DIDs on the ledger
3. Cavendish creates a schema and credential definition for the photographer accreditation credential against cavendish's public DID
4. Thoday creates a schema and credential definition for the image authorship credential against Thoday's public DID

## Scenario 1: Accrediting Ruth

1. Ruth requests a photographer accreditation credential from Cavendish
2. Cavendish evaluates this request along with the supplied supporting evidence
3. Cavendish issues the credential to Ruth
4. Ruth stores the credential in her local wallet

## Scenario 2: Accredited photographer registering authorship

1. Ruth reqeusts Thoday for an authorship credential from an image
2. Ruth sends a presentation of her photographer accreditation credential to Thoday
3. Thoday verifies the credential presentation
4. Thoday offers an image authorship credential containing the image hash to Ruth contingent on the verification
5. Once issuing an image authorship credential Thoday will register the image to the image registry

## Scenario 3: Verifying authorship

1. Ruth chooses to enter a photography competition
2. Franklin runs the photography competition
3. Ruth selects an image from the registry for which she has a credential
4. Franklin then sends a credential presentation request to Ruth
5. Ruth supplies the proper credential to Franklin
6. Franklin verifies the credential
7. Contingent on the verification Franklin enters Ruth into the photography competition

# Running the Demo

**This section applies to the web-application demonstration of the SSI System**

## Pre-Requisites

To run this demo there are a few dependencies that must be installed locally on your machine:

1. Docker (https://www.docker.com/get-started)
2. NodeJS (https://nodejs.org/en/)

## Starting the VON Network

- This demonstration has been built to work with the VON-Network out of the box; it is possible to run any configuration of a Hyperledger Indy network, but this may require more configuration.

1. Clone the [official VON Network repository](https://github.com/bcgov/von-network).
2. Navigate into the repository and run the command `./manage build` to prepare the docker images.
3. Within the same repository, run the command `./manage start` to start the network.

## Starting the ACA-Py instances

- Each actor requires an instance of ACA-Py to be ran in a seperate docker container _(Could be changed with multi-tenancy in the future.)_
- To start these ACA-Py instances follow the steps below:

  1. Clone the [official SSI Platform Development repository](https://github.com/ashleyfraser19/SSI-platform-development).
  2. Navigate into the /webDemo/cloudAgents directory.
  3. Excute the command `./manage build --ip-address [YOUR IP ADDRESS HERE]` with your IP address inserted.
  4. Following the build completion, execute the command `./manage all start`.
  5. Once the containers have all been started the following admin ACA-Py API panels should be accessible via web browser.

  - **Endorser:** http://localhost:8021/api/doc
  - **Thoday:** http://localhost:8121/api/doc
  - **Cavendish:** http://localhost:8221/api/doc
  - **Franklin:** http://localhost:8321/api/doc
  - **Ruth:** http://localhost:8421/api/doc

## Starting the Image Repository (File-Server)

- The file server is integral for facilitating the full run-through of our scenario, it is how Thoday keeps track of the Images he has provided a credential for. To start the image repository follow the steps below:
  1. Navigate to /webDemo/file-server
  2. Install all packages & dependencies using `npm install`
  3. Start the file server with the command `npm run start`

## Starting the Web Application

- The web application provides the UI for interacting with the ACA-Py instances deployed previously. A single react app exposes a unique URL for each actor to use. In practice there would be authentication to restrict access, but this falls out of scope for this demonstration. Each of the actors UI's encompass a set of tabs which grant them access to all neccessary ACA-Py functionality for our scenario. To start this web application follow the steps below:
  1. Navigate to /webDemo/webcontroller
  2. Install all packages & dependencies using `npm install`
  3. Start the react webserver with the command `npm run start`
- **NB:** Prior to the web-application being started the VON network and ACA-Py instances must be running: the startup script will be triggered first which involves the posting of schemas & credential definitions to the ledger.

# Step-by-step of the demo, applied to our scenario

**This discusses how the he web-application demonstration can be used to fulfil the scenarios detailed above**

## 0. Initialization

- This scenario is completed behind the scenes when the React Web Server is started; this is achieved via the startup script located in /webDemo/webcontroller/startup/startup.js

## 1. Accrediting Ruth

1. Open up the webcontrollers for Ruth and Cavendish (http://localhost:3000/controller/ruth, http://localhost:3000/controller/cavendish) in two seperate browser tabs.
2. Navigate to cavendishes public facing invitation page (http://localhost:3000/public/cavendish) and copy the invitation JSON, paste this into the "body" for the receive invitation section on Ruths invitation page.
3. Navigate to the "Connections" tab for Ruth and click the button for sending a trust ping (this finalises the connection).
4. Navigate to Ruths "Credential" tab and select cavendish as the issuer from the drop-down list (this is populated with all of Ruths connections.)
5. Upon selecting Cavendish as the issuer a form will be presented where Ruths name, username, employer, and instagram handle can be input for her credential.
6. After filling in the form, click on the "Apply" button to send a credential proposal to Cavendish. This credential proposal will be immediately visible within Ruth's Credential Exchange Records.
7. On Cavendishes web-app, navigate into the "credentials" tab and inspect the incoming proposal. To send a credential offer press the "Send offer" button.
8. Switch back to Ruths "credentials" tab, and send the credential request by clicking the "Send request" button.
9. Cavedishes final step here is to click the "Send credentials" button when it becomes available on the relevant credential exchage record.
10. To complete the protocol, on Ruths credentials tab, the "store credential" button must be clicked for the relevant credential exchange record to enter the credential into her wallet. The state for this credential exchange should change to "done" upon the completion of the protocol.

## 2. Accredited photographer registering authorship

1. Steps 1.1 -> 1.3 must be completed again between Ruth and Thoday (Thoday's public invitation page is http://localhost:3000/public/thoday) to form a connection. (same steps, but all the actions perfomed with Cavendishes controller will be done from Thoday's).
2. On Ruths webcontroller, access the Credentials tab again. Select thoday as the issuer; a different form will appear which allows Ruth to select a Credential, upload an image, and then fill in various pieces of data for that image. In this case, the credential issued from Cavendish to Ruth must be selected because Thoday wants to see that Ruth is an accredited photographer prior to issuing his own ImageAuthorship credentials.
3. The "Apply" button must be pressed after a credential has been selected, an image uploaded, and all of the other form fields have been completed. **NB: This time there won't be a credential exchange record as the first step in this protocol is for Ruth to propose a presentation of her PhotographerCertification to Thoday... this can be seen in the Presentations tab instead.**
4. Navigate to Thoday's Presentations tab and locate the relevant presentation exchange; click on "Send Request" to send a presentation request to Ruth.
5. Due to the configuration of the presentation poposal Ruth initially sent to Thoday, Ruth's ACA-Py instance will automatically send the presentation in response to Thodays request. Still on Thoday's Presentations tab, the state for that presentation exchange should update to "presentation_received", and a "Verify" button will be visible - click this button.
6. Upon a successful presentation verification (if Ruth has a valid credential from Cavendish), the image she is requesting a credential for should become visible. Thoday's webcontroller can issue this credential by pressing the "Issue credential" button below the image. This will begin the same credential-exchange protocol that was explained above in steps 1.7->1.10
7. Following these steps listed above, Ruth's webcontroller will now have a single Image Authorship Credential from Thoday, and a Photographer Certification Credential from Cavendish.

## 3. Verifying authorship

**NB: There are two ways to complete this scenario; either through the competition page, or by setting up a connection between Ruth and Franklin, and then having Franklin send a presentation request (available via the Presentations tab). For a more realistic scenario, this scenario is explained using the competition webpage.**

1. In a new browser tab, navigate to the competition web-page (http://localhost:3000/competition). Upon visiting the site, you will see a form alojngside a gallery that contains all images uploaded to the image registry (images that Thoday has issued credentials for).
2. Fill in the form fields with Ruths name and an image description, then click on the image Ruth owns an authorship credential for and click on "Begin verification".
3. Once the button has been pressed, a new invitation will be displayed. Copy the body of this invitation and follow the familar process of pasting it into Ruth's "receive invitation" section on the "Invitations" tab.
4. Immediately, a new presentation request can be seen within Ruths "Presentations" tab. At the bottom of the presentation exchange record, there will be a drop-down to select a credential and then a button which says "send presentastion". Here Ruth must select the credential from her wallet which corresponds to the Image Authorship credential (this can be checked within her wallet tab).
5. Once the correct credential has been selected, click the "send presentation" button.
6. At this point, Franklins webcontroller (http://localhost:3000/controller/franklin) must be visited. Navigate to the "presentations" tab once more. The competion web-page has been configured such that no interaction is required on Franklins controller, however if the Image hash of the selected image (on the competition page) matches the hash within the presented credential, a message will be shown verifying this.

# Closing all the running services

1. VON-network
  ./manage down

2. ACA-PY instances
  ./manage all down

3. File server and webcontroller should shut down by terminating the terminal session

# Related Repositories and Links

1. https://github.com/bcgov/von-network/blob/master/docs/UsingVONNetwork.md
2. https://github.com/cloudcompass/ToIPLabs/blob/main/docs/LFS173x/agentsConnecting.md
3. https://github.com/hyperledger/aries-cloudagent-python
4. https://github.com/hyperledger/aries-acapy-controllers/tree/main/AliceFaberAcmeDemo/controllers/alice-controller
5. https://hyperledger-indy.readthedocs.io/en/latest/index.html
6. https://github.com/hyperledger/aries-rfcs

# Troubleshooting

1. If the von network runs into an error please restart the containers completely ./manage down and ./manage start
2. if you start up the aca-py instance before the ledger has completed startup the aca-py instance will fail
3. ./manage [actor] log is a useful tool to view the log files of the acc-py instance
4. ./manage [actor] relay-log is a useful tool to view the log files of the aca-py relay server
