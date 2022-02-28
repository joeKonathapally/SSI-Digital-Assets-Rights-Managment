const axios = require('axios');
const common = require('../common/index');

async function createSchema(url, conn_id, create_transaction_for_endorser, body={}){
  const param = common.paramGenerator([["conn_id", conn_id],["create_transaction_for_endorser", create_transaction_for_endorser]]);
  let data;
  await axios.post(`${url}schemas${param}`, body)
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
  createSchema
};