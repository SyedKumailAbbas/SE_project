const comment = require("../models/comment")


const addComment = async (req, res) => {
  const { postid, username } = req.params;
  const { commentBody } = req.body;

  try {
    // Create a new comment using the Comment model
    const newComment = new comment({
      body: commentBody,
      username,
      postid, // Associate the comment with the post
    });

    // Save the new comment to the database
    await newComment.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPostComments = async (req, res) => {
  const { postid } = req.params;

  try {
    // Find all comments with the specified post ID
    const comments = await comment.find({ postid: postid });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching post comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const delcomment = async (req, res) => {
  const { commentId } = req.params
  try {
    // Find the comment by its ID and delete it
    await comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}
module.exports = { addComment, getPostComments ,delcomment};
