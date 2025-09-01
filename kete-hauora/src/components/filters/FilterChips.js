import React from 'react';
import './FilterChips.css';

const FilterChips = ({ filters, setFilters }) => {
  const removeFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: '',
      [`${key}_name`]: ''
    }));
  };

  return (
    <div className="filter-chips">
      {filters.category && (
        <span className="chip" onClick={() => removeFilter('category')}>
          {filters.category_name} ✕
        </span>
      )}
      {filters.cost && (
        <span className="chip" onClick={() => removeFilter('cost')}>
          {filters.cost_name} ✕
        </span>
      )}
      {filters.location && (
        <span className="chip" onClick={() => removeFilter('location')}>
          {filters.location_name} ✕
        </span>
      )}
      {filters.language && (
        <span className="chip" onClick={() => removeFilter('language')}>
          {filters.language_name} ✕
        </span>
      )}
    </div>
  );
};

export default FilterChips;
