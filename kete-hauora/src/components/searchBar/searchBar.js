import React from 'react';
import './searchBar.css';

import { useTranslation } from 'react-i18next';

const SearchBar = ({ searchInput, setSearchInput, onSearch}) => {
  const { t } = useTranslation();
  return (
    <div className="search">
      <span className="search-icon material-symbols-outlined">search</span>
      <input
        className="search-input"
        type="search"
        placeholder={t("Enter service ID")}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {/*fliters are now in a different location*/}
     

      <button onClick={onSearch}>{t("Search")}</button>
      
      
      
    </div>
    


  );
};

export default SearchBar;
