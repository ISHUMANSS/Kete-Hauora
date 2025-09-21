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
        <p className="dashboard-subtitle">Manage your organisation and view service analytics.</p>

        <div className="dashboard-grid">
          <Link to="/editOrg" className='dashboard-card'>
            <h2>Edit My Organisation</h2>
            <p>Update your service details and contact info.</p>
          </Link>

          <Link to="/viewFeedback" className='dashboard-card'>
            <h2>View Feedback</h2>
            <p>See user reviews and service ratings.</p>
          </Link>

          <Link to="/serviceAnalytics" className='dashboard-card'>
            <h2>Analytics</h2>
            <p>Track your service performance and engagement.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
