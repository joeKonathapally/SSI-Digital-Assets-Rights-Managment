const axios = require('axios');
const common = require('../common/index');

async function setEndorserInfo(url, conn_id, endorser_did){
  const param = common.paramGenerator([["endorser_did", endorser_did]]);
  let data;
  await axios.post(`${url}transactions/${conn_id}/set-endorser-info${param}`)
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
  setEndorserInfo
};