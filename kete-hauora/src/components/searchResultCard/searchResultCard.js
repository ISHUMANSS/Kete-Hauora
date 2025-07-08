//just update the card here and use this where ever you need search results
//used to replace the table system we had before

import React from 'react';
import { Link } from 'react-router-dom';
import './searchResultCard.css';

const SearchResultCard = ({ service }) => {
    //takes in a service from the search and then gets the info from that
  return (
    <div className="search-result-card">
        <h3>{service.company_name}</h3>
        <p><strong>Website:</strong> {service.website}</p>
        <p><strong>Address:</strong> {service.physical_address}</p>
        <p><strong>Cost:</strong> {service.cost}</p>
        <p><strong>Services:</strong> {service.services_offered}</p>
        <Link to={`/editOrg/${encodeURIComponent(service.company_name)}`}>
        <button>Edit</button>
        </Link>
    </div>
  );
};

export default SearchResultCard;
