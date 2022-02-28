const axios = require('axios');

async function deleteCredentialId(url, credential_id){
  let data;
  await axios.delete(`${url}credential/${credential_id}`)
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
  deleteCredentialId
};