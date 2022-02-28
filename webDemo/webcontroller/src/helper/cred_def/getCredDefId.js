const axios = require('axios');

async function getCredDefId(url, cred_def_id){
  let data;
  await axios.get(`${url}credential-definitions/${cred_def_id}`)
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
  getCredDefId
};