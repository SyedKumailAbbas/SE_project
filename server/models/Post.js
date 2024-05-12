const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['announcement', 'assignment'], // Allow only 'announcement' or 'assignment' as type
    required: true
  },
  duedate: {
    type: Date,
    required: function() { // Required only when the type is 'assignment'
      return this.type === 'assignment';
    }
  },
  classid: {
    type: String,
    required: true
  },
  submissions: {
    type: [
      {
        studentUsername: {
          type: String,
          required: true
        },
        submissionLink: {
          type: String,
          required: true
        },
        submissionTime: {
          type: Date,
          default: Date.now // Default value is current timestamp
        }
      }
    ],
    required: function() { // Required only when the type is 'assignment'
      return this.type === 'assignment';
    }
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
