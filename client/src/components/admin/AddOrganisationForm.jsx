import { useState } from 'react'
import { supabase } from '../../config/supabaseClient'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AddOrganisationForm() {
    const { user, loading } = useAuth();
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

        //categories: '',
        //keywords: '',
    })


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


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setOrgData({ ...orgData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

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

                //categories: orgData.categories,
                //keywords: orgData.keywords,
            },
        ])

        if (error) {
            console.error('Insert failed:', error.message)
        } else {
            alert('Organisation created!')
            navigate('/admin')
        }
    }

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
            

            <br />
            <br />
            <br />
            <br />

            <h1>Add organisation:</h1>

            <form onSubmit={handleSubmit}>
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
                <input name="other_notes" placeholder="Other Notes" onChange={handleInputChange} />

                {/*<input name="categories" placeholder="Categories" onChange={handleInputChange} />
                <input name="keywords" placeholder="Keywords" onChange={handleInputChange} />*/}

                <button type="submit">Create</button>
            </form>
        </>
    )
}

export default AddOrganisationForm
