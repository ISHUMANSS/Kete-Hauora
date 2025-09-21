import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import './Dashboard.css';

const SuperAdminDashboard = () => {
  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Super Admin Dashboard</h1>
        <p className="dashboard-subtitle">Full access to manage organisations, users, roles, and categories.</p>

        <div className="dashboard-grid">
          <Link to="/addOrg" className='dashboard-card'>
            <h2>Add Organisation</h2>
            <p>Add new organisations to the system.</p>
          </Link>

          <Link to="/editOrg" className='dashboard-card'>
            <h2>Edit Organisation</h2>
            <p>Edit or remove existing organisation details.</p>
          </Link>

          <Link to="/manageAccounts" className='dashboard-card'>
            <h2>Manage Accounts</h2>
            <p>View, promote, demote, or suspend users.</p>
          </Link>

          <Link to="/manageCategories" className='dashboard-card'>
            <h2>Manage Categories</h2>
            <p>Create, edit, and assign categories to services.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
