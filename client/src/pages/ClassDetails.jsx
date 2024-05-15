// Existing imports...
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../pages/CSS/ClassDetails.css';
import Header from '../Components/Header';
import Modal from '../Components/Modal';
import ReactHtmlParser from 'react-html-parser';
import Students from '../Components/Students';

const ClassDetails = () => {
  const [classData, setClassData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'announcement',
    duedate: '',
  });
  const [activeTab, setActiveTab] = useState('announcement');
  const [posts, setPosts] = useState([]);
  const { classId, username } = useParams();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/class/classes/classid/${classId}`);
        console.log('API Response:', response.data);
        setClassData(response.data);
        fetchPosts('announcement');
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };

    fetchData();
  }, [classId]);

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
    fetchPosts(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'description') {
      newValue = parseDescription(value);
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const parseDescription = (description) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return description.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { ...formData, classid: classId };
      await axios.post('http://localhost:3000/post/create', postData);
      console.log(postData);
      handleModalClose();
      setFormData({
        title: '',
        description: '',
        type: 'announcement',
        duedate: '',
      });
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
                <Students />
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
          <Link key={post._id} to={`/post/${post._id}/${username}/${classData.teacher}`}>
          <div key={post._id} className="post">
            <h3>{post.title}</h3>
            <p>{ReactHtmlParser(post.description)}</p>
            {/* Render due date if the post is an assignment */}
            {post.type === 'assignment' && (
              <p><strong>Due Date:</strong> {formatDate(post.duedate)}</p>
            )}
          </div>
              </Link>
        ))}
      </div>
    </>
  );
};

export default ClassDetails;
