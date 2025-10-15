/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import Navbar from "../navbar/navbar";
import { useNavigate } from "react-router-dom";
import "./ManageAccounts.css";
import { toast } from "react-toastify";

function ManageAccounts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [assignments, setAssignments] = useState({});

  //get current user role
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

      setCurrentUser(user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (!profileError && profileData) setRoleId(profileData.role_id);
      setLoading(false);
    }

    fetchUserAndRole();
  }, []);

  // Fetch all users, organisations, and assignments
  useEffect(() => {
    if (roleId !== 1) return; // Only for super admin
    fetchData();
  }, [roleId]);

  // Reusable function to refresh users/orgs/assignments
  async function fetchData() {
    const { data: allUsers, error: usersError } = await supabase
      .from("profiles")
      .select("id, email, role_id");

    if (!usersError) setUsers(allUsers || []);

    const { data: allOrgs, error: orgsError } = await supabase
      .from("services")
      .select("service_id, company_name");

    if (!orgsError) setOrgs(allOrgs || []);

    const { data: assignmentsData } = await supabase
      .from("user_organisation")
      .select("user_id, organisation_id");

    const map = {};
    assignmentsData?.forEach((a) => {
      map[a.user_id] = a.organisation_id;
    });
    setAssignments(map);
  }

  //Change user role
  const handleRoleChange = async (userId, newRoleId) => {
    try {
      console.log("Updating role for:", userId, "to:", newRoleId);

      const { data, error } = await supabase
        .from("profiles")
        .update({ role_id: parseInt(newRoleId) })
        .eq("id", userId)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Failed to update role: " + error.message);
        return;
      }

      if (data.length === 0) {
        toast.error("No profile found for this user ID.");
        return;
      }

      toast.success("Role updated successfully!");
      await fetchData(); // Refresh data
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error updating role.");
    }
  };

  // Assign organisation to a user and refresh UI
  const handleAssignOrg = async (userId, orgId) => {
    const { error } = await supabase
      .from("user_organisation")
      .upsert(
        { user_id: userId, organisation_id: orgId },
        { onConflict: ["user_id"] }
      );

    if (error) {
      toast.error("Failed to assign organisation: " + error.message);
    } else {
      toast.success("Organisation assigned!");
      await fetchData(); // 🔁 Refresh data from DB
    }
  };

  if (loading) return <p>Loading...</p>;
  if (roleId !== 1) return <p>Only super admins can access this page.</p>;

  return (
    <>
      <Navbar />
      <div className="manage-accounts-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <h1>Manage Accounts</h1>

        <table className="accounts-table">
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Role</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Assigned Organisation
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {user.email}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <select
                    value={user.role_id}
                    onChange={(e) =>
                      handleRoleChange(user.id, parseInt(e.target.value))
                    }
                    disabled={user.id === currentUser?.id}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Service Provider</option>
                  </select>
                </td>

                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {user.role_id === 1 ? (
                    <span style={{ color: "#888" }}>Full Access</span>
                  ) : (
                    <select
                      value={assignments[user.id] || ""}
                      onChange={(e) =>
                        handleAssignOrg(user.id, parseInt(e.target.value))
                      }
                    >
                      <option value="">-- Select Organisation --</option>
                      {orgs.map((org) => (
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
