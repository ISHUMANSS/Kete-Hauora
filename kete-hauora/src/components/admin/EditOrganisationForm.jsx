/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./EditOrganisationForm.css";
import { toast } from "react-toastify";

function EditOrganisationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgData, setOrgData] = useState({
    company_name: "",
    phone: "",
    email: "",
    website: "",
    physical_address: "",
    hours: "",
    sites: "",
    languages: "",
    cost: "",
    services_offered: "",
    referral: "",
    other_notes: "",
  });

  const fieldDescriptions = {
    company_name: "The official name of the organisation or service provider.",
    phone: "Include full phone number with area code (e.g., 09 123 4567).",
    email: "Enter the primary contact email for this organisation.",
    website: "Include the full website link (e.g., https://www.example.com).",
    physical_address: "Full physical address of the organisation.",
    hours: "Provide opening hours (e.g., Mon–Fri 9am–5pm, Sat 10am–2pm).",
    sites: "Describe all locations where the service is offered. Multiple lines are allowed (e.g., offices, client homes, community centres).",
    languages: "List all available languages separated by commas.",
    cost: "Enter cost as a range or note (e.g., Free, $10–$30 per session).",
    services_offered: "Enter each service on a new line — each line becomes a bullet point on the service page.",
    referral: "State whether clients can self-refer or if a referral is required.",
    other_notes: "Add any additional details about the organisation.",
    cost_tf: "Used for filtering services by type — select whether the service is Free, Paid, or Other."
  };

  // Get user role
  useEffect(() => {
    async function getUserRole() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return setLoading(false);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (!profileError && profileData) setRoleId(profileData.role_id);
      setLoading(false);
    }
    getUserRole();
  }, []);

  // Fetch organisations
  useEffect(() => {
    async function fetchOrgs() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      if (roleId === 1) {
        // Super admin all access
        const { data: orgs, error: orgError } = await supabase
          .from("services")
          .select("*");
        if (!orgError) setResults(orgs);
      } else if (roleId === 2) {
        // Service provider only sees assigned org
        const { data: assigned, error: assignError } = await supabase
          .from("user_organisation")
          .select("organisation_id")
          .eq("user_id", user.id);

        if (!assignError && assigned.length > 0) {
          const orgIds = assigned.map((a) => a.organisation_id);
          const { data: orgs, error: orgError } = await supabase
            .from("services")
            .select("*")
            .in("service_id", orgIds);
          if (!orgError && orgs.length > 0) {
            setSelectedOrg(orgs[0]);
            setOrgData({
              company_name: orgs[0].company_name || "",
              phone: orgs[0].phone || "",
              email: orgs[0].email || "",
              website: orgs[0].website || "",
              physical_address: orgs[0].physical_address || "",
              hours: orgs[0].hours || "",
              sites: orgs[0].sites || "",
              languages: orgs[0].languages || "",
              cost: orgs[0].cost || "",
              services_offered: orgs[0].services_offered || "",
              referral: orgs[0].referral || "",
              other_notes: orgs[0].other_notes || "",
            });
          }
        }
      }
    }
    if (roleId) fetchOrgs();
  }, [roleId]);

  if (loading) return <p>Loading...</p>;
  if (![1, 2].includes(roleId)) {
    return (
      <>
        <p>You must be an admin to edit an organisation.</p>
        <Link to="/">Go to homepage</Link>
      </>
    );
  }

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  // Select organisation (super admin)
  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
    setOrgData({
      company_name: org.company_name || "",
      phone: org.phone || "",
      email: org.email || "",
      website: org.website || "",
      physical_address: org.physical_address || "",
      hours: org.hours || "",
      sites: org.sites || "",
      languages: org.languages || "",
      cost: org.cost || "",
      cost_tf: org.cost_tf ?? null,
      services_offered: org.services_offered || "",
      referral: org.referral || "",
      other_notes: org.other_notes || "",
    });
    // Keep searchInput visible, but clear the search text
    setSearchInput("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrg) return toast.warn("No organisation selected.");

    const { error } = await supabase
      .from("services")
      .update(orgData)
      .eq("service_id", selectedOrg.service_id);

    if (error) toast.error("Update failed: " + error.message);
    else toast.success("Organisation updated!");
    
  };

  const handleClearSelection = () => {
    setSelectedOrg(null);
    setOrgData({
      company_name: "",
      phone: "",
      email: "",
      website: "",
      physical_address: "",
      hours: "",
      sites: "",
      languages: "",
      cost: "",
      services_offered: "",
      referral: "",
      other_notes: "",
    });
  };

  return (
    <>
      <div className="edit-org-page">
        <div className="edit-org-card">
          <button className="edit-org-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="edit-org-title">Edit Organisation</h1>
          <p className="edit-org-subtitle">Update organisation details below</p>

          {/* Super admin search stays visible */}
          {roleId === 1 && (
            <div className="edit-org-search">
              <input
                type="text"
                placeholder="Search organisation..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {results.length > 0 && searchInput && (
                <ul>
                  {results
                    .filter((org) =>
                      org.company_name
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                    )
                    .map((org) => (
                      <li
                        key={org.service_id}
                        onClick={() => handleSelectOrg(org)}
                      >
                        {org.company_name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}

          {/* Selected organisation form */}
          {selectedOrg && (
            <form className="edit-org-form" onSubmit={handleUpdate}>
              <div className="edit-org-fields">
                {[
                  { label: "Organisation Name", name: "company_name" },
                  { label: "Phone", name: "phone" },
                  { label: "Email", name: "email" },
                  { label: "Website", name: "website" },
                  { label: "Physical Address", name: "physical_address" },
                  { label: "Hours", name: "hours" },
                  { label: "Sites", name: "sites", textarea: true },
                  { label: "Languages", name: "languages" },
                  { label: "Cost", name: "cost" },
                  { label: "Referral", name: "referral" },
                ].map((field) => (
                  <div className="form-group" key={field.name}>
                    <label>{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        className="form-textarea"
                        name={field.name}
                        value={orgData[field.name]}
                        onChange={handleChange}
                        rows={field.name === "sites" ? 3 : 2}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        className="form-input"
                        name={field.name}
                        value={orgData[field.name]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {fieldDescriptions[field.name] && (
                      <p className="field-description">{fieldDescriptions[field.name]}</p>
                    )}
                  </div>
                ))}


                <div className="form-group">
                  <label>Services Offered</label>
                  <textarea
                    className="form-textarea"
                    name="services_offered"
                    value={orgData.services_offered}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter services offered"
                  />
                  <p className="field-description">{fieldDescriptions.services_offered}</p>
                </div>

                <div className="form-group">
                  <label>Other Notes</label>
                  <textarea
                    className="form-textarea"
                    name="other_notes"
                    value={orgData.other_notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter any other notes"
                  />
                  <p className="field-description">{fieldDescriptions.other_notes}</p>
                </div>
              </div>
              <div className="form-group">
                <label>Cost Type</label>
                <select
                  className="form-textarea"
                  name="cost_tf"
                  value={
                    orgData.cost_tf === true
                      ? "TRUE"
                      : orgData.cost_tf === false
                      ? "FALSE"
                      : "NULL"
                  }
                  onChange={(e) => {
                    let value = null;
                    if (e.target.value === "TRUE") value = true;
                    else if (e.target.value === "FALSE") value = false;
                    else value = null;
                    setOrgData({ ...orgData, cost_tf: value });
                  }}
                >
                  <option value="NULL">Other</option>
                  <option value="FALSE">Free</option>
                  <option value="TRUE">Paid</option>
                </select>
                <p className="field-description">{fieldDescriptions.cost_tf}</p>
              </div>

              <button className="edit-org-submit" type="submit">
                Save Changes
              </button>
              {roleId === 1 && (
                <button
                  className="edit-org-clear"
                  type="button"
                  onClick={handleClearSelection}
                >
                  Clear Selection
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default EditOrganisationForm;
