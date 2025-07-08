import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../navbar/navbar';

function AdminPage() {

  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
    if (user.role !== 'admin') {
        return (
            <>
                <p>You must be logged in with the right permissions to add an organisation.</p>
                <Link to="/login">Go to login</Link><br />
                <Link to="/">Go to homepage</Link>
            </>
        );
    }

  return (
    <div className="about">
      <Navbar />

      <div className="about-content">
        <h1>ADMIN PAGE</h1>
        {/* Add more content here as needed */}
        <ul>
          <li><Link to="/addOrg">Add Organisation</Link></li>
          {/*<li><Link to="/EditOrg">Edit Organisation</Link></li>*/}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;