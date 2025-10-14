import React, { useState } from "react";
import "./Filters.css";

import { useTranslation } from "react-i18next";

import { useFilters } from "../../context/FiltersContext";

//filters component box where the user is able to select the filters and have that update the filters they are currently using
//now we can just add some more filters into this box

const FiltersBox = ({ filters, setFilters }) => {
  const { t } = useTranslation();

  const { categories, languages, regions, loading } = useFilters();

  //allow us to minize the filters box
  const [collapsed, setCollapsed] = useState(false);

  //click the buttons to reset the filters
  //I have the names and the id becasue it means we don't have to re search the db to get the names
  const handleClearFilters = () => {
    setFilters({
      category: "",
      category_name: "",
      cost: "",
      cost_name: "",
      location: "",
      location_name: "",
      language: "",
      language_name: "",
    });
  };

  if (loading) {
    return (
      <div className="filters-box">
        <p>{t("Loading filters...")}</p>
      </div>
    );
  }

  return (
    <div className="filters-box">
      <div className="filters-header">
        <h4>{t("Filters")}</h4>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? t("Expand") : t("Collapse")}
        >
          {collapsed ? "▼" : "▲"}
        </button>
      </div>

      {!collapsed && (
        <div className="filters-section">
          <div className="filter-group">
            <label>{t("Category")}</label>

            <select
              value={filters.category}
              onChange={(e) => {
                //get the id
                const selectedId = Number(e.target.value);

                //get the name
                const selectedName =
                  categories.find((cat) => cat.category_id === selectedId)
                    ?.category || "";

                setFilters((prev) => ({
                  ...prev,
                  category: selectedId || "", //store the ID (or '' if cleared)
                  category_name: selectedName, //store the display name
                }));
              }}
            >
              <option value="">{t("All Categories")}</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t("Cost")}</label>
            <select
              value={filters.cost}
              onChange={(e) => {
                const selectedVal = e.target.value;
                let selectedName = "";

                if (selectedVal === "FALSE") {
                  selectedName = "Free";
                } else if (selectedVal === "TRUE") {
                  selectedName = "Paid";
                }

                setFilters((prev) => ({
                  ...prev,
                  cost: selectedVal,
                  cost_name: selectedName,
                }));
              }}
            >
              <option value="">{t("Any Cost")}</option>
              <option value="FALSE">{t("Free")}</option>
              {/*FALSE means it is free*/}
              <option value="TRUE">{t("Paid")}</option>
              {/*TRUE means it costs money*/}
            </select>
          </div>

          <div className="filter-group">
            <label>{t("Region")}</label>
            <select
              value={filters.location}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const selectedName =
                  regions.find((r) => r.region_id === selectedId)?.region || "";
                setFilters((prev) => ({
                  ...prev,
                  location: selectedId || "",
                  location_name: selectedName,
                }));
              }}
            >
              <option value="">{t("All Locations")}</option>
              {regions.map((region) => (
                <option key={region.region_id} value={region.region_id}>
                  {region.region}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>{t("Languages")}</label>
            <select
              value={filters.language}
              onChange={(e) => {
                const selectedId = Number(e.target.value);

                // find the name for the selected ID
                const selectedName =
                  languages.find((lang) => lang.language_id === selectedId)
                    ?.language || "";

                setFilters((prev) => ({
                  ...prev,
                  language: selectedId || "", // store id
                  language_name: selectedName, // store readable name
                }));
              }}
            >
              <option value="">{t("All Languages")}</option>
              {languages.map((lang) => (
                <option key={lang.language_id} value={lang.language_id}>
                  {lang.language}
                </option>
              ))}
            </select>
          </div>

          <button class={"clear-btn"} onClick={handleClearFilters}>
            {t("Clear Filters")}
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltersBox;
