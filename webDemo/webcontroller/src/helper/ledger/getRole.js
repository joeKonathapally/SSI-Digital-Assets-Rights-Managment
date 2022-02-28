const axios = require('axios');
const common = require('../common/index');

async function getRole(url, did){
  // console.log(url, did);
  const param = common.paramGenerator([["did",did]]);
  let data;
  await axios.get(`${url}ledger/get-nym-role${param}`)
    .then(res => {
      data = res.data.role;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getRole
};