import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import { Link } from "react-router-dom";
import SearchResultCard from "../searchResultCard/searchResultCard";

const SearchAll = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const getServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*');

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
            <h1>Search for all the services:</h1>

            {loading ? (
                <p>Loading services...</p>
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
