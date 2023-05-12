const express = require('express');
const mongoose = require('mongoose'); 
const multer = require('multer'); 
const pdfImgConvert = require('pdf-img-convert');
const uploadModel = require('./models/uploadModel');
const ImagesModel = require('./models/ImagesModel');
const cors = require('cors');
require('dotenv/config');

const app = express();
app.use(cors());

// Connect to mongodb Atlas
mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  }).then(() => {
    console.log('Connected to mongodb successfully');
  }).catch((error) => {
    console.log('No connection, ' + error);
  })

// Store file in buffer or server'memory instead of disk
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10000000 }    // 10mb 
});


app.post('/uploadForm', upload.single('myFile'), async (req, res) => {

    try { 
      const fileBuffer = req.file.buffer; 
      const fileType  = req.file.mimetype; 
      if (fileType !== 'application/pdf'){
        return  res.send({
          success:  "wrongFile" , 
          message : "Please upload pdf file only"})
      } 

      // Convert the PDF file to images using pdfImgConvert   
      const images = await pdfImgConvert.convert(fileBuffer, {
        width: 300, //Number in px
        height: 300, // Number in px 
        density: 300,
        format: 'png', 
      }); 

      const uploadDoc = new uploadModel({
        filename: req.file.originalname,
        data: fileBuffer,
        contentType: fileType,
        fullName: req.body.fullName,
        email: req.body.email,
        images: []
      });   

      //  As images return ArrayBuffer so convert it to Buffer 
      const imageObjects = images.map(image => ({ data: Buffer.from(image) })); 
      // Insert All images of pdf at once in db
      const savedImages = await ImagesModel.insertMany(imageObjects); 

      // Add the IDs of the images to the document's images array
      uploadDoc.images = savedImages.map((image) => {
        return image._id;
      }); 

      const savedUpload = await uploadDoc.save(); 

      res.send({
        success: true,
        message: "Submitted Sucessfully", 
        upload: savedUpload,
      });

    } catch (error) {
      console.error('Error processing file upload:', error);
      res.status(500).send({
        success:  false,
        message: 'An error occured, Please try again.'
      });
    }
  });




  app.get('/pdf/:id', async (req, res) => {
    try {
      const uploadId = req.params.id;
      const upload = await uploadModel.findById(uploadId);

      if (!upload) {
        return res.status(404).json({ success: false, message: 'PDF not found' });
      }

      const images = await ImagesModel.find({ _id: { $in: upload.images } });

      const formattedImages = images.map((image) => ({
        _id: image._id,
        data: image.data.toString('base64')
      }));

      res.json({ success: true, upload, images: formattedImages });

    } catch (error) {
      console.error('Error retrieving PDF and images:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An error occurred while retrieving the PDF and images' });
    }
  });





app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});