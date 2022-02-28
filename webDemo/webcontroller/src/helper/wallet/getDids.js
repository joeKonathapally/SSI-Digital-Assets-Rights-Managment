const axios = require('axios');

async function getDids(url){
  let data;
  await axios.get(`${url}wallet/did`)
    .then(res => {
      data = res.data.results;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getDids
};