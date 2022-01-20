const fs = require('fs');
const Photo = require('../models/Photo');


exports.getAllPhotos = async (req, res) => {

  const page = req.query.page || 1;
  const photoPerPage = 3;
  const totalPhotos = await Photo.find().countDocuments();
  console.log(page);

  const photos = await Photo.find({})
  .sort('-dateCreated')
  .skip((page - 1)*photoPerPage)
  .limit(photoPerPage);
  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photoPerPage)
  })
  /*
  const photos = await Photo.find({}).sort('-dateCreated');
 ;*/
};

exports.getPhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', { photo: photo });
  }

exports.createPhoto = async (req, res) => {
    const makeUploadDir = 'public/uploads';
  
    if (!fs.existsSync(makeUploadDir)) {
      fs.mkdirSync(makeUploadDir);
    }
  
    let uploadedImage = req.files.image;
    let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;
  
    uploadedImage.mv(uploadPath, async () => {
      //file'ı dizine kaydetme ardından veri tabanına veri kaydetme
      await Photo.create({
        ...req.body,
        image: '/uploads/' + uploadedImage.name,
      });
      res.redirect('/');
    });
  }

exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();
    res.redirect('/photos/' + photo._id);
}

exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/../public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
  }