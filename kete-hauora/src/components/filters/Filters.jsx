import React from 'react';
import './Filters.css';

//filters component box where the user is able to select the filters and have that update the filters they are currently using
//now we can just add some more filters into this box 

const FiltersBox = ({ filters, setFilters }) => {
  return (
    <div className="filters-box">
        <h4>Filters</h4>
        <div className="filters-section">
            <div className="filter-group">
            <label>Category</label>
            <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
                <option value="">All Categories</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Community">Community</option>
            </select>
            </div>

            <div className="filter-group">
            <label>Cost</label>
            <select
                value={filters.cost}
                onChange={(e) => setFilters(prev => ({ ...prev, cost: e.target.value }))}
            >
                <option value="">Any Cost</option>
                <option value="free">Free</option>
                <option value="Paid">Paid</option>
            </select>
            </div>
        </div>
      
    </div>
  );
};

export default FiltersBox;
