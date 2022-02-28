const axios = require('axios');
const common = require('../common/index');

async function getCredDefs(url, cred_def_id, issuer_did, schema_id, schema_issuer_did, schema_name, schema_version){
  const param = common.paramGenerator([["cred_def_id", cred_def_id],["issuer_did", issuer_did],["schema_id", schema_id],["schema_issuer_did", schema_issuer_did],["schema_name", schema_name],["schema_version", schema_version]]);
  let data;
  await axios.get(`${url}credential-definitions/created${param}`)
    .then(res => {
      data = res.data.credential_definition_ids;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getCredDefs
};