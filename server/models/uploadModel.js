const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  filename: String,
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: Buffer,
    required: true
  },
  fullName: String,
  email: String,
  images: {
    type:  Array,
    required: true
  },
});
 
const uploadModel = mongoose.model('Pdf', uploadSchema);

module.exports = uploadModel;