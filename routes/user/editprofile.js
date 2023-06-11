import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');

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
    folder: 'users'
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

// Edit user profile
router.patch("/:username", authenticateUser);
router.patch("/:username", upload.single('image'), async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({ accessToken: accessToken });
    const username = req.params.username;
    if (user.username === username) {
      const { username, email, city, level, bio, password } = req.body;
      if (username) {
        user.username = username; // Change username
      }
      if (email) {
        user.email = email; // Change email
      }
      if (city) {
        user.city = city; // Change city
      }
      if (level) {
        user.level = level; // Change city
      }
      if (bio) {
        user.bio = bio; // Change city
      }
      if (req.file) {
        user.imageUrl = req.file.path; // Change user photo
      }
      if (password) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);
        user.password = hashedPassword; // Change password
      }
      await user.save(); // Save the updated user profile
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: user._id,
        body: user
      });
    } else {
      res.status(401).json({
        success: false,
        response: 'You are not authorized to edit this profile'
      });
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});

  module.exports = router;