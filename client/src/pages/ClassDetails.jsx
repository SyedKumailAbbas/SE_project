import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate, NavLink } from 'react-router-dom';
import '../pages/CSS/ClassDetails.css'; // Import CSS file for styling
import Header from '../Components/Header';
import Modal from '../Components/Modal'; // Import Modal component
import '../pages/CSS/Modal.css'; // Import CSS file for styling the modal
import ReactHtmlParser from 'react-html-parser';

const ClassDetails = () => {
  const [classData, setClassData] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'announcement', // Default type
    duedate: '', // Added duedate field
  });
  const [activeTab, setActiveTab] = useState('announcement'); // State to manage active tab
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const { classId, username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/class/classes/classid/${classId}`);
        console.log('API Response:', response.data);
        setClassData(response.data);
        // Fetch posts for the default tab (announcement)
        fetchPosts('announcement');
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };

    fetchData();
  }, [classId]);

  // Function to fetch posts based on type and class ID
  const fetchPosts = async (type) => {
    try {
      const response = await axios.get(`http://localhost:3000/post/getpostbytype/${classId}/${type}`);
      setPosts(response.data);
    } catch (error) {
      console.error(`Error fetching ${type} posts:`, error);
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchPosts(tab); // Fetch posts when the tab changes
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    // If the input name is 'description', parse the HTML content to wrap URLs in <a> tags
    if (name === 'description') {
      newValue = parseDescription(value);
    }
    setFormData({ ...formData, [name]: newValue });
  };

  // Function to parse description content and wrap URLs in <a> tags
  const parseDescription = (description) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return description.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { ...formData, classid: classId }; // Include classId in the form data
      await axios.post('http://localhost:3000/post/create', postData);
      console.log(postData);
      // Optionally, you can close the modal after successful submission
      handleModalClose();
      // Reset form data
      setFormData({
        title: '',
        description: '',
        type: 'announcement',
        duedate: '',
      });
      // Refetch posts after submission to update the list
      fetchPosts(activeTab);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="class-details-container">
        {classData ? (
          <div className="class-details">
            <div>
              <h1 className="class-details-title">{classData.title}</h1>
              <p><strong></strong> {classData.description}</p>
            </div>
            <div>
              <p><strong>CODE: </strong> {classData.classcode}</p>
              <p><strong>INSTRUCTOR: </strong> {classData.teacher}</p>
            </div>

              {classData.teacher === username && (
                <div className="teacher-content">
                  <button onClick={handleModalOpen} className="add-content-button">
                    Add Content
                  </button>
                </div>
              )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {showModal && (
        <Modal onClose={handleModalClose}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="input-field"
            />
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="textarea-field"
            />
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="input-field"
            >
              <option value="announcement">Announcement</option>
              <option value="assignment">Assignment</option>
            </select>

            {formData.type === 'assignment' && (
              <div>
                <label htmlFor="duedate">Due Date:</label>
                <input
                  type="date"
                  id="duedate"
                  name="duedate"
                  value={formData.duedate}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>
            )}

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </Modal>
      )}
      <div className="class-tabs">
        <button
          className={activeTab === 'announcement' ? 'active-tab' : ''}
          onClick={() => handleTabChange('announcement')}
        >
          Announcements
        </button>
        <button
          className={activeTab === 'assignment' ? 'active-tab' : ''}
          onClick={() => handleTabChange('assignment')}
        >
          Assignments
        </button>
      </div>
      {/* Display posts based on the active tab */}
      <div className="posts">
        {posts.map((post) => (
          <Link key={post._id} to={`/post/${post._id}/${username}/${classData.teacher}`} className="post">
            <div className='post'>
              <h3>{post.title}</h3>
              <p>{ReactHtmlParser(post.description)}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ClassDetails;