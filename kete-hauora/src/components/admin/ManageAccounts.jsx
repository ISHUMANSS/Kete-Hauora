/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import Navbar from '../navbar/navbar';
import { useNavigate } from 'react-router-dom';

function ManageAccounts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [assignments, setAssignments] = useState({});

  // Get current user role
  useEffect(() => {
    async function fetchRole() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return setLoading(false);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData) setRoleId(profileData.role_id);
      setLoading(false);
    }
    fetchRole();
  }, []);

  // Fetch all users, organisations, and assignments
  useEffect(() => {
    if (roleId !== 1) return; // Only for super admin

    async function fetchData() {
      // Fetch all user profiles
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, role_id');

      if (usersError) console.log(usersError);
      else setUsers(allUsers || []);

      // Fetch all organisations
      const { data: allOrgs, error: orgsError } = await supabase
        .from('services')
        .select('service_id, company_name');

      if (orgsError) console.log(orgsError);
      else setOrgs(allOrgs || []);

      // Fetch current user-organisation assignments
      const { data: assignmentsData } = await supabase
        .from('user_organisation')
        .select('user_id, organisation_id');

      const map = {};
      assignmentsData?.forEach(a => {
        map[a.user_id] = a.organisation_id;
      });
      setAssignments(map);
    }

    fetchData();
  }, [roleId]);

  if (loading) return <p>Loading...</p>;
  if (roleId !== 1) return <p>Only super admins can access this page.</p>;

  // Assign organisation to a user
  const handleAssignOrg = async (userId, orgId) => {
    const { error } = await supabase
      .from('user_organisation')
      .upsert({ user_id: userId, organisation_id: orgId }, { onConflict: ['user_id'] });

    if (error) alert('Failed to assign organisation: ' + error.message);
    else {
      setAssignments(prev => ({ ...prev, [userId]: orgId }));
      alert('Organisation assigned!');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', cursor: 'pointer' }}>
          ← Back
        </button>

        <h1>Manage Accounts</h1>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Assigned Organisation</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {user.role_id === 1 ? 'Admin' : 'Service Provider'}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {user.role_id === 1 ? (
                    <span style={{ color: '#888' }}>Full Access</span>
                  ) : (
                    <select
                      value={assignments[user.id] || ''}
                      onChange={e => handleAssignOrg(user.id, parseInt(e.target.value))}
                    >
                      <option value="">-- Select Organisation --</option>
                      {orgs.map(org => (
                        <option key={org.service_id} value={org.service_id}>
                          {org.company_name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageAccounts;