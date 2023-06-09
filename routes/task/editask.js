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

// Edit task profile
router.patch('/:username/todo/:taskId', authenticateUser);
router.patch('/:username/todo/:taskId', async (req, res) => {
  try {
    const accessToken = req.header('Authorization');
    const user = await User.findOne({ accessToken: accessToken });
    const { isChecked, content } = req.body;
    const taskId = req.params.taskId;
    // Find the task by ID and make sure it belongs to the user
    const task = await Task.findOne({ _id: taskId, user: user._id });

    if (task) {
      if (isChecked) {
        task.isChecked = !isChecked;
      }
      if (content) {
        task.content = content; 
      }

      await task.save(); // Save the updated task
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        response: task,
      });
    } else {
      res.status(404).json({
        success: false,
        response: 'Task not found',
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