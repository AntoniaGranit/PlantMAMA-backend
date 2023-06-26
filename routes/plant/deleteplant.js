const express = require('express');
const router = express.Router();
const authenticateUser = require('../authenticateuser');

// Import schemas
const User = require('../../schemas/user');
const Plant = require('../../schemas/plant');

// Delete plant
router.delete('/:username/garden/:plantId', authenticateUser);
router.delete('/:username/garden/:plantId', async (req, res) => {
  try {
    const accessToken = req.header('Authorization');
    const user = await User.findOne({ accessToken: accessToken });
    const plantId = req.params.plantId;
    // find plant by plantname and make sure it belongs to the user
    const plant = await Plant.findOne({ _id: plantId, user: user._id });
    if (plant) {
      // Delete the plant
      await Plant.deleteOne({ _id: plantId });
      res.status(200).json({
        success: true,
        response: 'Plant deleted successfully',
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