const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const serveIndex = require('serve-index');
const fs = require('fs');
const crypto = require('crypto-js');


const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 5000;

if(!fs.existsSync('uploads/')){
  fs.mkdirSync('uploads/');
}

if(!fs.existsSync('imageRegistry/')){
  fs.mkdirSync('imageRegistry/');
}

app.post('/uploadImage', async (req, res) => {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let image = req.files.image;
          
          image.mv('./uploads/' + req.body.hash);

          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: image.name,
                  mimetype: image.mimetype,
                  size: image.size
              }
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

app.post('/uploadImageToRegistry', async (req, res) => {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          let image = req.files.image;
          
          image.mv('./imageRegistry/' + image.name);

          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: image.name,
                  mimetype: image.mimetype,
                  size: image.size
              }
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

app.get('/moveToRegistry', async (req, res) => {
  try{
    let oldPath = './uploads/'+req.query.filename;
    let newPath = './imageRegistry/'+req.query.filename;
    fs.copyFile(oldPath, newPath, function (err) {
      if (err){
        res.send({
          status: false,
          message: "Image does not exist"
        })
      } else {
        res.send({
          status: true,
          message: "Successfully moved the files"
        })
      }
    })
  }catch(err){
    console.log(err);
    res.send({
      status: false,
      message: err
    });
  }
});

app.get('/imageHash', async (req, res) => {
  try{
    fs.readFile('./imageRegistry/'+req.query.filename, {encoding: 'base64'}, function(err, data) {
      if (err) throw err
      let input = data;
      let hash = crypto.SHA3(input.toString());
      hash = hash.toString(crypto.enc.Hex);
      res.send({
        status: true,
        message: hash
      });
    })
  }catch(err){
    console.log(err);
    res.send({
      status: false,
      message: err
    });
  }
});

app.get('/uploadsFiles', async (req, res) => {
  const dir = './uploads/';
  try {
      const files = fs.readdirSync(dir);
      res.send({
        files: files
      });

  } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: 'Could not read directory'
      });
  }
});

app.get('/imageRegistryFiles', async (req, res) => {
  const dir = './imageRegistry/';
  try {
      const files = fs.readdirSync(dir);
      res.send({
        files: files
      });

  } catch (err) {
      console.log(err);
      res.send({
        status: false,
        message: 'Could not read directory'
      });
  }
});

app.use('/uploads', express.static('uploads'));
app.use('/imageRegistry', express.static('imageRegistry'));

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);