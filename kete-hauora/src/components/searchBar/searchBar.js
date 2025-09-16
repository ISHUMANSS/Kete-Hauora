import React, { useEffect, useState } from 'react';
import './searchBar.css';

import { useTranslation } from 'react-i18next';
import supabase from '../../config/supabaseClient';
import FilterChips from '../filters/FilterChips';
import { useFilters } from '../../context/FiltersContext';

//used for filter suggestions
import Fuse from "fuse.js";


const SearchBar = ({ searchInput, setSearchInput, onSearch, filters, setFilters}) => {
  const { t } = useTranslation();

  //get the suggestions which are most like the thing they want
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { categories } = useFilters();

  useEffect(() => {
    const fetchSuggestions = async () => {
    if (!searchInput) {
      setSuggestions([]);
      return;
    }

    // --- Service name suggestions ---
    const { data, error } = await supabase
      .from("services")
      .select(
        `id, company_name,
         cost_tf,
         service_categories!left(category_id),
         service_languages!left(language_id)`
      )
      .ilike("company_name", `${searchInput}%`)
      .limit(3);

    let nameSuggestions = [];
    if (!error && data) {
      let names = data;

      // apply filters
      if (filters.category) {
        names = names.filter(service =>
          service.service_categories?.some(
            cat => cat.category_id === Number(filters.category)
          )
        );
      }
      if (filters.language) {
        names = names.filter(service =>
          service.service_languages?.some(
            lang => lang.language_id === Number(filters.language)
          )
        );
      }
      if (filters.cost) {
        names = names.filter(
          service => service.cost_tf === filters.cost
        );
      }

      nameSuggestions = names.map(s => ({ 
        type: "service", 
        label: s.company_name, 
        value: s.company_name, 
      }));
    }

    //Category suggestions
    //fuzzy match
    const fuseCategories = new Fuse(categories, {
      keys: ["category"],
      threshold: 0.5,//smaller = stricter match
    });

    const categoryResults = fuseCategories.search(searchInput).slice(0, 3);

    const categorySuggestions = categoryResults.map(r => ({
      type: "category",
      label: r.item.category,
      value: r.item.category_id,
    }));

    //merge syggestions
    setSuggestions([...nameSuggestions, ...categorySuggestions]);
  };

    fetchSuggestions();
  }, [searchInput, filters, categories]);



 const handleSelect = (s) => {
  if (s.type === "service") {
    setSearchInput(s.label); //user searches by company name
  } else if (s.type === "category") {
    setFilters(prev => ({
      ...prev,
      category: s.value,//store category_id
      category_name: s.label,//store category label for chips
    }));
    //when a catagory is selected from the list in the drop down clear the input
    setSearchInput("");
  }
  setShowSuggestions(false);
};

  return (
    <div className="search relative">
      <span className="search-icon material-symbols-outlined">search</span>
      <input
        className="search-input"
        type="search"
        placeholder={t("Enter service Name")}
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setShowSuggestions(true);
        }}
      />
      <FilterChips filters={filters} setFilters={setFilters}/>

      {/*<button onClick={onSearch}>{t("Search")}</button>*/}
      
      {/* suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          <li
            className="close-suggestions"
            onClick={() => setShowSuggestions(false)}
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              textAlign: "right",
              paddingRight: "0.75rem",
            }}
          >
            ✕
          </li>
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                fontStyle: s.type === "category" ? "italic" : "normal",
                color: s.type === "category" ? "blue" : "black",
              }}
            >
              {s.label} {s.type === "category" && <span>(Category)</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
};

export default SearchBar;
