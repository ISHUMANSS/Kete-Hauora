import React from 'react';
import './searchBar.css';

const SearchBar = ({ searchInput, setSearchInput, onSearch}) => {
  return (
    <div className="search">
      <span className="search-icon material-symbols-outlined">search</span>
      <input
        className="search-input"
        type="search"
        placeholder="Enter service ID"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {/*fliters are now in a different location*/}
     

      <button onClick={onSearch}>Search</button>
      
      
      
    </div>
    


  );
};

export default SearchBar;
