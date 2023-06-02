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

  // Add plant to garden
router.post("/", authenticateUser);
router.post("/", async (req, res) => {
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