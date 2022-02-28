const axios = require('axios');

async function getImages(){
  let data;
  await axios.get(`${process.env.REACT_APP_FILE_SERVER_URL}uploadsFiles`)
    .then(res => {
      data = res.files;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  getImages
}