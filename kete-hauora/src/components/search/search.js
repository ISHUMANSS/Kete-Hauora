import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import { Link } from "react-router-dom";


const Search = ({ serviceName, triggerSearch }) => {
    const [serviceResult, setServiceResult] = useState(null); // shows the search table
    const [error, setError] = useState(null); // the error which tells the user what went wrong with their search, like if there weren't any results
    const [services, setServices] = useState([]); // list of all the services given in the response

    useEffect(() => {
        const handleSearch = async () => {
            // if it's missing the data it needs, return and don't search
            if (!triggerSearch || !serviceName) return;

            try {
                // query the services table from Supabase where company_name matches the serviceName
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .ilike('company_name', `%${serviceName}%`); // case-insensitive match, partial search

                if (error) throw error;

                // check if data came back and is not empty
                if (data && data.length > 0) {
                    setServices(data); // if it's an array of results, set it
                    setServiceResult(true); // show the results table
                    setError(null); // clear any previous errors
                } else {
                    setServices([]); // no results found
                    setServiceResult(null);
                    setError("No service found with that name."); // show error message to user
                }
            } catch (err) {
                console.error(err.message);
                setServiceResult(null);
                setError("Error searching for service."); // generic error fallback
            }
        };

        handleSearch();
    }, [triggerSearch, serviceName]); // run each time the service name changes or when the search button is clicked

    return (
        <div className="Search">
            <h2>Search Result</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {serviceResult && (
                // if the service result exists, show the table
                <table className="table">
                   <thead>
                        <tr>
                            <th>Company Name</th>

                            <th>Website</th>
                            <th>Physical Address</th>
                            <th>Cost</th>
                            <th>Services Offered</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                                <tr key={service.company_name}>
                                    <td>{service.company_name}</td>
                                    <td>{service.website}</td>
                                    <td>{service.physical_address}</td>
                                    <td>{service.cost}</td>
                                    <td>{service.services_offered}</td>
                                    {/*Edit Button column*/}
                                    <td>
                                        <Link to={`/editOrg/${encodeURIComponent(service.company_name)}`}>
                                        <button>Edit</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Search;
