const axios = require('axios');
const common = require('../common/index');

async function receiveInvitation(url, alias, auto_accept, mediation_id, body={}){
  const param = common.paramGenerator([["alias",alias],["auto_accept", auto_accept],["mediation_id", mediation_id]]);
  let data;
  await axios.post(`${url}connections/receive-invitation${param}`, body)
    .then(res => {
      data = res.data;
      data.status = true;
    })
    .catch(err => {
      console.log(err);
      data.status = true;
      data.error = err;
    })
  return data;
}

module.exports = {
  receiveInvitation
};