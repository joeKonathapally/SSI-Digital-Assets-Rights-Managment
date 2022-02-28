const axios = require('axios');

async function downloadImage(file){
  let data;
  await axios.get(`${process.env.REACT_APP_FILE_SERVER_URL}uploads/${file}`,{
    headers: {
      encoding: null
    }
  })
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
  downloadImage
}