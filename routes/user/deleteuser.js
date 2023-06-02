const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');
const Plant = require('../../schemas/plant');

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

// Delete user
router.delete('/:username', authenticateUser);
router.delete('/:username', async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({ accessToken: accessToken });
    const username = req.params.username;
    if (user.username === username) {
      await User.findOneAndDelete({ username: username });
      await Plant.deleteMany({ user: user._id });
      res.status(200).json({
        success: true,
        message: "Profile and associated plants successfully deleted"
      });
    } else {
      res.status(401).json({
        success: false,
        response: "You are not authorized to delete this profile"
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