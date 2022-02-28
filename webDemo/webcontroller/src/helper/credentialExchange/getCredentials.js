const axios = require('axios');

async function getCredentials(url){
  let data;
  await axios.get(`${url}credentials`)
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
  getCredentials
};