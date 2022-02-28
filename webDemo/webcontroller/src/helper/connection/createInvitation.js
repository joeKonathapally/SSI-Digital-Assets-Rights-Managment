const axios = require('axios');
const common = require('../common/index');

async function createInvitation(url, alias, auto_accept, multi_use, public_did, body={}){
  const param = common.paramGenerator([["alias",alias],["auto_accept", auto_accept],["multi_use", multi_use],["public", public_did]]);
  let data;
  await axios.post(`${url}connections/create-invitation${param}`, body)
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
  createInvitation
};