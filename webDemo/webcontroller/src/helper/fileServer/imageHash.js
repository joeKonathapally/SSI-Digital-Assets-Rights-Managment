const axios = require('axios');

async function imageHash(filename){
  let data;
  await axios.get(`${process.env.REACT_APP_FILE_SERVER_URL}imageHash?filename=${filename}`)
  .then(res => {
    data = res;
  })
  .catch(err => {
    console.log(err);
    data = undefined;
  })
  return data;
}

module.exports = {
  imageHash
}