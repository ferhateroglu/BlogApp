const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;


//Template engine
app.set('view engine', 'ejs');

app.use(express.static('public'));//middleware eleme
app.use(express.urlencoded({extended:true}));
app.use(express.json());//json ile haberleşileceğini bildirme


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
