const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');
const methodOverride = require('method-override');
const photoController = require('./controllers/photoController');
const pageContoller = require('./controllers/pageContoller');


const app = express();

mongoose.connect('mongodb+srv://ferhat:fPTigCShMJEa2Je@cluster0.6u3u9.mongodb.net/pcat-db?retryWrites=true&w=majority')
.then(() =>{console.log('DB Connected')})
.catch((err) => console.log(err))

//Template engine
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //json ile haberleşileceğini bildirme
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

// Routes
app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);
app.post('/photos', photoController.createPhoto);

app.get('/about', pageContoller.getAboutPage);
app.get('/add', pageContoller.getAddPage);
app.get('/photos/edit/:id', pageContoller.getEditPage);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
