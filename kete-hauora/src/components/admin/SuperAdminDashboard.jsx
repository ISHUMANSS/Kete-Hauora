import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import './Dashboard.css';
import supabase from '../../config/supabaseClient';

const SuperAdminDashboard = () => {

  //check the user is allowed to be there
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  // Get current user role
  useEffect(() => {
    async function fetchUserAndRole() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (!profileError && profileData) {
        setRoleId(profileData.role_id);
      }
      setLoading(false);
    }

    fetchUserAndRole();
  }, []);

  if (loading) return <p>Loading...</p>;
  
  if (roleId !== 1) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <p>You must be a super admin to access this page.</p>
          <Link to="/">Go to homepage</Link>
        </div>
      </>
    );
  }


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
            <p>View, and assign Organisations.</p>
          </Link>

          <Link to="/manageCategories" className='dashboard-card'>
            <h2>Manage Categories</h2>
            <p>Create, edit, and assign Categories to services.</p>
          </Link>

          <Link to="/managelanguages" className='dashboard-card'>
            <h2>Manage Languages</h2>
            <p>Create, edit, and assign Languages to services.</p>
          </Link>

          <Link to="/manageregions" className='dashboard-card'>
            <h2>Manage Regions</h2>
            <p>Create, edit, and assign Regions to services.</p>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
