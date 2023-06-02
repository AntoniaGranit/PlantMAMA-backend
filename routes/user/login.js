import bcrypt from "bcrypt";
const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username: username })
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          success: true,
          response: {
            username: user.username,
            id: user._id,
            accessToken: user.accessToken
          }
        })
      } else {
        res.status(400).json({
          success: false,
          response: "Username or password incorrect"
        })
      }
    } catch(e) {
      // 500 database error
      res.status(500).json({
        success: false,
        response: e
      })
    }
  });

  module.exports = router;