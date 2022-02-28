const axios = require('axios');

async function issueCredentials(url, cred_ex_id, body={}){
  let data;
  await axios.post(`${url}issue-credential-2.0/records/${cred_ex_id}/issue`, body)
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
  issueCredentials
};