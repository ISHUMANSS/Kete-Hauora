import React, { useState } from "react";
import "./Services.css"; // reuse same styles
import Navbar from "../navbar/navbar";
import SearchBar from "../searchBar/searchBar";
import FiltersBox from "../filters/Filters";
import Search from "../search/search";
import SearchAll from "../searchall/searchall";

import { useTranslation } from 'react-i18next';

const Services = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    category: "",
    category_name: "",
    cost: "",
    cost_name: "",
    location: "",
    location_name: "",
    language: "",
    language_name: "",
  });

  const handleSearchClick = () => {
    setSearchTrigger((prev) => prev + 1); // rerun search
  };


  const isAnyFilterActive = Object.values(filters).some(
    (val) => val !== null && val !== "" && String(val).trim() !== ""
  );

  const shouldShowSearch = searchInput.trim() || isAnyFilterActive;

  return (
    <div className="home">
      <Navbar />

      <div className="center-container">
        <h1 className="title">{t("Find A Service")}</h1>
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={handleSearchClick}
          filters={filters}
          setFilters={setFilters}
        />
        <FiltersBox filters={filters} setFilters={setFilters} />
      </div>

      <div className="search-results">
        {shouldShowSearch ? (
          <Search
            serviceName={searchInput}
            triggerSearch={searchTrigger}
            filters={filters}
          />
        ) : (
          <SearchAll filters={filters} />
        )}
      </div>
    </div>
  );
};

export default Services;
