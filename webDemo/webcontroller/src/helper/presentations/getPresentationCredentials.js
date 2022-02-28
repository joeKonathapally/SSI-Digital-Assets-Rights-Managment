const axios = require('axios');
const common = require('../common/index');

async function getPresentationCredentials(url, pres_ex_id, count, extra_query, referent, start){
  const param = common.paramGenerator([["count", count],["extra_query", extra_query],["referent", referent],["start", start]]);
  let data;
  await axios.get(`${url}present-proof/records/${pres_ex_id}/credentials${param}`)
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
  getPresentationCredentials
};