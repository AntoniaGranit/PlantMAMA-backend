const express = require('express');
const router = express.Router();
const authenticateUser = require('../authenticateuser');

// Import schemas
const User = require('../../schemas/user');

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