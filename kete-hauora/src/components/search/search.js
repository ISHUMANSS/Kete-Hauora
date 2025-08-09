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
            //now it also searches when you just change the filters
            if (!triggerSearch ) return;

            try {
                let query = supabase
                .from('services')
                .select(`
                    *,
                    service_categories(
                        categories(category)
                    ),
                    service_languages(
                        languages(language)
                    )
                `);
                //regions currently broken


                //if there is a name
                if (serviceName) {
                    query = query.ilike('company_name', `${serviceName}%`);
                }

                //check for if any filters have been pased through so it should only display searches that fit into that filter
                //currently most things aren't catorgorised into actual filters so like most of these will not get results for actual data

                //category filter
                if (filters.category) {
                    query = query.eq('service_categories.categories.category', filters.category);
                }

                if (filters.cost) {
                    //check the cost_tf coloum 
                    /*TRUE means it costs money*/
                    /*FALSE means it is free*/
                    query = query.eq('cost_tf', filters.cost);
                }
/*
                //region filter
                if (filters.location) {
                    query = query.eq('region.region', filters.location);
                }
*/
                //language filter
                if (filters.language) {
                    query = query.eq('service_languages.languages.language', filters.language);
                }
                
                //actually run the query which might now have filters
                const { data, error } = await query;

                if (error) throw error;


                //check if data came back and is not empty
                if (data && data.length > 0) {
                    setServices(data); //if an array of results set it
                    setServiceResult(true); //show the results table
                    setError(null); //clear any previous errors
                } else {
                    setServices([]); //no results found
                    setServiceResult(null);
                    setError("No service found with that name."); //show error message to user
                }
            } catch (err) {
                console.error(err.message);
                setServiceResult(null);
                setError("Error searching for service."); // generic error fallback
            }
        };

        handleSearch();
    }, [triggerSearch, serviceName,filters]); //run each time the service name changes or when the search button is clicked

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
