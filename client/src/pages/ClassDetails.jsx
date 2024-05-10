import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../pages/CSS/ClassDetails.css'; // Import CSS file for styling
import Header from '../Components/Header';

const ClassDetails = () => {
  const [classData, setClassData] = useState(null);
  const { classId, username } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/class/classes/classid/${classId}`);
        console.log('API Response:', response.data);
        setClassData(response.data);
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    };

    fetchData();
  }, [classId]);

  return (
    <>
    <Header/>
    <div className="class-details-container"> {/* Add a class name for styling */}
      <h1 className="class-details-title">Class Detail</h1> {/* Add a class name for styling */}
      {classData ? (
        <div className="class-details">
          <p><strong>Title:</strong> {classData.title}</p>
          <p><strong>Description:</strong> {classData.description}</p>
          <p><strong>Class Code:</strong> {classData.classCode}</p>
          <p><strong>Class Teacher:</strong> {classData.teacher}</p>
          {username === classData.teacher && (
            <div className="teacher-content">
              <input
                type="text"
                placeholder="Add content..."
                className="teacher-input"
              />
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>

    </>
  );
};

export default ClassDetails;
