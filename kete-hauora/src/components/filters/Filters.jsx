import React from 'react';
import './Filters.css';

import { useTranslation } from 'react-i18next';

//filters component box where the user is able to select the filters and have that update the filters they are currently using
//now we can just add some more filters into this box 

const FiltersBox = ({ filters, setFilters }) => {
    const { t } = useTranslation();

    //click the buttons to reset the filters
    const handleClearFilters = () => {
        setFilters({
            category: '',
            cost: '',
            location: '',
            language: [], //is an arry so it can do more then one
        });
    };

  return (
    <div className="filters-box">
        <h4>{t("Filters")}</h4>
        <div className="filters-section">
            <div className="filter-group">
                <label>{t("Category")}</label>
                
                <select
                    value={filters.category}
                    
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value })) /*allows us to change the filter list*/}
                >
                    <option value="">{t("All Categories")}</option>
                    <option value="Health">{t("Health")}</option>
                    <option value="Education">{t("Education")}</option>
                    <option value="Community">{t("Community")}</option>
                </select>
            </div>

            <div className="filter-group">
                <label>{t("Cost")}</label>
                <select
                    value={filters.cost}
                    onChange={(e) => setFilters(prev => ({ ...prev, cost: e.target.value }))}
                >
                    <option value="">{t("Any Cost")}</option>
                    <option value="free">{t("Free")}</option>
                    <option value="Paid">{t("Paid")}</option>
                </select>
            </div>

            <div className="filter-group">
                <label>{t("Region")}</label>
                <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                >
                <option value="">{t("All Locations")}</option>
                    <option value="Auckland">{t("Auckland")}</option>
                    <option value="Manakau">{t("Manakau")}</option>
                    <option value="Other">{t("Other")}</option>
                </select>
            </div>

            <div className="filter-group">
            <label>{t("Languages")}</label>
            <div className="checkbox-group">
                {['English', 'Maori', 'Other'].map((lang) => (
                <label key={lang} className="checkbox-label">
                    <input
                    type="checkbox"
                    value={lang}
                    checked={filters.language.includes(lang)}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFilters((prev) => {
                        const isChecked = prev.language.includes(value);
                        return {
                            ...prev,
                            language: isChecked
                            ? prev.language.filter((l) => l !== value)
                            : [...prev.language, value],
                        };
                        });
                    }}
                    />
                    {lang}
                </label>
                ))}
            </div>
            </div>

            <button onClick={handleClearFilters}>
                {t("Clear Filters")}
            </button>
        </div>
      
    </div>
  );
};

export default FiltersBox;
