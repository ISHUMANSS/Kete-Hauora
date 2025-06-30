import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabaseClient'
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function EditOrganisationForm() {

    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { companyName } = useParams();

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

        //categories: '',
        //keywords: '',
    });

    useEffect(() => {
        const fetchOrg = async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('company_name', companyName)
                .single();

            if (error) {
                console.error('Fetch error:', error.message);
            } else {
                setOrgData(data);
            }
        };

        fetchOrg();
    }, [companyName]);

    
    if (loading) return <p>Loading...</p>;

    if (user.role !== 'admin') {
        return (
            <>
                <p>You must be logged in with the right permissions to add an organisation.</p>
                <Link to="/login">Go to login</Link><br />
                <Link to="/">Go to homepage</Link>
            </>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrgData({ ...orgData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('services')
            .update(orgData)
            .eq('company_name', companyName)
            .select(); //temp

        console.log('Update response:', data);

        if (error) {
            console.error('Update failed:', error.message);
        } else if (data.length === 0) {
            alert('Organisation not found!'); //temp
        } else {
            alert('Organisation updated!');
            navigate('/');
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/">LOGO</Link>
                <ul className="nav-links">
                    <li><Link to="/about">About</Link></li>
                    <li>
                        <span className="login-icon material-symbols-outlined">person</span>
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
            </nav>

            

            <br /><br /><br /><br />

            <h1>Edit organisation: {orgData.company_name} </h1>
            <form onSubmit={handleUpdate}>
                <input name="company_name" value={orgData.company_name} onChange={handleChange} placeholder="Organisation Name" />
                <input name="phone" value={orgData.phone} onChange={handleChange} placeholder="Phone" />
                <input name="email" value={orgData.email} onChange={handleChange} placeholder="Email" />
                <input name="website" value={orgData.website} onChange={handleChange} placeholder="Website" />
                <input name="physical_address" value={orgData.physical_address} onChange={handleChange} placeholder="Physical Address" />
                <input name="hours" value={orgData.hours} onChange={handleChange} placeholder="Operating Hours" />
                <input name="sites" value={orgData.sites} onChange={handleChange} placeholder="Sites of Service" />
                <input name="languages" value={orgData.languages} onChange={handleChange} placeholder="Languages" />
                <input name="cost" value={orgData.cost} onChange={handleChange} placeholder="Cost" />
                <textarea name="services_offered" value={orgData.services_offered} onChange={handleChange} placeholder="Services Offered" rows="8" />
                <input name="referral" value={orgData.referral} onChange={handleChange} placeholder="Referral Info" />
                <input name="other_notes" value={orgData.other_notes} onChange={handleChange} placeholder="Other Notes" />
                <button type="submit">Save Changes</button>
            </form>
        </>
    );
}

export default EditOrganisationForm;
