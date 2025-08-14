import React, {useEffect, useState} from "react";
import { supabase } from '../../config/supabaseClient'
import Navbar from "../navbar/navbar";

function ManageAccounts() {
    const [users, setUsers] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase.from('profiles').select('*');
            console.log('Profiles:', data);
            if (error) {
                setFetchError('Could not fetch users');
                setUsers([]);
            } else {
                setUsers(data);
                setFetchError(null);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="manage-accounts">
      <Navbar />
      <div className="admin-content">
        <h1>Manage Accounts</h1>

        {fetchError && <p>{fetchError}</p>}

        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Organisation</th>
              </tr>
            </thead>
           <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Role">{u.role}</td>
                    <td data-label="Organisation">{u.organisation_name || '—'}</td>
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