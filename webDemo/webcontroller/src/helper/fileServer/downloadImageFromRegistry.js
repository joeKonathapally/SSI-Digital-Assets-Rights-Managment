const axios = require('axios');

async function downloadImageFromRegistry(file){
  let data;
  await axios.get(`${process.env.REACT_APP_FILE_SERVER_URL}imageRegistry/${file}`)
    .then(res => {
      data = res
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  downloadImageFromRegistry
}