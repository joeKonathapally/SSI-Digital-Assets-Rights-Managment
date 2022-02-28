const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

async function uploadImageToRegistry(file){
  let data;
  const formData = new FormData();
  formData.append('image', file);
  await axios.post(`${process.env.REACT_APP_FILE_SERVER_URL}uploadImageToRegistry`, formData, {
    headers: formData.getHeaders()
  }).then(res => {
      data = res.files;
    })
    .catch(err => {
      console.log(err);
      data = undefined;
    })
  return data;
}

module.exports = {
  uploadImageToRegistry
}