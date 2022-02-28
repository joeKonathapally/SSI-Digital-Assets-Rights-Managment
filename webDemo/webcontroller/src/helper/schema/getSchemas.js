const axios = require('axios');
const common = require('../common/index');

async function getSchemas(url, schema_id, schema_issuer_did, schema_name, schema_version){
  const param = common.paramGenerator([["schema_id", schema_id],["schema_issuer_did", schema_issuer_did],["schema_name", schema_name],["schema_version", schema_version]]);
  let data;
  await axios.get(`${url}schemas/created${param}`)
    .then(res => {
      data = res.data.schema_ids;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getSchemas
};