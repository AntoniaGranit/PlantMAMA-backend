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


// Delete task
router.delete('/:username/todo/:taskId', authenticateUser);
router.delete('/:username/todo/:taskId', async (req, res) => {
  try {
    const accessToken = req.header('Authorization');
    const user = await User.findOne({ accessToken: accessToken });
    const taskId = req.params.taskId;
    // find task by id and make sure it belongs to the user
    const task = await Task.findOne({ _id: taskId, user: user._id });
    if (task) {
      // Delete the task
      await Task.deleteOne({ _id: taskId });
      res.status(200).json({
        success: true,
        response: 'Task deleted successfully',
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