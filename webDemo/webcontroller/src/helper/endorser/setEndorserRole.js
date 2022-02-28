const axios = require('axios');
const common = require('../common/index');

async function setEndorserRole(url, conn_id, transaction_my_job){
  const param = common.paramGenerator([["transaction_my_job",transaction_my_job]]);
  let data;
  await axios.post(`${url}transactions/${conn_id}/set-endorser-role${param}`)
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
  setEndorserRole
};