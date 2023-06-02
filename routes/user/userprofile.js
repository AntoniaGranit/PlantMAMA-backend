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

// User profile
router.get("/:username", authenticateUser);
router.get('/:username', async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({accessToken: accessToken});
    const username = req.params.username;
    const singleUser = await User.findOne({username: username});
    if (singleUser) {
      res.status(200).json({
        message: 'User profile',
        success: true,
        user: user._id,
        body: singleUser
      })
    } else {
      res.status(404).json({
        success: false,
        response: 'No user by that name found'
      })
    }
  } catch (e) {
    res.status(500).json({
      success: false,
        response: e
    })
  }
});

  module.exports = router;