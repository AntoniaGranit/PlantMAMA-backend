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

router.get("/users/:username/garden", authenticateUser);
router.get("/users/:username/garden", async (req, res) => {
  try {
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const plants = await Plant.find({user: user._id});
  if (plants) {
  res.status(200).json({
    // missing error catching 
    success: true, 
    response: plants
  })
  } else {
    res.status(404).json({
      success: false,
      response: 'Garden not found'
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