import React from 'react';
import '../pages/CSS/Modal.css'; // Import CSS file for styling the modal

const Modal = ({ children, onClose }) => {
  const handleModalClick = (e) => {
    // Prevent closing the modal when clicking inside it
    e.stopPropagation();
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCloseButtonClick}>
      <div className="modal" onClick={handleModalClick}>
        <button className="close-button" onClick={handleCloseButtonClick}>Close</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
