import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
import Navbar from '../navbar/navbar';

function AboutPage() {
  return (
    <div className="about">
      <Navbar />
      
      <div className="about-content">
        <h1>WELCOME</h1>
        {/* Add more content here as needed */}
      </div>
    </div>
  );
}

export default AboutPage;