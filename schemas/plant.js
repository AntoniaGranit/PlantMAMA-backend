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
      default: 'https://res.cloudinary.com/dh943gnqh/image/upload/v1686509048/plantvector_h0epmf.png'
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