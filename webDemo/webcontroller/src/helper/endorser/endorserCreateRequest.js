const axios = require('axios');
const common = require('../common/index');

async function endorserCreateRequest(url, tran_id, endorser_write_txn, body={
  "expires_time": "2025-03-29T05:22:19Z"
}){
  const param = common.paramGenerator([["tran_id", tran_id],["endorser_write_txn", endorser_write_txn]]);
  let data;
  await axios.post(`${url}transactions/create-request${param}`, body)
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
  endorserCreateRequest
};