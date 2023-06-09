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

// Middlewares
app.use(cors());
app.use(express.json());


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

// Import task routes

const addtask = require('./routes/task/addtask');
const deletetask = require('./routes/task/deletetask');
const edittask = require('./routes/task/editask');
const tasklist = require('./routes/task/tasklist');

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

// Use task routes
app.use('/', addtask);
app.use('/', deletetask);
app.use('/', edittask);
app.use('/', tasklist);



// Index route
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
