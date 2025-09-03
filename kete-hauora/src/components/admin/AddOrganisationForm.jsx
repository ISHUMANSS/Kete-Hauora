/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';

function AddOrganisationForm() {
  const navigate = useNavigate();

  const [orgData, setOrgData] = useState({
    name: '',
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

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    async function getUserRole() {
      setLoading(true);

      // Get logged in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error(userError);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      // Fetch role_id from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('role_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setRoleId(data.role_id);
      }

      setLoading(false);
    }

    getUserRole();
  }, []);

  if (roleId !== 1) { // 1 = admin
    return (
      <>
        <p>You must be an admin to add an organisation.</p>
        <Link to="/">Go to homepage</Link>
      </>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('services').insert([
      {
        company_name: orgData.name,
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
        other_notes: orgData.other_notes,
      },
    ]);

    if (error) {
      console.error('Insert failed:', error.message);
      alert('Failed to add organisation.');
    } else {
      alert('Organisation created!');
      navigate('/admin');
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: '900px' }}>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="edit-org-container">
        <h1 className="edit-org-title">Add Organisation</h1>

        <form className="edit-org-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Organisation Name" onChange={handleInputChange} />
          <input name="phone" placeholder="Phone" onChange={handleInputChange} />
          <input name="email" placeholder="Email" onChange={handleInputChange} />
          <input name="website" placeholder="Website" onChange={handleInputChange} />
          <input name="physical_address" placeholder="Physical Address" onChange={handleInputChange} />
          <input name="hours" placeholder="Operating Hours" onChange={handleInputChange} />
          <input name="sites" placeholder="Sites of Service" onChange={handleInputChange} />
          <input name="languages" placeholder="Languages" onChange={handleInputChange} />
          <input name="cost" placeholder="Cost" onChange={handleInputChange} />
          <input name="services_offered" placeholder="Services Offered" onChange={handleInputChange} />
          <input name="referral" placeholder="Referral" onChange={handleInputChange} />
          <textarea
            name="other_notes"
            placeholder="Other Notes"
            onChange={handleInputChange}
            rows="3"
          ></textarea>

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
}

export default AddOrganisationForm;
