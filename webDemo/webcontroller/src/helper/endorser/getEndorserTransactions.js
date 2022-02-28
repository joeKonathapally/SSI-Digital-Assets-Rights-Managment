const axios = require('axios');

async function getEndorserTransactions(url, thread_id){
  let data;
  await axios.get(`${url}transactions`)
    .then(res => {
      // thread_id=undefined;
      // if(thread_id===undefined){
      //   data = res.data;
      // } else {
      //   let temp = (res.data.results).filter((val) => { return (val.thread_id === thread_id)});
      //   data = temp;
      // }
      data = res.data.results;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getEndorserTransactions
};