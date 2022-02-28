const axios = require('axios');
const common = require('../common/index');

async function registerPublicDid(url, did, verkey, alias, role){
  // console.log(url, did, verkey, alias, role);
  const param = common.paramGenerator([["did",did],["verkey", verkey],["alias", alias],["role", role]]);
  let obj;
  await axios.post(`${url}ledger/register-nym${param}`)
    .then(res => {
      obj={
        success: true
      }
    })
    .catch(err => {
      console.log(err);
      obj={
        success: false
      }
    })
  return obj;
}

module.exports = {
  registerPublicDid
};