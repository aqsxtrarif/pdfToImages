const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
    data: {
        type:  Buffer,
        required: true
    }
});

const ImagesModel = mongoose.model('PdfImages', imagesSchema )
module.exports = ImagesModel