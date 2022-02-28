const axios = require('axios');

async function getCredentialExchanges(url){
  let data;
  await axios.get(`${url}issue-credential-2.0/records`)
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
  getCredentialExchanges
};