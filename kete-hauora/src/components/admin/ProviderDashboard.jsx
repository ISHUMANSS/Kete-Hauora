import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import './Dashboard.css';

const ProviderDashboard = () => {
  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Provider Dashboard</h1>
        <p className="dashboard-subtitle">Manage your organisation.</p>

        <div className="dashboard-grid">
          <Link to="/editOrg" className='dashboard-card'>
            <h2>Edit My Organisation</h2>
            <p>Update your service details and contact info.</p>
          </Link>

          <Link to="/Example1" className='dashboard-card'>
            <h2>Other feature??</h2>
            <p></p>
          </Link>

          <Link to="/Example" className='dashboard-card'>
            <h2>Example</h2>
            <p></p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
