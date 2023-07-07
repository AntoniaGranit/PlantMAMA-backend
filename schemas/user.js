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
      unique: true,
      validate(value) {
        if(!validator.isEmail(value)) {
          throw new Error('Invalid email address');
        }
      }
    },
    city: {
      type: String,
      default: 'Earth',
    },
    level: {
      type: String,
      default: 'Beginner',
    },
    bio: {
      type: String,
      default: '80 years old. I love Ice cream and plants. Less disappointing than humans, less demanding than a cat, plants are the perfect partners for anyone who is trying to balance work, money, commitments and a desire to live surrounded by beauty. Plants make you feel good (#science) and looking after your green frondy friends brings joy into your life.',
    },
    imageUrl: {
      type: String,
      default: 'https://res.cloudinary.com/dh943gnqh/image/upload/v1686508699/profilepic_mhqftt.svg'
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