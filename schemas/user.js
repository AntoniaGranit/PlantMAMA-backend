import crypto from "crypto";
const mongoose = require('mongoose');
const validator = require('validator');

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
    city: {
      type: String
    },
    level: {
      type: String
    },
    bio: {
      type: String
    },
    imageUrl: {
      type: String,
      default: 'https://res.cloudinary.com/dh943gnqh/image/upload/v1686508049/defaultprofpic_nr87vr.png'
    },
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

module.exports = mongoose.model('User', UserSchema);