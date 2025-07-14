import React from 'react';
import './searchBar.css';

const SearchBar = ({ searchInput, setSearchInput, onSearch, filters, setFilters }) => {
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

      {/*fliters section*/}
      <div>
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Community">Community</option>
          {/* add more */}
        </select>

        <select
          value={filters.cost}
          onChange={(e) => setFilters(prev => ({ ...prev, cost: e.target.value }))}
        >
          {/*the value currenty has to match with the value exactly*/}
          <option value="">Any Cost</option>
          <option value="free">Free</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <button onClick={onSearch}>Search</button>
      
      
      
    </div>
    


  );
};

export default SearchBar;
