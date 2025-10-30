import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import './Dashboard.css';
import supabase from '../../config/supabaseClient';

const ProviderDashboard = () => {

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
  
  if (roleId !== 2) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <p>You must be a service provider to access this page.</p>
          <Link to="/">Go to homepage</Link>
        </div>
      </>
    );
  }
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
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
