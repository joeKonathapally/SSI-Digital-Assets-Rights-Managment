const axios = require('axios');
const common = require('../common/index');

async function getConnections(url, alias, connection_protocol, invitation_key, my_did, state, their_did, their_role){
  const param = common.paramGenerator([["alias",alias],["connection_protocol", connection_protocol],["invitation_key", invitation_key],["my_did", my_did],["state",state],["their_did",their_did],["their_role", their_role]]);
  let data;
  await axios.get(`${url}connections${param}`)
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
  getConnections
};