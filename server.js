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

const { Schema } = mongoose;

// User schema
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
  },
  user: {
    type: String,
    require: true
  }
})

const Plant = mongoose.model("Plant", PlantSchema);


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


// Add plant to garden
app.post("/addplant", authenticateUser);
app.post("/addplant", async (req, res) => {
  try {
  const { plantname, species } = req.body;
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const plants = await new Plant({
    plantname: plantname,
    species: species,
    user: user._id
  }).save()
  res.status(200).json({
    success: true,
    response: {
      plants: plants
    }
})
} catch (e) {
  res.status(500).json({
    success: false,
    response: e
  })
}
});


// Get user's plants
app.get("/:username/garden", authenticateUser);
app.get("/:username/garden", async (req, res) => {
  const accessToken = req.header("Authorization");
  const user = await User.findOne({accessToken: accessToken});
  const plants = await Plant.find({user: user._id});
  res.status(200).json({
    // missing error catching 
    success: true, 
    response: plants})
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


// Log in endpoint
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


// User profile endpoint
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


// Delete user
app.delete('/:username/delete', authenticateUser);
app.delete('/:username/delete', async (req, res) => {
  try {
    const accessToken = req.header("Authorization");
    const user = await User.findOne({ accessToken: accessToken });
    const username = req.params.username;
    if (user.username === username) {
      await User.findOneAndDelete({ username: username });
      await Plant.deleteMany({ user: user._id });
      res.status(200).json({
        success: true,
        message: "Profile and associated successfully deleted"
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
