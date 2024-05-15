import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Components/Modal';
import { useParams } from 'react-router-dom';
import './CSS/Students.css'
const Students = () => {
    const [students, setStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { classId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/class/students/${classId}`);
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleModalOpen = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const removeStd = async (studentName) => {
        try {
            const response = await axios.delete(`http://localhost:3000/class/delstudent/${classId}/${studentName}`)
            setStudents(response.data);
        } catch (error) {
            console.error('Error in removing student ', error);
        }
    };

    return (
        <>
            <button onClick={handleModalOpen} className="showstd-btn
showstd-btn">
                Show Students
            </button>
            {showModal && (
                <Modal onClose={handleModalClose}>
                    <h2>Enrolled students</h2>
                    {students.length > 0 ? (
                        <div>
                            {/* Render fetched data here */}
                            {students.map((student, index) => (
                                <div className='stddiv' key={index}>
                                    <p>Name: {student}</p>
                                    {/* Button to remove student */}
                                    <button className='removebtn' onClick={() => removeStd(student)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No students enrolled</p>
                    )}
                </Modal>
            )}
        </>
    );
};

export default Students;
