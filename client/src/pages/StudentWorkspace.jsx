import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../pages/CSS/StudentWorkspace.css';
import JoinClassForm from './Joinclass';

function StudentWorkspace({ studentname }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const username = studentname;
  const [classes, setClasses] = useState([]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/class/classes/${username}`);
        console.log(response)
        console.log(response.data)
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();

    return () => {
      // Cleanup function if necessary
    };
  }, [username]);

  return (
    <div className="container mx-auto bg-gray-100 p-8">
      <div className="workspace_first bg-gradient-to-br from-purple-700 to-pink-600 rounded-b-3xl shadow-lg p-8 mb-8">
        <h1 className="text-white text-4xl font-bold">Welcome to Your Workspace</h1>
        <p className="text-white text-lg mt-4">Get organized and join classes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Your Classes</h2>
          <ul>
            {/* Check if classes is an array before mapping */}
            {Array.isArray(classes) && classes.map((cls) => (
              <li className='classcard' key={cls._id}>
                <Link to={`/classes/${cls._id}/${username}`}>
                  <h3 className='classname'>{cls.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div onClick={openDialog} className="card bg-white rounded-lg shadow-md p-8 cursor-pointer">
          <h2 className="text-2xl font-bold mb-4">Join Class</h2>
          <p className="text-gray-600">Enter the class code to join a class.</p>
        </div>
      </div>
      {isDialogOpen && (
        <div className="overlay fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div ref={dialogRef} className="dialog bg-white p-8 shadow-md rounded-lg relative">
            <button onClick={closeDialog} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
              X
            </button>
            <JoinClassForm username={username} onClose={closeDialog} />
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentWorkspace;
