import React, { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import { Link } from "react-router-dom";

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
                <table className="table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Website</th>
                            <th>Physical Address</th>
                            <th>Hours</th>
                            <th>Sites</th>
                            <th>Languages</th>
                            <th>Cost</th>
                            <th>Services Offered</th>
                            <th>Referral</th>
                            <th>Other Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                                <tr key={service.company_name}>
                                    <td>{service.company_name}</td>
                                    <td>{service.phone}</td>
                                    <td>{service.email}</td>
                                    <td>{service.website}</td>
                                    <td>{service.physical_address}</td>
                                    <td>{service.hours}</td>
                                    <td>{service.sites}</td>
                                    <td>{service.languages}</td>
                                    <td>{service.cost}</td>
                                    <td>{service.services_offered}</td>
                                    <td>{service.referral}</td>
                                    <td>{service.other_notes}</td>
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

export default SearchAll;
