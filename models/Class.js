const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  teacher: {
    type: String, // Adjust the type to String
    required: true
  },
  classCode: {
    type: String,
    required: true
  },
  students: [
    {
      type: String,
      ref: 'Student'
    }
  ]
});

module.exports = mongoose.model('Class', classSchema);
