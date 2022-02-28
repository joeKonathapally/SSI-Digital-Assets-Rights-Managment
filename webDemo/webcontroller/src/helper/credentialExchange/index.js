const {sendCredentialProposal} = require('./sendCredentialProposal');
const {sendCredentialOffer} = require('./sendCredentialOffer');
const {sendCredentialRequest} = require('./sendCredentialRequest');
const {issueCredential} = require('./issueCredential');
const {storeCredential} = require('./storeCredential');

module.exports = {
  sendCredentialProposal,
  sendCredentialOffer,
  sendCredentialRequest,
  issueCredential,
  storeCredential
};