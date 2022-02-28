const axios = require('axios');

async function getSchemaId(url, schema_id){
  let data;
  await axios.get(`${url}schemas/${schema_id}`)
    .then(res => {
      data = res.data.schema;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getSchemaId
};