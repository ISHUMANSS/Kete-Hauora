//just update the card here and use this where ever you need search results
//used to replace the table system we had before

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchResultCard.css";
import supabase from "../../config/supabaseClient";
import { useTranslation } from "react-i18next";

const SearchResultCard = ({ service, filters }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [serviceTranslation, setServiceTranslation] = useState(null);

  //shorten the services offered section
  const [expanded, setExpanded] = useState(false);

  //when service_id changes, fetch the Māori translation and saves it into serviceTranslation state
  useEffect(() => {
    if (i18n.language !== "mi"){
      setServiceTranslation(null);
      return;
    } 

    const fetchTranslation = async () => {
      const { data, error } = await supabase
        .from("service_translations")
        .select("services_offered_maori")
        .eq("service_id", service.service_id)
        .single();

      if (error) {
        console.error("Error fetching service translation:", error);
      } else {
        setServiceTranslation(data?.services_offered_maori || null);
      }
    };

    if (service?.service_id) {
      fetchTranslation();
    }
  }, [service?.service_id, i18n.language]);

  //format the websites so they always open as the website rather then as in the site
  const formatWebsite = (url) => {
    if (!url) return null;
    //if url starts with http:// or https:// its fine leave it
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
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
          <a
            href={formatWebsite(service.website)}
            target="_blank"
            rel="noreferrer"
          >
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

  //shorten the services offered section
  const renderServices = () => {
    const text =
      //checks if site is in maori and if a translation exists otherwise falls back to english or other notes
      i18n.language === "mi" && serviceTranslation
        ? serviceTranslation
        : service.services_offered || service.other_notes || t("Not provided");

    const maxLength = 120; //characters shown

    if (text.length <= maxLength) {
      return text;
    }
    return (
      <div className="services-text">
        {expanded ? text : text.substring(0, maxLength) + "..."}
        <button
          className="show-more-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? t("Show less") : t("Show more")}
        </button>
      </div>
    );
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
        <p>
          <strong>{t("Cost")}:</strong> {service.cost}
        </p>
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
        {renderServices()}
      </p>

      {(filters?.category ||
        filters?.cost ||
        filters?.language ||
        filters?.location) && (
        <div className="filters">
          <p>
            <strong>{t("Filters")}: </strong>
          </p>
          {filters?.category && (
            <span className="filter-badge">{filters.category_name}</span>
          )}
          {filters?.cost && (
            <span className="filter-badge">{filters.cost_name}</span>
          )}
          {filters?.language && (
            <span className="filter-badge">{filters.language_name}</span>
          )}
          {filters?.location && (
            <span className="filter-badge">{filters.location_name}</span>
          )}
        </div>
      )}

      <a
        href={`/organisation/${encodeURIComponent(service.company_name)}`}
        rel="noopener noreferrer"
        className="info-btn"
      >
        {t("More info")}
      </a>
    </div>
  );
};

export default SearchResultCard;
