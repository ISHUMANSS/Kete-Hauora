import React, { useEffect, useState } from "react";

const Search = ({ serviceName, triggerSearch }) => {
    const [serviceResult, setServiceResult] = useState([]);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]);//list of all the services given in the response

    useEffect(() => {
        const handleSearch = async () => {
            if (!triggerSearch || !serviceName) return;

            try {
                const response = await fetch(`http://localhost:5000/services/${serviceName}`);
                if (!response.ok) throw new Error("Service not found");
                const jsonData = await response.json();
                
                //check that it was an array that turned up
                if (Array.isArray(jsonData)) {
                    setServices(jsonData);
                } else if (jsonData && jsonData.service) {
                    //if the data isn't an array enter the single entry into the array
                    setServices(jsonData.service);
                } else {
                    throw new Error("Unexpected response format");
                }


                setServiceResult(true);
                setError(null);
            } catch (err) {
                console.error(err.message);
                setServiceResult(null);
                setError("No service found with that ID.");
            }
        };

        handleSearch();
    }, [triggerSearch, serviceName]);

    return (
        <div className="Search">
            <h2>Search Result</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {serviceResult && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>Company name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service =>(
                            <tr>
                                <td>{service.service_id}</td>
                                <td>{service.company_name}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Search;
