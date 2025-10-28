import React, { useEffect, useState } from "react";
import "./Services.css"; // reuse same styles
import SearchBar from "../searchBar/searchBar";
import FiltersBox from "../filters/Filters";
import Search from "../search/search";
import SearchAll from "../searchall/searchall";

import { useTranslation } from "react-i18next";

const Services = () => {

  //saves it duing the session
  const [searchInput, setSearchInput] = useState(() => sessionStorage.getItem("searchInput") || "");
  

  const [searchTrigger, setSearchTrigger] = useState(0);

  const { t } = useTranslation();

  //save the filters to session storage
  const [filters, setFilters] = useState(() => {
    const savedFilters = sessionStorage.getItem("filters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          category: "",
          category_name: "",
          cost: "",
          cost_name: "",
          location: "",
          location_name: "",
          language: "",
          language_name: "",
        };
  });

  //update the session storage between changes
  useEffect(() => {
    sessionStorage.setItem("searchInput", searchInput);
    sessionStorage.setItem("filters", JSON.stringify(filters));
  }, [searchInput, filters]);

  const handleSearchClick = () => {
    setSearchTrigger((prev) => prev + 1); // rerun search
  };

  const isAnyFilterActive = Object.values(filters).some(
    (val) => val !== null && val !== "" && String(val).trim() !== ""
  );

  const shouldShowSearch = searchInput.trim() || isAnyFilterActive;

  return (
    <div className="services">
      <div className="center-container">
        <h1>{t("Find A Service")}</h1>
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
