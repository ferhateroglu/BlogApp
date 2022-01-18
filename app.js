const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');

const Photo = require('./models/Photo');

const app = express();

mongoose.connect('mongodb://localhost/pcat-test-db');
const port = 3000;

//Template engine
app.set('view engine', 'ejs');

app.use(express.static('public')); //middleware ekleme
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //json ile haberleşileceğini bildirme
app.use(fileUpload());
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render('index', {
    photos: photos,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  const makeUploadDir = 'public/uploads';

  if (!fs.existsSync(makeUploadDir)) {
    fs.mkdirSync(makeUploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    //file'ı dizine kaydetme ardından veri tabanına veri kaydetme
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', { photo });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect('/photos/' + photo._id);
});

app.get('/photos/:id', async (req, res) => {
  //console.log(req.params.id);
  const photo = await Photo.findById(req.params.id);
  res.render('photo', { photo: photo });
});

app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
