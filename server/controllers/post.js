const post = require("../models/Post")

const createpost = async (req, res) => {
    try {
        const { title, description, classid, type, duedate } = req.body;
        const newpost = await post.create({ title, description, type, classid, duedate });
        res.status(201).json(newpost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getallpost = async (req, res) => {
    const classid = req.params.classid
    try {
        const posts = await post.find({ classid: classid })
        res.json(posts)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getpostbyid =async (req,res) => {
    const postid=req.params.postid
    try{
        const newpost=await post.findById(postid)
        res.json(newpost)
    }catch (err) {
        res.status(500).json({ message: err.message });
      }

}

const getpostbytype=async(req,res)=>{
    try{
        const ptype=req.params.type
        const cid=req.params.classid
        const newpost=await post.find({type:ptype,classid:cid})
        res.json(newpost)
    }
    catch (err) {
        res.status(500).json({ message: err.message });
      }
}


const submitassignment = async (req, res) => {
    const { postid, username } = req.params;
    const { submissionLink } = req.body;

    try {
        const Post = await post.findById(postid);
        if (!Post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (Post.type !== 'assignment') {
            return res.status(400).json({ message: "This post is not an assignment" });
        }

        // Check if the user has already submitted the assignment
        const existingSubmission = Post.submissions.find(submission => submission.studentUsername === username);
        if (existingSubmission) {
            return res.status(400).json({ message: "You have already submitted this assignment" });
        }

        // If the user hasn't already submitted, proceed with submission
        const submission = {
            studentUsername: username,
            submissionLink: submissionLink,
            submissionTime: new Date()
        };
        Post.submissions.push(submission);
        await Post.save();

        res.status(200).json({ message: "Submission successful" });
    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const getsubmissions = async (req, res) => {
    const { postid } = req.params;
    try {
        // Find the post by its ID
        const Post = await post.findById(postid);
        if (!Post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Return the submissions associated with the post
        res.status(200).json({ submissions: Post.submissions });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports={createpost,getallpost,getpostbyid,getpostbytype,submitassignment,getsubmissions}