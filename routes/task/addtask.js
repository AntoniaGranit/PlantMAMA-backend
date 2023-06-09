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

  // Add task to todo
router.post("/addtask", authenticateUser);
router.post("/addtask", async (req, res) => {
  try {
  const { content } = req.body;
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const tasks = await new Task({
    content: content,
    isChecked: false,
    user: user._id
  }).save()
  res.status(200).json({
    success: true,
    response: {
      tasks: tasks
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