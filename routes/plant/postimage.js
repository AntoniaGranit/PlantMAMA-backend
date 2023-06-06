const express = require('express');
const router = express.Router();
import cloudinaryFramework from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const cloudinary = cloudinaryFramework.v2; 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'plants',
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
})
const parser = multer({ storage })

router.post('/photos', parser.single('image'), async (req, res) => {
	res.json({ imageUrl: req.file.path, imageId: req.file.filename})
});

module.exports = router;