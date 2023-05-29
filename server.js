import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-plantmama";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
mongoose.set('debug', true);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');
const validator = require('validator');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


//////////////////// SCHEMAS ////////////////////

// User schema
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
    }
  },
  // location: {
  //   type: String,
  //   required: true
  // },
  // numberOfPlants: {
  //   type: Number
  // },
  // colorOfThumb: {
  //   type: String
  // },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
});

const User = mongoose.model("User", UserSchema);

// Plant schema
const PlantSchema = new mongoose.Schema({
  plantname: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  imageUrl: {
    // not sure what to put here
    type: String
  },
  birthday: {
    type: Date,
    default: () => new Date()
  },
  lastWatered: {
    type: Date,
    default: () => new Date()
  },
  lastSoilChange: {
    type: Date,
    default: () => new Date()
  }
})

const Plant = mongoose.model("Plant", PlantSchema);


//////////////////// ENDPOINTS ////////////////////

// Index route
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});


// Register user endpoint
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


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
