const axios = require('axios');

async function endorseTransactions(url, tran_id){
  let data;
  await axios.post(`${url}transactions/${tran_id}/endorse`)
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
  endorseTransactions
};