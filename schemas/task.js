const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true
    },
    isChecked: {
      type: Boolean,
    },
    user: {
      type: String,
      require: true
    }
  });

module.exports = mongoose.model('Task', TaskSchema);