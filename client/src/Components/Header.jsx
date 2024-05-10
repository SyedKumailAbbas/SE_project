import '../pages/CSS/Header.css';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {

    return (
        <div className='navbar bg-gray-900 shadow-md flex justify-between items-center px-4 py-3'>
            <div className='flex items-center'>
                <Link to='/Dashboard' className='logo-link text-lg font-semibold text-white hover:text-gray-300'>
                    <span className='bg-gradient-to-l from-purple-400 via-pink-500 to-red-500 rounded-lg px-2 py-1 mr-2'>
                        FAST
                    </span>
                    LMS
                </Link>
            </div>
            <div className='flex items-center'>
                <Link to='/Dashboard' className='navbar-link text-white hover:text-gray-300 mx-4'>Home</Link>
                <Link to="/logout" className="logout-button">Logout</Link>
            </div>
        </div>
    );
};

export default Header;
