import React, { useState } from 'react';
import axios from 'axios';

const CreateClassForm = ({ tname }) => {
  // State to manage form fields
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // State to manage visibility of the popup
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine form data with teacher name
      const requestData = {
        ...formData,
        teacher: tname
      };

      // Send formData to backend API for class creation
      const response = await axios.post('http://localhost:3000/class/create', requestData);
      console.log('Class created:', response.data);
      
      // Reset form fields after submission
      setFormData({
        title: '',
        description: ''
      });

      // Show the popup
      setShowPopup(true);

      // Hide the popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (error) {
      console.error('Error creating class:', error);
      // Handle error gracefully
    }
  };

  return (
    <div className="p-8 bg-white shadow-md rounded-lg relative">
      <h2 className="text-2xl mb-4">{tname} Create a New Class </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-semibold">Class Name:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-semibold">Class Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="input input-bordered w-full"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300 ease-in-out">Create Class</button>
      </form>
      {showPopup && (
        <div className="absolute top-0 right-0 m-4 bg-green-500 text-white p-2 rounded-lg">
          Class created successfully!
        </div>
      )}
    </div>
  );
};

export default CreateClassForm;
