import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';
import { useAuth } from '../../hooks/useAuth';

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