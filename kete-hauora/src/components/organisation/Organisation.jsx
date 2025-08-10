import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import './Organisation.css';
import Navbar from '../navbar/navbar';
import { useTranslation } from 'react-i18next';

function Organisation() {
    const { t } = useTranslation();

    const { companyName } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('company_name', companyName)
            .single();

        if (error) {
            console.error('Error fetching service:', error);
        } else {
            setService(data);
        }
        setLoading(false);
        };

        fetchService();
    }, [companyName]);

    if (loading) return <p>{t("Loading organisation...")}</p>;
    if (!service) return <p>{t("Organisation not found")}.</p>;

    return (
        <div className="organisation-page">
            <Navbar />
            {/*for if we want to add that sidebar of like related links that we have in the figma
            <aside className="sidebar">
                
            </aside>
            */}

            <Link to="/" className="back-button">
                ← {t("Back to Home")}
            </Link>

            <main className="organisation-content">
                <header className="organisation-header">
                {/*im not sure if we will have all the organisation images so currently just using a default one*/}
                <img src="http://www.gravatar.com/avatar/?d=mp" alt={`${service.company_name} logo`} className="organisation-logo" />
                
                <h1>{service.company_name}</h1>
                <span className="category">Category</span>{/*we will need to add a catagory tag to the database*/}
                </header>

                <section className="organisation-details">
                    <div className="contact-info">
                        <p><strong>{t("Phone")}:</strong> {service.phone || 'N/A'}</p>
                        <p><strong>{("Email")}:</strong> {service.email || 'N/A'}</p>
                        
                        {/*makes the links clickable 
                        has some issues with the links being incorrect or there being more then one link per link???
                        some of the links also just don't work*/}
                        <p><strong>{t("Website")}:</strong> <a href={service.website} target="_blank" rel="noreferrer">{service.website}</a></p>

                        <p><strong>{t("Physical Address")}:</strong> {service.physical_address}</p>
                        <p><strong>{t("Languages")}:</strong> {service.languages}</p>
                    </div>
                    <div className="extra-info">
                        <p><strong>{t("Operating Hours")}:</strong> {service.hours}</p>
                        <p><strong>{t("Cost")}:</strong> {service.cost}</p>
                        <p><strong>{t("Referral")}:</strong> {service.referral}</p>
                        <p><strong>{t("Other Notes")}:</strong> {service.other_notes}</p>
                    </div>
                </section>

                <section className="services-offered">
                    <h2>{t("Services Offered")}:</h2>
                    <div className="services-list">
                        {service.services_offered
                        ? service.services_offered.split('\n').map((item, idx) => (
                            <p key={idx}>• {item.trim()}</p>
                            ))
                        : <p>{t("No services listed")}.</p>}
                    </div>
                </section>
            </main>
            </div>
    );
}

export default Organisation;
