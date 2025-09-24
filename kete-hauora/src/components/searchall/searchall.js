import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import SearchResultCard from "../searchResultCard/searchResultCard";

import { useTranslation } from 'react-i18next';

const SearchAll = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    const getServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order("company_name", { ascending: true });

            if (error) throw error;

            setServices(data);
        } catch (err) {
            console.error("Error fetching services:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getServices();
    }, []);

    return (
        <div className="SearchAll">
            {loading ? (
                <p>{t("Loading services...")}</p>
            ) : (
                <div className="result-container">
                    {services.map((service) => (
                        <SearchResultCard key={service.company_name} service={service}/>
                    ))}
                </div>
                    
            )}
        </div>
    );
};

export default SearchAll;
