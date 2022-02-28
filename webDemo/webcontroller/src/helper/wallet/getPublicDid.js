const axios = require('axios');

async function getPublicDid(url){
  let data;
  await axios.get(`${url}wallet/did/public`)
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
  getPublicDid
};