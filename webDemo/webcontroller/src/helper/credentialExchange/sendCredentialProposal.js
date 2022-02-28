const axios = require('axios');

async function sendCredentialProposal(url, body={}){

  let bodyRaw ={
    autoRemove: true,
    comment: "default comment",
    trace: true,
    ...body
  }
  let data;
  await axios.post(`${url}issue-credential-2.0/send-proposal`, bodyRaw)
    .then(res => {
      data = res.data;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  sendCredentialProposal
};