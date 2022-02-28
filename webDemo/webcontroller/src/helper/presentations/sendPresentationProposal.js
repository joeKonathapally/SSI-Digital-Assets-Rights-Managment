const axios = require('axios');

async function sendPresentationProposal(url, body={}){

  let bodyRaw ={
    trace: true,
    auto_present:false,
    ...body
  }
  let data;
  await axios.post(`${url}present-proof/send-proposal`, bodyRaw)
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
  sendPresentationProposal
};