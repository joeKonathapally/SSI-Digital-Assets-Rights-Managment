const {getPresentationCredentials} = require('./getPresentationCredentials');
const {getPresentationExchanges}  = require('./getPresentationExchanges');
const {sendPresentation} = require('./sendPresentation');
const {sendPresentationProposal} = require('./sendPresentationProposal');
const {sendPresentationRequest} = require('./sendPresentationRequest');
const {verifyPresentation} = require('./verifyPresentation');

module.exports = {
  getPresentationCredentials,
  getPresentationExchanges,
  sendPresentation,
  sendPresentationProposal,
  sendPresentationRequest,
  verifyPresentation
};