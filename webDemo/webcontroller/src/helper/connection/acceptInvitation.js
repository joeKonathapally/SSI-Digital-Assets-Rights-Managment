const axios = require("axios");

async function acceptInvitation( url, conn_id){

  let finalUrl = url+'connections/'+conn_id+'/accept-invitation'
  let ack;

  await axios.post(finalUrl)
    .then(res => {
      ack = res.data;
    })
  
  return ack;

};

module.exports = {
  acceptInvitation
};