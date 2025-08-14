import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';
/* import { useAuth } from '../../hooks/useAuth'; */
import Navbar from '../navbar/navbar';

function AdminPage() {

/* const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
    /*

    JUST COMMETED OUT RIGHT NOW SO WE CAN SEE THE ADMIN DATA CASUE LOGIN IS BROKEN

    if (user.role !== 'admin') {
          return (
              <>
                  <p>You must be logged in with the right permissions to add an organisation.</p>
                  <Link to="/login">Go to login</Link><br />
                  <Link to="/">Go to homepage</Link>
              </>
          );
      }
    */

  return (
    <div className="about">
      <Navbar />

      <div className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>
        {/* Add more content here as needed */}
        
      <div className="dashboard-grid">
        <Link to="/addOrg" className='dashboard-card'>
        <h2>Add Organisation</h2>
        <p>Add new organisation in the system.</p>
        </Link>

        <Link to="/editOrg" className="dashboard-card">
            <h2>Edit Organisation</h2>
            <p>Edit or remove organisation details.</p>
          </Link>

          <Link to="/manageccounts" className="dashboard-card">
            <h2>Manage Accounts</h2>
            <p>View and control user access to organisations.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
