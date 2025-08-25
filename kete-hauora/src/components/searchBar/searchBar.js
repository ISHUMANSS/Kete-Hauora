import React, { useEffect, useState } from 'react';
import './searchBar.css';

import { useTranslation } from 'react-i18next';
import supabase from '../../config/supabaseClient';

const SearchBar = ({ searchInput, setSearchInput, onSearch}) => {
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

      const { data, error } = await supabase
        .from('services')
        .select('company_name')
        .ilike('company_name', `${searchInput}%`)
        .limit(5); //only show top 5 matches

      if (!error && data) {
        setSuggestions(data.map((s) => s.company_name));
      }
    };

    fetchSuggestions();
  }, [searchInput]);

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
        placeholder={t("Enter service ID")}
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setShowSuggestions(true);
        }}
      />
      <button onClick={onSearch}>{t("Search")}</button>

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
