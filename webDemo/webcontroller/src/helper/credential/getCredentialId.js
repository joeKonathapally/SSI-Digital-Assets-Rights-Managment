const axios = require('axios');

async function getCredentialId(url, credential_id){
  let data;
  await axios.get(`${url}credential/${credential_id}`)
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
  getCredentialId
};