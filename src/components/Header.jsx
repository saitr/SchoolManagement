import React from 'react';
import axiosInstance from '../API'; 

function Header() {
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token'); 

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      await axiosInstance.post('/logout/', { refresh: refreshToken });

    //   localStorage.removeItem('refresh_token');
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('role');
    // localStorage.removeItem('teacher_id');
    // localStorage.removeItem('first_name')
    // localStorage.removeItem('email')
    // localStorage.removeItem('first_name')
    localStorage.clear()

      window.location.href = '/login';  
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="header">
      <nav className="navbar container">
        {/* Logo */}
        <div className="logo">
          <a href="/">SchoolManagement</a>
        </div>

        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          {/* <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li> */}
          {/* <li><a href="/contact">Contact</a></li> */}
          <li><a href="/login" onClick={handleLogout}>Logout</a></li>
        </ul>

        <div className="mobile-menu">
          <input type="checkbox" id="menu-toggle" />
          <label htmlFor="menu-toggle" className="menu-icon">
            <span className="navicon"></span>
          </label>
        </div>
      </nav>

      <div className="mobile-nav">
        <ul className="mobile-nav-links">
          <li><a href="/">Home</a></li>
          {/* <li><a href="/about">About</a></li> */}
          
        </ul>
      </div>
    </header>
  );
}

export default Header;
