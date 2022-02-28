const axios = require("axios");

async function acceptRequest( url, conn_id){

  let finalUrl = url+'connections/'+conn_id+'/accept-request'
  let ack;

  await axios.post(finalUrl)
    .then(res => {
      ack = res.data;
    })
  
  return ack;

};

module.exports = {
  acceptRequest
};