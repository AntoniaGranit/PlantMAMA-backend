import bcrypt from "bcrypt";
const express = require('express');
const router = express.Router();

// Import schemas
const User = require('../../schemas/user');

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const salt = bcrypt.genSaltSync();
      const newUser = await new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, salt)
      }).save()
      // 201 status code - successful creation of user
      res.status(201).json({
        success: true,
        response: {
          username: newUser.username,
          email: newUser.email,
          id: newUser._id,
          accessToken: newUser.accessToken
        }
      })
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e
      })
    }
  });

  module.exports = router;