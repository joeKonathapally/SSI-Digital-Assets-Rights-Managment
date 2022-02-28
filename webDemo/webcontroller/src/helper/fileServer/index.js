const {getImages} = require('./getImages');
const {getImagesFromRegistry} = require('./getImagesFromRegistry');
const {downloadImage} = require('./downloadImage');
const {downloadImageFromRegistry} = require('./downloadImageFromRegistry');
const {uploadImage} = require('./uploadImage');
const {uploadImageToRegistry} = require('./uploadImageToRegistry');

module.exports = {
  getImages,
  getImagesFromRegistry,
  downloadImage,
  downloadImageFromRegistry,
  uploadImage,
  uploadImageToRegistry
};