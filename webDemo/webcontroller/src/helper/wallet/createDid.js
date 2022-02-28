const axios = require('axios');

async function createDid(url, body={
  "method": "sov",
  "options": {
    "key_type": "ed25519"
  }
}){
  let data;
  await axios.post(`${url}wallet/did/create`, body)
    .then(res => {
      data = res.data.result;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  createDid
};