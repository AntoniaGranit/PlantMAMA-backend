const mongoose = require('mongoose');

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
  });

module.exports = mongoose.model('Plant', PlantSchema);