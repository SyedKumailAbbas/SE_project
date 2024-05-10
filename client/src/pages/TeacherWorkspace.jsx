import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../pages/CSS/TeacherWorkspace.css';
import CreateClassForm from './Createclass';
function TeacherWorkspace({ teachername }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classes, setClasses] = useState([]); // State to store classes
  const dialogRef = useRef(null);
  const username = teachername; // Accessing teachername directly

  // Function to fetch classes by teacher name
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/class/teacher/${username}`);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();

    return () => {
      // Cleanup function if necessary
    };
  }, []);

  // Function to open dialog
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // Function to close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  // Function to handle clicking outside dialog
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        closeDialog();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto bg-gray-100 p-8">
      <div className="workspace_first bg-gradient-to-br from-purple-700 to-pink-600 rounded-b-3xl shadow-lg p-8 mb-8">
        <h1 className="text-white text-4xl font-bold">Welcome to Your Workspace</h1>
        <p className="text-white text-lg mt-4">Get creative and organized with our intuitive workspace.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Your Classes - Left Card */}
        <div className="card bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Your Classes</h2>
          <ul>
            {/* Check if classes is an array before mapping */}
            {Array.isArray(classes) && classes.map((cls) => (
              <li className='classcard' key={cls._id}>
                <Link to={`/classes/${cls._id}/${username}`} className='classname'>{cls.title}</Link>
              </li>
            ))}
          </ul>
        </div>
         {/* Create Class - Right Card */}
        <div onClick={openDialog} className="card bg-white rounded-lg shadow-md p-8 cursor-pointer">
          <h2 className="text-2xl font-bold mb-4">Create Classes</h2>
          <p className="text-gray-600">Start by creating your classes and organizing your tasks.</p>
        </div>
      </div>
      {/* Pop-up dialog for creating classes */}
      {isDialogOpen && (
        <div className="overlay fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div ref={dialogRef} className="dialog bg-white p-8 shadow-md rounded-lg relative">
            <button onClick={closeDialog} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none">
              X
            </button>
            <CreateClassForm tname={username} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherWorkspace;
