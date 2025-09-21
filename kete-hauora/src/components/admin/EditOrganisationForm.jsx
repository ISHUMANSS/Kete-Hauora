import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import SearchBar from '../searchBar/searchBar';

function EditOrganisationForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [results, setResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);

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

  const [selectedOrgId, setSelectedOrgId] = useState(null);

  // Fetch user role
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

  // Fetch organisations on search
  useEffect(() => {
    if (!searchInput.trim()) return setResults([]);

    async function fetchResults() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .ilike('company_name', `%${searchInput}%`);

      if (error) {
        setFetchError('Could not fetch organisations');
        setResults([]);
      } else {
        setResults(data);
        setFetchError(null);
      }
    }

    fetchResults();
  }, [searchTrigger, searchInput]);

  if (loading) return <p>Loading...</p>;
  if (![1, 2].includes(roleId)) {
    return (
      <>
        <p>You must be an admin to edit an organisation.</p>
        <Link to="/">Go to homepage</Link>
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  // Auto-fill form when organisation is selected
  const handleSelectOrg = (org) => {
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
      services_offered: org.services_offered || '',
      referral: org.referral || '',
      other_notes: org.other_notes || '',
    });
    setSelectedOrgId(org.id);
    setSearchInput(org.company_name);
    setResults([]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrgId) return alert('No organisation selected.');

    const { error } = await supabase
      .from('services')
      .update(orgData)
      .eq('id', selectedOrgId);

    if (error) alert('Update failed: ' + error.message);
    else alert('Organisation updated!');
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="dashboard-title">Edit Organisation</h1>

        {/* Search Section */}
        <div className="search-section">
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onSearch={() => setSearchTrigger(prev => prev + 1)}
            filters={{ category: '', cost: '' }}
            setFilters={() => {}}
          />
          {fetchError && <p className="error-text">{fetchError}</p>}
          {results.length > 0 && (
            <ul className="search-results">
              {results.map(org => (
                <li
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className={selectedOrgId === org.id ? 'selected' : ''}
                >
                  {org.company_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Edit Form */}
        <form className="edit-org-form" onSubmit={handleUpdate}>
          <div className="form-grid">
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
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>
                <input
                  name={field.name}
                  value={orgData[field.name]}
                  onChange={handleChange}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}

            {/* Textareas */}
            <div className="form-group textarea">
              <label>Services Offered</label>
              <textarea
                name="services_offered"
                value={orgData.services_offered}
                onChange={handleChange}
                rows={5}
                placeholder="Enter services offered"
              />
            </div>
            <div className="form-group textarea">
              <label>Other Notes</label>
              <textarea
                name="other_notes"
                value={orgData.other_notes}
                onChange={handleChange}
                rows={3}
                placeholder="Enter any other notes"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={!selectedOrgId}>
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}

export default EditOrganisationForm;
