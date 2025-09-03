import React, { useEffect, useState } from "react";
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Navbar from "../navbar/navbar";

function ManageAccounts() {
  const navigate = useNavigate(); // for back button
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [users, setUsers] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ email: '', role_id: 2, organisation_name: '' });
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    async function getUserRole() {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { setLoading(false); return; }
      setUser(user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single();

<<<<<<< HEAD
      if (profileData) setRoleId(profileData.role_id);
      setLoading(false);
    }
    getUserRole();
  }, []);
=======

    //JUST COMMETED OUT RIGHT NOW SO WE CAN SEE THE ADMIN DATA CASUE LOGIN IS BROKEN

    if (user.role !== 'admin') {
        return (
            <>
            <p>You must be logged in with the right permissions to manage accounts.</p>
            <Link to="/login">Go to login</Link><br />
            <Link to="Go Home"></Link>
            </>
        );
    }
 
>>>>>>> dc582d4edab3eb3f2982489408bcb11705045584

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      setFetchError('Could not fetch users');
      setUsers([]);
    } else {
      setUsers(data);
      setFetchError(null);
    }
  };

  useEffect(() => {
    if (roleId === 1) fetchUsers();
  }, [roleId]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please login to manage accounts</p>;
  if (roleId !== 1) return <p>You must be an admin to manage accounts</p>;

  const handleEditClick = (u) => {
    setEditingUserId(u.id);
    setEditData({ email: u.email, role_id: u.role_id, organisation_name: u.organisation_name || '' });
  };

  const handleSave = async (id) => {
    const { error } = await supabase.from('profiles').update(editData).eq('id', id);
    if (error) alert('Update failed: ' + error.message);
    else { alert('User updated!'); setEditingUserId(null); fetchUsers(); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) alert('Delete failed: ' + error.message);
    else { alert('User deleted!'); fetchUsers(); }
  };

  const handleResetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert('Reset failed: ' + error.message);
    else alert('Password reset email sent!');
  };

  return (
    <div className="manage-accounts">
      <Navbar />
      <div className="admin-content">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

        <h1>Manage Accounts</h1>

        {fetchError && <p className="error">{fetchError}</p>}

        <div className="filter">
          <label>Filter by role:</label>
          <select onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All</option>
            <option value="1">Admin</option>
            <option value="2">Company</option>
          </select>
        </div>

        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Organisation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => !roleFilter || u.role_id.toString() === roleFilter)
                .map(u => (
                <tr key={u.id}>
                  <td data-label="Email">
                    {editingUserId === u.id ? (
                      <input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />
                    ) : u.email}
                  </td>
                  <td data-label="Role">
                    {editingUserId === u.id ? (
                      <select value={editData.role_id} onChange={e => setEditData({ ...editData, role_id: Number(e.target.value) })}>
                        <option value={1}>Admin</option>
                        <option value={2}>Company</option>
                      </select>
                    ) : u.role_id === 1 ? 'Admin' : 'Company'}
                  </td>
                  <td data-label="Organisation">
                    {editingUserId === u.id ? (
                      <input value={editData.organisation_name} onChange={e => setEditData({ ...editData, organisation_name: e.target.value })} />
                    ) : u.organisation_name || '—'}
                  </td>
                  <td data-label="Actions" className="action-buttons">
                    {editingUserId === u.id ? (
                      <>
                        <button className="edit" onClick={() => handleSave(u.id)}>Save</button>
                        <button className="delete" onClick={() => setEditingUserId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit" onClick={() => handleEditClick(u)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(u.id)}>Delete</button>
                        <button className="reset" onClick={() => handleResetPassword(u.email)}>Reset</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageAccounts;
