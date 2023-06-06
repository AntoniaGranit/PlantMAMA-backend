import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-plantmama";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
mongoose.set('debug', true);



// Variables and dependencies
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');
dotenv.config();

// // Declaration of variables to use cloudinary instance
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


// Middlewares
app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
});

// Multer configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'plants' // Specify the folder where you want to store the uploaded files in Cloudinary
  }
});

const upload = multer({ storage: storage });

// Use the multer middleware for handling file uploads
app.use(upload.single('image'));


// Import plant routes
const addplant = require('./routes/plant/addplant');
const plantprofile = require('./routes/plant/plantprofile');
const editplant = require('./routes/plant/editplant');
const deleteplant = require('./routes/plant/deleteplant');
const garden = require('./routes/plant/garden');

// Import user routes
const register = require('./routes/user/register');
const login = require('./routes/user/login');
const userprofile = require('./routes/user/userprofile');
const editprofile = require('./routes/user/editprofile');
const deleteuser = require('./routes/user/deleteuser');

// Use plant routes
app.use('/', addplant);
app.use('/', plantprofile);
app.use('/', editplant);
app.use('/', deleteplant);
app.use('/', garden);

// Use user routes
app.use('/', register);
app.use('/', login);
app.use('/', userprofile);
app.use('/', editprofile);
app.use('/', deleteuser);


// Index route
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
