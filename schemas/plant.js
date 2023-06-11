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
      type: String,
      default: 'https://picsum.photos/id/106/200/200'
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