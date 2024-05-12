const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  postid: {
    type: String, // Adjust the type to String
    required: true
  },
  username:{
    type:String,
    requried:true
  }

});

module.exports = mongoose.model('comment', commentSchema);
