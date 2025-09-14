import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import './Organisation.css';
import Navbar from '../navbar/navbar';
import { useTranslation } from 'react-i18next';

function Organisation() {
    const { t, i18n } = useTranslation();

    const { companyName } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    const [serviceTranslation, setServiceTranslation] = useState(null);

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
            
            //new query to get the maori translation of the services offered
            const { data: translationData, error: translationError } = await supabase
                .from('service_translations')
                .select('services_offered_maori')
                .eq('service_id', data.service_id)
                .single();

            if (translationError) {
                console.error('Error fetching translation:', translationError);
            } else {
                setServiceTranslation(translationData?.services_offered_maori || null);
            }

            setLoading(false);
        };

        fetchService();
    }, [companyName]);


    //format the websites so they always open as the website rather then as in the site
    const formatWebsite = (url) => {
        if (!url) return null;
        //if url starts with http:// or https:// its fine leave it
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        //add https://
        return `https://${url}`;
    };

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
                </header>

                <section className="organisation-details">
                    <div className="contact-info">
                        <p><strong>{t("Phone")}:</strong> {service.phone || 'N/A'}</p>
                        <p><strong>{("Email")}:</strong> {service.email || 'N/A'}</p>

                        <p>
                            <strong>{t("Website")}:</strong>{" "}
                            <a href={formatWebsite(service.website)} target="_blank" rel="noreferrer">
                                {service.website}
                            </a>
                        </p>
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
                        {/*if current language is maori and a translation exists then displays that version*/}
                        {i18n.language === 'mi' && serviceTranslation
                            ? serviceTranslation.split('\n').map((item, idx) => (
                                <p key={idx}>• {item.trim()}</p>
                            ))
                            :
                            service.services_offered
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
