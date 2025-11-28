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
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Section collapse states
  const [adminsOpen, setAdminsOpen] = useState(true);
  const [assignedOpen, setAssignedOpen] = useState(false);
  const [unassignedOpen, setUnassignedOpen] = useState(false);

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
      .select("id, email, role_id")
      .order('email');

    if (!usersError) setUsers(allUsers || []);

    const { data: allOrgs, error: orgsError } = await supabase
      .from("services")
      .select("service_id, company_name")
      .order("company_name", { ascending: true });

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

      //remove any listing for this user when they are made admin
      if (parseInt(newRoleId) === 1) {
        const { error: deleteError } = await supabase
          .from("user_organisation")
          .delete()
          .eq("user_id", userId);

        if (deleteError) {
          console.error("Error removing organisation assignment:", deleteError);
          toast.warning("Role updated but failed to remove organisation assignment.");
        }
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
    try {
      if (!orgId || orgId === "") {
        //if no org is selected, delete the assignment
        const { error } = await supabase
          .from("user_organisation")
          .delete()
          .eq("user_id", userId);

        if (error) {
          toast.error("Failed to unassign organisation: " + error.message);
          return;
        }
        
        toast.success("Organisation unassigned!");
      } else {
        // If org is selected, upsert the assignment
        const { error } = await supabase
          .from("user_organisation")
          .upsert(
            { user_id: userId, organisation_id: parseInt(orgId) },
            { onConflict: "user_id" }
          );

        if (error) {
          toast.error("Failed to assign organisation: " + error.message);
          return;
        }
        
        toast.success("Organisation assigned!");
      }

      await fetchData(); // refresh UI
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error managing organisation assignment.");
    }
  };

  //delete a user
  //delete user will not be implemented as we can't delete from the frount end so no users can be deleted
  const handleDeleteUser = async (userId) => {
      return 0;
  }

  // Filter and categorize users
  const admins = users.filter(user => user.role_id === 1);
  const serviceProviders = users.filter(user => user.role_id === 2);
  
  const assignedProviders = serviceProviders.filter(user => assignments[user.id]);
  const unassignedProviders = serviceProviders.filter(user => !assignments[user.id]);

  // Filter unassigned providers by search term
  const filteredUnassigned = unassignedProviders.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (roleId !== 1) return <p>You do not Have access to this page</p>;

  return (
    <>
      <Navbar />
      <div className="manage-accounts-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <h1>Manage Accounts</h1>

        <p className="info-text">
          This page allows super admins to manage all user accounts. You can view each 
          user's email and role, change their role between Admin and Service Provider, 
          and assign a specific organisation to service providers. Changes are saved 
          automatically and take effect immediately. Only update accounts you are sure 
          are correct to Admins, as this gives them full control over the site.  
          <br/><br/>
          Note: Due to current limitations, service providers have a restricted dashboard. 
          They can update their services listings, manage filters assigned to their service, and delete their service.
        </p>

        {/* ADMINS SECTION */}
        <section className="accounts-section">
          <div className="section-header-clickable" onClick={() => setAdminsOpen(!adminsOpen)}>
            <h2 className="section-title">
              <span className="collapse-icon">{adminsOpen ? '▼' : '▶'}</span>
              Administrators ({admins.length})
            </h2>
          </div>
          {adminsOpen && admins.length > 0 && (
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Access Level</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
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
                    <td>
                      <span className="full-access">Full Access</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ASSIGNED SERVICE PROVIDERS SECTION */}
        <section className="accounts-section">
          <div className="section-header-clickable" onClick={() => setAssignedOpen(!assignedOpen)}>
            <h2 className="section-title">
              <span className="collapse-icon">{assignedOpen ? '▼' : '▶'}</span>
              Assigned Service Providers ({assignedProviders.length})
            </h2>
          </div>
          {assignedOpen && assignedProviders.length > 0 && (
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Assigned Organisation</th>
                </tr>
              </thead>
              <tbody>
                {assignedProviders.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role_id}
                        onChange={(e) =>
                          handleRoleChange(user.id, parseInt(e.target.value))
                        }
                      >
                        <option value={1}>Admin</option>
                        <option value={2}>Service Provider</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={assignments[user.id] || ""}
                        onChange={(e) =>
                          handleAssignOrg(user.id, e.target.value)
                        }
                      >
                        <option value="">-- Select Organisation --</option>
                        {orgs.map((org) => (
                          <option key={org.service_id} value={org.service_id}>
                            {org.company_name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* UNASSIGNED SERVICE PROVIDERS SECTION */}
        <section className="accounts-section">
          <div className="section-header" style={{ cursor: 'default' }}>
            <div className="section-header-clickable" onClick={() => setUnassignedOpen(!unassignedOpen)} style={{ flex: 1 }}>
              <h2 className="section-title">
                <span className="collapse-icon">{unassignedOpen ? '▼' : '▶'}</span>
                Unassigned Service Providers ({unassignedProviders.length})
              </h2>
            </div>
            {unassignedOpen && (
              <input
                type="text"
                className="search-input"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>
          {unassignedOpen && (
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Assign Organisation</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnassigned.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-results">
                      {searchTerm ? "No service providers found matching your search." : "No unassigned service providers."}
                    </td>
                  </tr>
                ) : (
                  filteredUnassigned.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role_id}
                          onChange={(e) =>
                            handleRoleChange(user.id, parseInt(e.target.value))
                          }
                        >
                          <option value={1}>Admin</option>
                          <option value={2}>Service Provider</option>
                        </select>
                      </td>
                      <td>
                        <select
                          value=""
                          onChange={(e) =>
                            handleAssignOrg(user.id, e.target.value)
                          }
                        >
                          <option value="">-- Select Organisation --</option>
                          {orgs.map((org) => (
                            <option key={org.service_id} value={org.service_id}>
                              {org.company_name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </>
  );
}

export default ManageAccounts;