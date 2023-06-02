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

// Plant profile
router.get("/:username/garden/:plantId", authenticateUser);
router.get("/:username/garden/:plantId", async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({accessToken: accessToken});
    const plantId = req.params.plantId;
    // find plant by its name and make sure it belongs to the user
    const plant = await Plant.findOne({ _id: plantId, user: user._id })
    if (plant) {
      res.status(200).json({
        message: "Plant profile",
        success: true,
        response: plant
      })
    } else {
      res.status(404).json({
        success: false,
        response: "Plant not found"
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