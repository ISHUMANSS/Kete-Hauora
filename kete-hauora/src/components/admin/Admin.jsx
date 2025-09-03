import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../navbar/navbar';
import { supabase } from '../../config/supabaseClient';

function AdminPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role_id')
          .eq('id', user.id) // `id` should match the auth.user.id
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
        } else {
          setProfile(data);
        }
      }
      setChecking(false);
    };

    fetchProfile();
  }, [user]);

  if (loading || checking) return <p>Loading...</p>;

  if (!user) {
    return (
      <>
        <p>You must be logged in to view this page.</p>
        <Link to="/login">Go to login</Link><br />
        <Link to="/">Go to homepage</Link>
      </>
    );
  }

  if (!profile || profile.role_id !== 1) {
    return (
      <>
        <p>You must be logged in with the right permissions to access this page.</p>
        <Link to="/">Go to homepage</Link>
      </>
    );
  }

  return (
    <div className="about">
      <Navbar />
      <div className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="dashboard-grid">
          <Link to="/addOrg" className='dashboard-card'>
            <h2>Add Organisation</h2>
            <p>Add new organisation in the system.</p>
          </Link>

          <Link to="/editOrg" className="dashboard-card">
            <h2>Edit Organisation</h2>
            <p>Edit or remove organisation details.</p>
          </Link>

          <Link to="/manageAccounts" className="dashboard-card">
            <h2>Manage Accounts</h2>
            <p>View and control user access to organisations.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
