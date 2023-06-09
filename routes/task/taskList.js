const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');
const Task = require('../../schemas/task');

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

router.get("/:username/todo", authenticateUser);
router.get("/:username/todo", async (req, res) => {
  try {
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const tasks = await Task.find({user: user._id});
  if (tasks) {
  res.status(200).json({
    // missing error catching 
    success: true, 
    response: tasks
  })
  } else {
    res.status(404).json({
      success: false,
      response: 'Tasks not found'
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