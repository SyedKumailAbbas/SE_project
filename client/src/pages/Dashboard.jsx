import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import TeacherWorkspace from './TeacherWorkspace';
import Header from '../Components/Header';
import StudentWorkspace from './StudentWorkspace';
// import TeacherComponent from './TeacherComponent'; // Import your teacher-specific component

const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get("http://localhost:3000/api/v1/dashboard", axiosConfig);
      setData({ msg: response.data.name, role: response.data.role });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <div className='dashboard-main'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <React.Fragment>
          {data.role === 'teacher' ? (
            <React.Fragment>
              <Header />
              <TeacherWorkspace teachername={data.msg} />
            </React.Fragment>
          ) : (
            <React.Fragment>
              {/* Student-specific content */}
              <Header />
              <StudentWorkspace studentname={data.msg}/>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default Dashboard;
