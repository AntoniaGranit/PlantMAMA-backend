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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


//////////////////// SCHEMAS ////////////////////

// User schema
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true
  },
  numberOfPlants: {
    type: Number
  },
  colorOfThumb: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
})

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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
