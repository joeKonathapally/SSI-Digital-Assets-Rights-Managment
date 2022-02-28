const axios = require('axios');

async function refuseTransactions(url, tran_id){
  let data;
  await axios.post(`${url}transactions/${tran_id}/refuse`)
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
  refuseTransactions
};