const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

async function uploadImage(file, hash){
  let data;
  const formData = new FormData();
  formData.append('image', file);
  formData.append('hash', hash);
  await axios.post(`${process.env.REACT_APP_FILE_SERVER_URL}uploadImage`, formData)
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
  uploadImage
}