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
            //if nothing to search for
            if (!serviceName && !filters.category && !filters.cost && !filters.language) {
                setServices([]);
                setServiceResult(null);
                setError(null);
                return;
            }

            try {
            //fetch all services with left joins
            const { data, error } = await supabase
                .from('services')
                .select(`
                *,
                service_categories!left(category_id),
                service_languages!left(language_id)
                `);

            if (error) {
                console.error(error);
                setError("An error occurred during the search.");
                return;
            }

            //now running filters localy

            //start with all data
            let filtered = data;

            //filter by serviceName at the start of the string
            if (serviceName) {
                const searchLower = serviceName.toLowerCase();
                filtered = filtered.filter(service =>
                    service.company_name.toLowerCase().startsWith(searchLower)
                );
            }

            //filter by cost
            if (filters.cost) {
                //convert to bool for local filtering
                const costBool = filters.cost === "TRUE"; // "TRUE" → true, "FALSE" → false
                filtered = filtered.filter(service => service.cost_tf === costBool);
            }

            //filter by category
            //checks if like the id of the returned catagories match the catagory id in service catagories
            //keep only services that have at least one category matching the selected category ID
            if (filters.category) {
                filtered = filtered.filter(service =>
                service.service_categories?.some(
                    cat => cat.category_id === Number(filters.category)
                )
                );
            }

            //filter by language
            //checks if like the id of the returned languages match the languages id in service languages
            //keep only services that have at least one language matching the selected language ID
            if (filters.language) {
                filtered = filtered.filter(service =>
                service.service_languages?.some(
                    lang => lang.language_id === Number(filters.language)
                )
                );
            }

            setServices(filtered);
            setServiceResult(true);
            setError(filtered.length === 0 ? "No results found." : null);

            } catch (err) {
            console.error("Search error:", err.message);
            setServices([]);
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
