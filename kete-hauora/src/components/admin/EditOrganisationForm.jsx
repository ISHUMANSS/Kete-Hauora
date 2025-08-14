/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import SearchBar from '../searchBar/searchBar';  

function EditOrganisationForm() {
  const navigate = useNavigate();

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

  // Fetch organisations matching searchInput whenever searchTrigger changes
  useEffect(() => {
    if (searchInput.trim() === '') {
      setResults([]);
      return;
    }

    async function fetchResults() {
      let { data, error } = await supabase
        .from('services')
        .select('*')
        .ilike('company_name', `%${searchInput}%`); // case-insensitive partial match

      if (error) {
        setFetchError('Could not fetch organisations');
        setResults([]);
      } else {
        setResults(data);
        setFetchError(null);
      }
    }

    fetchResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger]);

  // When you click on an organisation from results, fill form
  const handleSelectOrg = (org) => {
    setOrgData(org);
    setResults([]); // clear results
    setSearchInput(org.company_name); // show selected name in search box
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  // Update organisation in DB
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Want to ensure company_name is unique or use ID instead
    const { data, error } = await supabase
      .from('services')
      .update(orgData)
      .eq('company_name', orgData.company_name);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      alert('Organisation updated!');
      navigate('/admin');
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

    <Navbar />
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
            <li
              key={org.company_name}
              onClick={() => handleSelectOrg(org)}
            >
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
