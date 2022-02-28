const axios = require('axios');

async function sendPresentationRequest(url, body={},pres_ex_id=undefined){
  let bodyRaw ={
    trace: true,
    ...body
  }
  let data;
  if(pres_ex_id !== undefined){
  await axios.post(`${url}present-proof/records/${pres_ex_id}/send-request`, bodyRaw)
    .then(res => {
      data = res.data.results;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  }
  else {
    await axios.post(`${url}present-proof/send-request`, bodyRaw)
    .then(res => {
      data = res.data.results;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })  
  }
  return data;
}

module.exports = {
  sendPresentationRequest
};