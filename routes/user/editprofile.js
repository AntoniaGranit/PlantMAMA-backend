const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');

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
router.patch("/:username", async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({ accessToken: accessToken });
    const username = req.params.username;
    if (user.username === username) {
      const { username, email, password } = req.body;
      if (username) {
        user.username = username; // Change username
      }
      // if (location) {
      //   user.location = location; // Change location
      // }
      if (email) {
        user.email = email; // Change email
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