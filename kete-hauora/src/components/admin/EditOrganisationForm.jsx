import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import SearchBar from '../searchBar/searchBar';

function EditOrganisationForm() {
  const navigate = useNavigate();

  // Auth states
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  // Search input state
  const [searchInput, setSearchInput] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Search results
  const [results, setResults] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Organisation data to edit
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

  // Fetch logged-in user and role
  useEffect(() => {
    async function getUserRole() {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setLoading(false);
        return;
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single();

      if (!profileError && profileData) {
        setRoleId(profileData.role_id);
      }

      setLoading(false);
    }

    getUserRole();
  }, []);

  // Fetch organisations matching search input
  useEffect(() => {
    if (searchInput.trim() === '') {
      setResults([]);
      return;
    }

    async function fetchResults() {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          company_name,
          phone,
          email,
          website,
          physical_address,
          hours,
          sites,
          languages,
          cost,
          services_offered,
          referral,
          other_notes
        `)
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

  if (roleId !== 1) {
    return (
      <>
        <p>You must be an admin to edit an organisation.</p>
        <Link to="/">Go to homepage</Link>
      </>
    );
  }

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  // When user selects an organisation from search
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
      other_notes: org.other_notes || ''
    });
    setSelectedOrgId(org.id);
    setSearchInput(org.company_name);
    setResults([]);
  };

  // Update organisation in DB
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedOrgId) {
      alert('No organisation selected.');
      return;
    }

    const updateData = {
      phone: orgData.phone,
      email: orgData.email,
      website: orgData.website,
      physical_address: orgData.physical_address,
      hours: orgData.hours,
      sites: orgData.sites,
      languages: orgData.languages,
      cost: orgData.cost,
      services_offered: orgData.services_offered,
      referral: orgData.referral,
      other_notes: orgData.other_notes
    };

    const { error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', selectedOrgId);

    if (error) {
      console.error('Error updating organisation:', error.message);
      alert('Update failed: ' + error.message);
    } else {
      alert('Organisation updated!');
      setSearchTrigger(prev => prev + 1); // refresh search results
    }
  };

  return (
    <>
      <Navbar />

      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="edit-org-container">
        <h1 className="edit-org-title">Edit Organisation</h1>

        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={() => setSearchTrigger(prev => prev + 1)}
          filters={{ category: '', cost: '' }}
          setFilters={() => {}}
        />

        {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}

        {results.length > 0 && (
          <ul className="edit-org-results">
            {results.map(org => (
              <li key={org.id} onClick={() => handleSelectOrg(org)}>
                {org.company_name}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleUpdate} className="edit-org-form">
          <input name="company_name" value={orgData.company_name} onChange={handleChange} placeholder="Organisation Name" />
          <input name="phone" value={orgData.phone} onChange={handleChange} placeholder="Phone" />
          <input name="email" value={orgData.email} onChange={handleChange} placeholder="Email" />
          <input name="website" value={orgData.website} onChange={handleChange} placeholder="Website" />
          <input name="physical_address" value={orgData.physical_address} onChange={handleChange} placeholder="Physical Address" />
          <input name="hours" value={orgData.hours} onChange={handleChange} placeholder="Operating Hours" />
          <input name="sites" value={orgData.sites} onChange={handleChange} placeholder="Sites of Service" />
          <input name="languages" value={orgData.languages} onChange={handleChange} placeholder="Languages" />
          <input name="cost" value={orgData.cost} onChange={handleChange} placeholder="Cost" />
          <textarea name="services_offered" value={orgData.services_offered} onChange={handleChange} placeholder="Services Offered" rows="5" />
          <input name="referral" value={orgData.referral} onChange={handleChange} placeholder="Referral Info" />
          <input name="other_notes" value={orgData.other_notes} onChange={handleChange} placeholder="Other Notes" />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </>
  );
}

export default EditOrganisationForm;

