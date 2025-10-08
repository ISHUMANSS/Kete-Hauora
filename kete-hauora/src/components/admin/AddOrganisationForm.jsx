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
        cost_tf: orgData.cost_tf,
        services_offered: orgData.services_offered,
        referral: orgData.referral,
        other_notes: orgData.other_notes,
      },
    ]);

    if (error) {
      alert('Failed to add organisation: ' + error.message);
    } else {
      alert('Organisation created!');
      navigate('/super-admin-dashboard');
    }
  };

  // Inline styles
  const pageStyle = { display: 'flex', justifyContent: 'center', padding: '2rem', background: '#f5f7fa', minHeight: '100vh' };
  const cardStyle = { background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px' };
  const titleStyle = { textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem', color: '#1f2937' };
  const subtitleStyle = { textAlign: 'center', marginBottom: '1.5rem', color: '#4b5563' };
  const formGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' };
  const formGroup = { display: 'flex', flexDirection: 'column' };
  const inputStyle = { padding: '0.8rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem' };
  const buttonStyle = { marginTop: '1.5rem', padding: '12px', width: '100%', background: '#2563eb', color: 'white', fontWeight: '600', border: 'none', borderRadius: '6px', cursor: 'pointer' };
  const backButtonStyle = { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '1rem', marginBottom: '1rem' };

  return (
    <>
      <Navbar />
      <div style={pageStyle}>
        <div style={cardStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>← Back</button>
          <h1 style={titleStyle}>Add Organisation</h1>
          <p style={subtitleStyle}>Fill in organisation details below.</p>

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              {Object.keys(orgData).filter(key => key !== "cost_tf").map((key) => (
                <div style={formGroup} key={key}>
                <label>{key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                  {key === 'services_offered' || key === 'other_notes' ? (
                    <textarea
                      name={key}
                      value={orgData[key]}
                      onChange={handleInputChange}
                      rows={key === 'services_offered' ? 4 : 3}
                      placeholder={`Enter ${key.replace('_', ' ')}`}
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={orgData[key]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${key.replace('_', ' ')}`}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
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
            </div>
            <button type="submit" style={buttonStyle}>Add Organisation</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddOrganisationForm;