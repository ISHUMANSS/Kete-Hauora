import React, {useEffect, useState} from "react";


const SearchAll = () => {

    const [services, setServices] = useState([]);

    const getSessions = async() => {
        try {
            //make the request
            const response = await fetch("http://localhost:5000/services");

            const jsonData = await response.json();

            //set the array of the services to the response when sucessful
            setServices(jsonData);
            
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        //run to fetch the data each time the page is rendered
        getSessions();
    },[]);




    return(
        <div className="SearchAll">

            <h1>Search for all the services: </h1>
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
            
        </div>
    );
};

export default SearchAll;