import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';

function AddOrganisationForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to access this page.</p>;

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
      alert('Failed to add organisation: ' + error.message);
    } else {
      alert('Organisation created!');
      navigate('/admin');
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

        <h1 className="dashboard-title">Add Organisation</h1>
        <p className="dashboard-subtitle">Fill in organisation details below.</p>

        <form className="form-card" onSubmit={handleSubmit}>
          {Object.keys(orgData).map((key) => (
            <div className="form-group" key={key}>
              <label>{key.replace('_', ' ').toUpperCase()}</label>
              {key === 'services_offered' || key === 'other_notes' ? (
                <textarea
                  name={key}
                  value={orgData[key]}
                  onChange={handleInputChange}
                  rows={key === 'services_offered' ? 4 : 3}
                  placeholder={`Enter ${key.replace('_', ' ')}`}
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={orgData[key]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${key.replace('_', ' ')}`}
                />
              )}
            </div>
          ))}

          <button type="submit" className="btn-primary">Add Organisation</button>
        </form>
      </div>
    </div>
  );
}

export default AddOrganisationForm;
