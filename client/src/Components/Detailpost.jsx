import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from './Modal'; // Import the Modal component
import './CSS/Detailpost.css'; // Import CSS file for styling
import { toast } from 'react-toastify'; // Import toast notifications

const Detailpost = () => {
    // Extract parameters from the URL
    const { postid, username, teachername } = useParams();

    // States to manage post details, comments, submission link, and modal visibility
    const [post, setPost] = useState(null);
    const [commentBody, setCommentBody] = useState(''); // State for storing the comment text
    const [comments, setComments] = useState([]); // State for storing all comments
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [submissionLink, setSubmissionLink] = useState(''); // State for storing submission link
    const [assignments, setAssignments] = useState([]); // State for storing assignments
    const [showSubmissionModal, setShowSubmissionModal] = useState(false); // State for modal visibility


    // Fetch post details and comments on component mount
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/post/getpostbyid/${postid}`);
                setPost(response.data);
                fetchComments(); // Fetch comments when the post details are fetched
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };

        fetchPost();
    }, [postid]);
    const formatSubmissionTime = (submissionTime) => {
        const date = new Date(submissionTime);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero for single-digit minutes
    
        return `${day}${getDaySuffix(day)} ${month} ${formattedHours}:${formattedMinutes}${ampm}`;
    };
    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        switch (day % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };
    // Fetch comments associated with the post
    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/comment/${postid}`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Handle changes in the comment input field
    const handleCommentChange = (e) => {
        setCommentBody(e.target.value);
    };

    // Submit a new comment
    const handleSubmitComment = async () => {
        try {
            // Send the comment data to the backend
            await axios.post(`http://localhost:3000/comment/${postid}/${username}`, { commentBody });
            // Optionally, you can reload the post details after posting the comment
            fetchComments();
            // Clear the comment input field
            setCommentBody('');
            // Hide the comment form after submitting
            setShowCommentForm(false);
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    // Show all comments
    const handleShowAllComments = () => {
        setShowAllComments(true);
    };

    // Delete a comment
    const handleDeleteComment = async (commentId) => {
        try {
            // Send a request to delete the comment with the given ID
            // /del/:commentId
            await axios.delete(`http://localhost:3000/comment/del/${commentId}`);
            // Refetch comments to update the list
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Show assignment submission modal
    const handleSubmissionButtonClick = () => {
        setShowAssignmentModal(true);
    };

    // Show submission modal for teacher
    // Show submission modal for teacher
    // Show submission modal for teacher
    const handleShowSubmissionButtonClick = async (postId) => {
        try {
            // Fetch submissions for the specified post ID
            const response = await axios.get(`http://localhost:3000/post/getsubmissions/${postId}`);

            // Extract assignments from the response data
            const assignments = response.data.submissions;

            // Set the submissions in state to display in the modal
            setAssignments(assignments);
            console.log(assignments)
            // Show the submission modal
            setShowSubmissionModal(true);
        } catch (error) {
            console.error("Error fetching assignments:", error.message);
            // Optionally, you can display an error message or handle the error as needed
        }
    };


    // Submit assignment
    // Submit assignment
    const handleSubmitAssignment = async () => {
        try {
            if (!submissionLink) {
                toast.error('Submission link is required.'); // Display error toast for missing submission link
                return;
            }

            // Send the submission link to the backend
            await axios.post(`http://localhost:3000/post/submit/${postid}/${username}`, { submissionLink });
            // Close the assignment submission modal
            setShowAssignmentModal(false);
            // Show success toast upon successful submission
            toast.success('Assignment submitted successfully!');
            // Optionally, you can show a success message or update the UI
        } catch (error) {
            console.error('Error submitting assignment:', error);
            // Display error toast for any other errors
            toast.error('You have already submitted the assignment.');
        }
    };
    // Render loading message if post details are not loaded yet
    if (!post) {
        return <p>Loading post details...</p>;
    }

    // Render the component
    return (
        <div className="detail-post-container">
            <div className="post-details">
                <h1>{post.type}</h1>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                {/* Add more details as needed */}
            </div>
            <div className="comment-section">
                <div className="comment-form">
                    {/* Render comment form */}
                    {showCommentForm ? (
                        <div>
                            <textarea value={commentBody} onChange={handleCommentChange} />
                            <button onClick={handleSubmitComment}>Post Comment</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowCommentForm(true)}>Add Comment</button>
                    )}
                    {/* Render assignment submission button if applicable */}
                    {post.type === 'assignment' && username !== teachername && (
                        <button onClick={handleSubmissionButtonClick}>Submit Assignment</button>
                    )}
                    {/* Render show submission button for teacher */}
                    {username === teachername && (
                        <button onClick={() => handleShowSubmissionButtonClick(postid)}>Show Submissions</button>
                    )}
                </div>
                <div className="comment-list">
                    {/* Render comments */}
                    {showAllComments ? (
                        <Modal onClose={() => setShowAllComments(false)}>
                            <div className="all-comments">
                                {comments.map((comment) => (
                                    <div key={comment._id} className="comment">
                                        <p>{comment.username}</p>
                                        <p>{comment.body}</p>
                                        {/* Render additional comment details */}
                                        {comment.username === username && (
                                            <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Modal>
                    ) : (
                        comments.slice(0, 2).map((comment) => (
                            <div key={comment._id} className="comment">
                                <p>{comment.username}</p>
                                <p>{comment.body}</p>
                                {/* Render additional comment details */}
                                {comment.username === username && (
                                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                )}
                            </div>
                        ))
                    )}
                    {/* Render button to show more comments */}
                    {!showAllComments && comments.length > 2 && (
                        <button onClick={handleShowAllComments}>Show More Comments</button>
                    )}
                </div>
            </div>
            {/* Render assignment submission modal */}
            {showAssignmentModal && (
                <Modal onClose={() => setShowAssignmentModal(false)}>
                    <div className="assignment-submission-modal">
                        <input type="text" placeholder="Your submission" value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} />
                        <button onClick={handleSubmitAssignment}>Submit</button>
                    </div>
                </Modal>
            )}
            {showSubmissionModal && (
                <Modal onClose={() => setShowSubmissionModal(false)}>
                    <div className="submission-modal-content">
                        <h2>Assignments</h2>
                        {assignments.map((assignment, index) => (
                            <div key={index} className="assignment-item">
                                {/* Render assignment details */}
                                <p>{assignment.studentUsername}</p>
                                <p>{assignment.submissionLink}</p>
                                <p>{formatSubmissionTime(assignment.submissionTime)}</p>
                                {/* Add more assignment details as needed */}
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default Detailpost;

