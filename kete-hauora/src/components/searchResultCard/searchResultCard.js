//just update the card here and use this where ever you need search results
//used to replace the table system we had before

import React from 'react';
import { Link } from 'react-router-dom';
import './searchResultCard.css';

const SearchResultCard = ({ service, filters }) => {
    //takes in a service from the search and then gets the info from that
  return (
    <div className="search-result-card">
        <h3>{service.company_name}</h3>
        {/*makes the links clickable 
        has some issues with the links being incorrect or there being more then one link per link???
        some of the links also just don't work*/}
        <p><strong>Website:</strong> <a href={service.website} target="_blank" rel="noreferrer">{service.website}</a></p>

        <p><strong>Address:</strong> {service.physical_address}</p>
        <p><strong>Cost:</strong> {service.cost}</p>
        <p><strong>Services:</strong> {/*service.services_offered*/}</p>
        <div className='filters'>
            <p><strong>Filters: </strong></p>
            {/*if there are filters display them nicely*/}
            {filters?.category  && (
                <span className="filter-badge">{/*service.category*/}</span>
            )}
            {filters?.cost  && (
                <span className="filter-badge">{service.cost}</span>
            )}
            {/*ADDD MORE FILTERS HERE*/}
        </div>

        <Link to={`/organisation/${encodeURIComponent(service.company_name)}`}>
            <button>More info</button>
        </Link>

        {/*should be only visible to the admins and i'm also not sure if it should be done in the basic search but it is currently the only way to edit services so its being left for now*/}
        <Link to={`/editOrg/${encodeURIComponent(service.company_name)}`}>
            <button>Edit</button>
        </Link>
        
    </div>
  );
};

export default SearchResultCard;
