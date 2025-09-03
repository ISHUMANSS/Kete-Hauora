import React, { useEffect, useState } from 'react';
import './searchBar.css';

import { useTranslation } from 'react-i18next';
import supabase from '../../config/supabaseClient';
import FilterChips from '../filters/FilterChips';




const SearchBar = ({ searchInput, setSearchInput, onSearch, filters, setFilters}) => {
  const { t } = useTranslation();

  //get the suggestions which are most like the thing they want
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchInput) {
        setSuggestions([]);
        return;
      }

      //to be able to apply the filters to the suggestions we also grab all the filter info
      const { data, error } = await supabase
        .from('services')
        .select(`company_name,
          cost_tf,
          service_categories!left(category_id),
          service_languages!left(language_id)
        `)
        .ilike('company_name', `${searchInput}%`)
        .limit(5); //only show top 5 matches

      if (!error && data) {
        let names = data.map(s => s);

        //apply current filters to suggestions
        if (filters.category) {
          names = names.filter(service =>
            service.service_categories?.some(cat => cat.category_id === Number(filters.category))
          );
        }

        if (filters.language) {
          names = names.filter(service =>
            service.service_languages?.some(lang => lang.language_id === Number(filters.language))
          );
        }

        if (filters.cost) {
          names = names.filter(service => service.cost_tf === filters.cost);
        }

        //only keep names that start with the input
        const filteredSuggestions = names
          .map(s => s.company_name)
          .filter(name => name.toLowerCase().startsWith(searchInput.toLowerCase()))
          .slice(0, 4);//how many suggestions will be showen

        setSuggestions(filteredSuggestions);
      }
    };

    fetchSuggestions();
  }, [searchInput, filters]);



   const handleSelect = (value) => {
    setSearchInput(value);
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
              paddingRight: "0.75rem"
            }}
          >
            ✕
          </li>
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => handleSelect(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
};

export default SearchBar;
