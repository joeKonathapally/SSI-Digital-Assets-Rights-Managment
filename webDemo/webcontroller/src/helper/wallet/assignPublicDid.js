const axios = require('axios');
const common = require('../common/index');

async function assignPublicDid(url, did){
  // console.log(url, did);
  const param = common.paramGenerator([["did",did]]);
  let data;
  await axios.post(`${url}wallet/did/public${param}`)
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
  assignPublicDid
};