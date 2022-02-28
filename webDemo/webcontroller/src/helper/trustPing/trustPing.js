const axios = require('axios');

async function trustPing(url, conn_id, body={}){
  let data;
  await axios.post(`${url}connections/${conn_id}/send-ping`, body)
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
  trustPing
};