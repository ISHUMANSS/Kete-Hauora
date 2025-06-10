import { useState } from 'react'
import { supabase } from '../../config/supabaseClient'
import { Link } from 'react-router-dom';

function AddOrganisationForm() {
    const [orgData, setOrgData] = useState({
        name: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        hours: '',
        sites: '',
        languages: '',
        cost: '',
        services: '',
        referral: '',
        notes: '',

        //categories: '',
        //keywords: '',
    })

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
                physical_address: orgData.address,
                hours: orgData.hours,
                sites: orgData.sites,
                languages: orgData.languages,
                cost: orgData.cost,
                services_offered: orgData.services,
                referral: orgData.referral,
                other_notes: orgData.notes,

                //categories: orgData.categories,
                //keywords: orgData.keywords,
            },
        ])

        if (error) {
            console.error('Insert failed:', error.message)
        } else {
            alert('Organisation created!')
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
                <input name="services" placeholder="Services Offered" onChange={handleInputChange} />
                <input name="referral" placeholder="Referral" onChange={handleInputChange} />
                <input name="notes" placeholder="Other Notes" onChange={handleInputChange} />

                {/*<input name="categories" placeholder="Categories" onChange={handleInputChange} />
                <input name="keywords" placeholder="Keywords" onChange={handleInputChange} />*/}

                <button type="submit">Create</button>
            </form>
        </>
    )
}

export default AddOrganisationForm
