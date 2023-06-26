const express = require('express');
const router = express.Router();
const authenticateUser = require('../authenticateuser');

// Import schemas
const User = require('../../schemas/user');
const Plant = require('../../schemas/plant');

// Add plant to garden
router.post("/addplant", authenticateUser);
router.post("/addplant", async (req, res) => {
  try {
  const { plantname, species } = req.body;
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const plants = await new Plant({
    plantname: plantname,
    species: species,
    user: user._id
  }).save()
  res.status(200).json({
    success: true,
    response: {
      plants: plants
    }
})
} catch (e) {
  res.status(500).json({
    success: false,
    response: e
  })
}
});

module.exports = router;