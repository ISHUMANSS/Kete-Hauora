import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import SearchResultCard from "../searchResultCard/searchResultCard";

import { useTranslation } from 'react-i18next';


const Search = ({ serviceName, triggerSearch, filters  }) => {
    const [serviceResult, setServiceResult] = useState(null); // shows the search table
    const [error, setError] = useState(null); // the error which tells the user what went wrong with their search, like if there weren't any results
    const [services, setServices] = useState([]); // list of all the services given in the response

    const { t } = useTranslation();

    useEffect(() => {
        const handleSearch = async () => {
            //check if anything to search for
            if (!serviceName && !filters.category && !filters.cost && !filters.language) {
                setServices([]);
                setServiceResult(null);
                setError(null);
                return;
            }

            //set up the search
            try {
                let query = supabase
                .from('services')
                .select(`
                    *,
                    service_categories!inner(category_id),
                    service_languages!inner(language_id)
                `);
                

                //if theres a service name add that to the search
                if (serviceName) {
                    query = query.ilike('company_name', `${serviceName}%`);
                }

                //if theres a cost add that to the search
                if (filters.cost) {
                    query = query.eq('cost_tf', filters.cost);
                }

                //if theres a catagory add it to the search
                if (filters.category) {
                    query = query.eq('service_categories.category_id', Number(filters.category));
                }

                
                if (filters.language) {
                    query = query.eq('service_languages.language_id', Number(filters.language));
                }

                //still need to add locations


                const { data, error } = await query;


                if (error) {
                    console.error(error);
                } else {
                    setServices(data);
                    setServiceResult(true);
                    setError(null);
                }

            } catch (err) {
                console.error("Search error:", err.message);
                setServiceResult(null);
                setError("An error occurred during the search.");
            }
        };

        handleSearch();
    }, [serviceName, filters]); //run each time the service name changes or the filters are changed lmao the search button is just for show pretty much

    return (
        <div className="Search">
            <h2>{t('Search Result')}:</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {serviceResult && (
                // if the service result exists, show the table
                <div className="result-container">
                    {services.map((service) => (
                        <SearchResultCard key={service.company_name} service={service} filters={filters}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
