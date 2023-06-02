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

// Edit plant profile
router.patch('/:username/garden/:plantId', authenticateUser);
router.patch('/:username/garden/:plantId', async (req, res) => {
  try {
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
        plant.imageUrl = imageUrl; // Change plant photo
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
    res.status(500).json({
      success: false,
      response: e,
    });
  }
});

module.exports = router;