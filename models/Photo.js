const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//DB Conneciton

const photoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now
  },
});

const Photo = mongoose.model('Photos', photoSchema);

module.exports = Photo;
