/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';

function EditOrganisationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgData, setOrgData] = useState({
    company_name: '',
    phone: '',
    email: '',
    website: '',
    physical_address: '',
    hours: '',
    sites: '',
    languages: '',
    cost: '',
    services_offered: '',
    referral: '',
    other_notes: '',
  });

  // Get user role
  useEffect(() => {
    async function getUserRole() {
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
    getUserRole();
  }, []);

  // Fetch organisations
  useEffect(() => {
    async function fetchOrgs() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return;

      if (roleId === 1) {
        // Super admin all access
        const { data: orgs, error: orgError } = await supabase
          .from('services')
          .select('*');
        if (!orgError) setResults(orgs);
      } else if (roleId === 2) {
        // Service provider only sees assigned org
        const { data: assigned, error: assignError } = await supabase
          .from('user_organisation')
          .select('organisation_id')
          .eq('user_id', user.id);

        if (!assignError && assigned.length > 0) {
          const orgIds = assigned.map(a => a.organisation_id);
          const { data: orgs, error: orgError } = await supabase
            .from('services')
            .select('*')
            .in('service_id', orgIds);
          if (!orgError && orgs.length > 0) {
            setSelectedOrg(orgs[0]);
            setOrgData({
              company_name: orgs[0].company_name || '',
              phone: orgs[0].phone || '',
              email: orgs[0].email || '',
              website: orgs[0].website || '',
              physical_address: orgs[0].physical_address || '',
              hours: orgs[0].hours || '',
              sites: orgs[0].sites || '',
              languages: orgs[0].languages || '',
              cost: orgs[0].cost || '',
              services_offered: orgs[0].services_offered || '',
              referral: orgs[0].referral || '',
              other_notes: orgs[0].other_notes || '',
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
      company_name: org.company_name || '',
      phone: org.phone || '',
      email: org.email || '',
      website: org.website || '',
      physical_address: org.physical_address || '',
      hours: org.hours || '',
      sites: org.sites || '',
      languages: org.languages || '',
      cost: org.cost || '',
      cost_tf: org.cost_tf ?? null,
      services_offered: org.services_offered || '',
      referral: org.referral || '',
      other_notes: org.other_notes || '',
    });
    // Keep searchInput visible, but clear the search text
    setSearchInput('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrg) return alert('No organisation selected.');

    const { error } = await supabase
      .from('services')
      .update(orgData)
      .eq('service_id', selectedOrg.service_id);

    if (error) alert('Update failed: ' + error.message);
    else alert('Organisation updated!');
  };

  const handleClearSelection = () => {
    setSelectedOrg(null);
    setOrgData({
      company_name: '',
      phone: '',
      email: '',
      website: '',
      physical_address: '',
      hours: '',
      sites: '',
      languages: '',
      cost: '',
      services_offered: '',
      referral: '',
      other_notes: '',
    });
  };

  // Styles
  const pageStyle = { display: 'flex', justifyContent: 'center', padding: '2rem', background: '#f5f7fa', minHeight: '100vh' };
  const cardStyle = { background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px' };
  const titleStyle = { textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' };
  const formGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' };
  const formGroup = { display: 'flex', flexDirection: 'column' };
  const inputStyle = { padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' };
  const buttonStyle = { marginTop: '1.5rem', padding: '12px', width: '100%', background: '#2563eb', color: 'white', fontWeight: '600', border: 'none', borderRadius: '6px', cursor: 'pointer' };
  const backButtonStyle = { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' };
  const resultStyle = { listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '6px', marginTop: '0.5rem', background: '#fff' };
  const resultItem = { padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <div style={cardStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>← Back</button>
          <h1 style={titleStyle}>Edit Organisation</h1>

          {/* Super admin search stays visible */}
          {roleId === 1 && (
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Search organisation..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ ...inputStyle, width: '100%' }}
              />
              {results.length > 0 && searchInput && (
                <ul style={resultStyle}>
                  {results
                    .filter(org => org.company_name.toLowerCase().includes(searchInput.toLowerCase()))
                    .map(org => (
                      <li key={org.service_id} onClick={() => handleSelectOrg(org)} style={resultItem}>
                        {org.company_name}
                      </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Selected organisation form */}
          {selectedOrg && (
            <form onSubmit={handleUpdate} style={{ marginTop: '2rem' }}>
              <div style={formGrid}>
                {[
                  { label: 'Organisation Name', name: 'company_name' },
                  { label: 'Phone', name: 'phone' },
                  { label: 'Email', name: 'email' },
                  { label: 'Website', name: 'website' },
                  { label: 'Physical Address', name: 'physical_address' },
                  { label: 'Hours', name: 'hours' },
                  { label: 'Sites', name: 'sites' },
                  { label: 'Languages', name: 'languages' },
                  { label: 'Cost', name: 'cost' },
                  { label: 'Referral', name: 'referral' },
                ].map(field => (
                  <div style={formGroup} key={field.name}>
                    <label>{field.label}</label>
                    <input
                      name={field.name}
                      value={orgData[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      style={inputStyle}
                    />
                  </div>
                ))}

                <div style={formGroup}>
                  <label>Services Offered</label>
                  <textarea
                    name="services_offered"
                    value={orgData.services_offered}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter services offered"
                    style={inputStyle}
                  />
                </div>

                <div style={formGroup}>
                  <label>Other Notes</label>
                  <textarea
                    name="other_notes"
                    value={orgData.other_notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter any other notes"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={formGroup}>
                <label>Cost Type</label>
                <select
                  name="cost_tf"
                  value={orgData.cost_tf === true ? "TRUE" : orgData.cost_tf === false ? "FALSE" : "NULL"}
                  onChange={(e) => {
                    let value = null;
                    if (e.target.value === "TRUE") value = true;
                    else if (e.target.value === "FALSE") value = false;
                    else value = null;
                    setOrgData({ ...orgData, cost_tf: value });
                  }}
                  style={inputStyle}
                >
                  <option value="NULL">Other</option>
                  <option value="FALSE">Free</option>
                  <option value="TRUE">Paid</option>
                </select>
              </div>
              

              <button type="submit" style={buttonStyle}>
                Save Changes
              </button>

              {roleId === 1 && (
                <button
                  type="button"
                  style={{ ...buttonStyle, background: '#6b7280', marginTop: '0.5rem' }}
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