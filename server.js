import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-plantmama";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
mongoose.set('debug', true);

// Variables and dependencies
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Middlewares
app.use(cors());
app.use(express.json());


// Import schemas
const User = require('./schemas/user');
const Plant = require('./schemas/plant');

// Import routes
const addPlant = require('./routes/plant/addplant');
const plantProfile = require('./routes/plant/plantprofile');
const editPlant = require('./routes/plant/editplant');
const deletePlant = require('./routes/plant/deleteplant');
const garden = require('./routes/plant/garden');

// Use routes
app.use('/addplant', addPlant);
app.use('/', plantProfile);
app.use('/', editPlant);
app.use('/', deletePlant);
app.use('/', garden);


//////////////////// ENDPOINTS ////////////////////

// Index route
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});


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


// Register user
app.post("/register", async (req, res) => {
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
})


// Log in
app.post("/login", async (req, res) => {
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


// User profile
app.get("/:username", authenticateUser);
app.get('/:username', async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({accessToken: accessToken});
    const username = req.params.username;
    const singleUser = await User.findOne({username: username});
    if (singleUser) {
      res.status(200).json({
        message: 'User profile',
        success: true,
        user: user._id,
        body: singleUser
      })
    } else {
      res.status(404).json({
        success: false,
        response: 'No user by that name found'
      })
    }
  } catch (e) {
    res.status(500).json({
      success: false,
        response: e
    })
  }
});


// Edit user profile
app.patch("/:username", authenticateUser);
app.patch("/:username", async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({ accessToken: accessToken });
    const username = req.params.username;
    if (user.username === username) {
      const { username, email, password } = req.body;
      if (username) {
        user.username = username; // Change username
      }
      // if (location) {
      //   user.location = location; // Change location
      // }
      if (email) {
        user.email = email; // Change email
      }
      if (password) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);
        user.password = hashedPassword; // Change password
      }
      await user.save(); // Save the updated user profile
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: user._id,
        body: user
      });
    } else {
      res.status(401).json({
        success: false,
        response: 'You are not authorized to edit this profile'
      });
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});


// Delete user
app.delete('/:username', authenticateUser);
app.delete('/:username', async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({ accessToken: accessToken });
    const username = req.params.username;
    if (user.username === username) {
      await User.findOneAndDelete({ username: username });
      await Plant.deleteMany({ user: user._id });
      res.status(200).json({
        success: true,
        message: "Profile and associated plants successfully deleted"
      });
    } else {
      res.status(401).json({
        success: false,
        response: "You are not authorized to delete this profile"
      });
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
