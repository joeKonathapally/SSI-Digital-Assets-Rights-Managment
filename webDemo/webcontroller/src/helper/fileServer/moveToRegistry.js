const axios = require('axios');

async function moveToRegistry(filename){
  let data;
  await axios.get(`${process.env.REACT_APP_FILE_SERVER_URL}moveToRegistry?filename=${filename}`)
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
  moveToRegistry
}