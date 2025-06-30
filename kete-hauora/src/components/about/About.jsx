import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about">
      <nav className="navbar">
        <Link to="/">LOGO</Link>
        <ul className="nav-links">
          <li><Link to="/about">About</Link></li>
          <li>
            <span className="login-icon material-symbols-outlined">person</span>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      
      <div className="about-content">
        <h1>WELCOME</h1>
        {/* Add more content here as needed */}
      </div>
    </div>
  );
}

export default AboutPage;