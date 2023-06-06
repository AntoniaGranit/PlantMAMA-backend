const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');
const Plant = require('../../schemas/plant');

// // Declaration of variables to use cloudinary instance
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
});

// Multer configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'plants' // Specify the folder where you want to store the uploaded files in Cloudinary
  }
});

const upload = multer({ storage: storage });

// Use the multer middleware for handling file uploads
router.use(upload.single('image'));

// Authenticate user
const authenticateUser = async (req, res, next) => {
    const accessToken = req.header("Authorization");
    try {
      const user = await User.findOne({accessToken: accessToken});
      if (user) {
        next();
      } else {
        res.status(401).json({
          success: false,
          response: "Please log in"
        })
      } 
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        response: e.message
      })
    }
  };

// Edit plant profile
router.patch('/:username/garden/:plantId', authenticateUser);
router.patch('/:username/garden/:plantId', async (req, res) => {
  try {
    console.log("hejhej testing");
    const accessToken = req.header('Authorization');
    const user = await User.findOne({ accessToken: accessToken });
    const { plantname, species, imageUrl, birthday } = req.body;
    const plantId = req.params.plantId;
    // Find the plant by ID and make sure it belongs to the user
    const plant = await Plant.findOne({ _id: plantId, user: user._id });

    if (plant) {
      if (plantname) {
        plant.plantname = plantname; // Change plantname
      }
      if (species) {
        plant.species = species; // Change species
      }
      if (imageUrl) {
        const file = req.files.image; // Change plant photo
        // testing image upload to cloudinary
        try {
          const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'plants',
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
          });
          plant.imageUrl = imageUpload.secure_url;
        } catch (e) {
          res.status(500).json({
            success: false,
              response: e
          })
        }
      }
      if (birthday) {
        plant.birthday = birthday; // Change birthday
      }
      await plant.save(); // Save the updated plant
      res.status(200).json({
        success: true,
        message: 'Plant updated successfully',
        response: plant,
      });
    } else {
      res.status(404).json({
        success: false,
        response: 'Plant not found',
      });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      success: false,
      response: e.message,
    });
  }
});

module.exports = router;