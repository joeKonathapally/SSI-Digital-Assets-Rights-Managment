const axios = require('axios');

async function getImagesFromRegistry(){
  let data;
  await axios.get(`${process.env.REACT_APP_FILE_SERVER_URL}imageRegistryFiles`)
    .then(res => {
      data = res.data.files;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getImagesFromRegistry
}