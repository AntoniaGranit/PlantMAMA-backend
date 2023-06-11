import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');
const Plant = require('../../schemas/plant');

// Declaration of variables to use cloudinary instance
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'plants',
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage });

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
      res.status(500).json({
        success: false,
        response: e
      })
    }
  };

// Edit plant profile
router.patch('/:username/garden/:plantId', authenticateUser);
router.patch('/:username/garden/:plantId', upload.single('image'), async (req, res) => {
  try {
    const accessToken = req.header('Authorization');
    const user = await User.findOne({ accessToken: accessToken });
    const { plantname, species, birthday, lastWatered, lastSoilChange } = req.body;
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
      if (req.file) {
        plant.imageUrl = req.file.path; // Change plant photo
      }
      if (birthday) {
        plant.birthday = birthday; // Change birthday
      }
      if (lastWatered) {
        plant.lastWatered = lastWatered; 
      }
      if (lastSoilChange) {
        plant.lastSoilChange = lastSoilChange; 
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
    res.status(500).json({
      success: false,
      response: e,
    });
  }
});

module.exports = router;