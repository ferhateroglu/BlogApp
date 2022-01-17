const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Photo = require('./models/Photo');

const app = express();

mongoose.connect('mongodb://localhost/pcat-test-db');
const port = 3000;


//Template engine
app.set('view engine', 'ejs');

app.use(express.static('public'));//middleware eleme
app.use(express.urlencoded({extended:true}));
app.use(express.json());//json ile haberleşileceğini bildirme


app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  res.render('index',{
    photos: photos
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/');

});

app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
