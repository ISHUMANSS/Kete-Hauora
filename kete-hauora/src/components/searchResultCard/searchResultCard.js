//just update the card here and use this where ever you need search results
//used to replace the table system we had before

import React from 'react';
import { Link } from 'react-router-dom';
import './searchResultCard.css';

import { useTranslation } from 'react-i18next';

const SearchResultCard = ({ service, filters }) => {
    const { t } = useTranslation();

    //format the websites so they always open as the website rather then as in the site
    const formatWebsite = (url) => {
        if (!url) return null;
        //if url starts with http:// or https:// its fine leave it
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        //add https://
        return `https://${url}`;
    };


    //pick the best thing to be used for contact info for the card
    const contactInfo = () => {
        //we perfer the website 
        if (service.website) {
            return (
                <p>
                    <strong>{t("Website")}:</strong>{" "}
                    <a href={formatWebsite(service.website)} target="_blank" rel="noreferrer">
                        {service.website}
                    </a>
                </p>
            );
        } else if (service.email) {
            //mail address as the second best bet
            return (
                <p>
                    <strong>{t("Email")}:</strong>{" "}
                    <a href={`mailto:${service.email}`}>{service.email}</a>
                </p>
            );
        } else if (service.phone) {
            //back up phone number
            return (
                <p>
                    <strong>{t("Phone")}:</strong> {service.phone}
                </p>
            );
        } else {
            //was blank
            return (
                <p>
                    <strong>{t("Contact")}:</strong> {t("Not provided")}
                </p>
            );
        }
    };


    //takes in a service from the search and then gets the info from that
  return (
    <div className="search-result-card">
        <h3>{service.company_name}</h3>
        

        {/* Contact info with fallbacks */}
        {contactInfo()}

        <p>
            <strong>{t("Address")}:</strong>{" "}
            {service.physical_address || t("Not provided")}
        </p>

        {service?.cost && (
            <p><strong>{t("Cost")}:</strong> {service.cost}</p>
        )}

        <p>
            <strong>
                {service.services_offered
                ? t("Services")
                : service.other_notes
                ? t("Other notes")
                : t("Services")}
                :
            </strong>{" "}
            {service.services_offered || service.other_notes || t("Not provided")}
        </p>

        <div className='filters'>
            <p><strong>{t("Filters")}: </strong></p>
            {/*if there are filters display them nicely*/}
            {filters?.category  && (
                <span className="filter-badge">{filters.category_name}</span>
            )}
            {filters?.cost  && (
                <span className="filter-badge">{filters.cost_name}</span>
            )}
            {filters?.language  && (
                <span className="filter-badge">{filters.language_name}</span>
            )}
            {/*ADDD MORE FILTERS HERE*/}
        </div>

        <Link to={`/organisation/${encodeURIComponent(service.company_name)}`}>
            <button>{t("More info")}</button>
        </Link>
{/*
    this was for the editing orgs but I don't think its needed
        <Link to={`/editOrg/${encodeURIComponent(service.company_name)}`}>
            <button>{t("Edit")}</button>
        </Link>
*/}        
    </div>
  );
};

export default SearchResultCard;
