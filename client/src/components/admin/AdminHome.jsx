import React from 'react';
import './AdminHome.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 


const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-home-container">
        <Navbar/>
        
      <h1>Welcome, Admin</h1>
      <div className="admin-actions">
        <button onClick={() => navigate('/manage-accounts')}>Manage Accounts</button>
        <button onClick={() => navigate('/create-account')}>Create Account</button>
        <button onClick={() => navigate('/manage-organisations')}>Manage Organisations</button>
      </div>
    </div>
  );
};

export default AdminHome;
