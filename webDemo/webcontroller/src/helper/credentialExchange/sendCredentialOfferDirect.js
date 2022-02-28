const axios = require('axios');

async function sendCredentialOfferDirect(url, body={}){
  let data;
  await axios.post(`${url}issue-credential-2.0/send-offer`, body)
    .then(res => {
      data = res.data.results;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  sendCredentialOfferDirect
};