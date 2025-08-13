import React, { useEffect, useState } from 'react';
import './Filters.css';

import { useTranslation } from 'react-i18next';

import supabase from '../../config/supabaseClient';

//filters component box where the user is able to select the filters and have that update the filters they are currently using
//now we can just add some more filters into this box 

const FiltersBox = ({ filters, setFilters }) => {
    const { t } = useTranslation();

    const [categories, setCategories] = useState([]);
    //const [languages, setLanguages] = useState([]);

    //get all the filters from the db
    useEffect(() => {
        const fetchFilterData = async () => {
            //fetch categories
            //to do this I had to allow for a RLS in supabase
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('category_id, category')
                .order('category', { ascending: true });

            if (catError) {
                console.error('Error fetching categories:', catError.message);
            } else {
                
                setCategories(catData);
            };

            /*
            //not sure if we wnt to get the languages from the database
            //fetch languages
            const { data: langData, error: langError } = await supabase
                .from('languages')
                .select('language_id, language')
                .order('language', { ascending: true });

            if (!langError) setLanguages(langData);
            */

            //I can just add the regions here also
        };
        

        fetchFilterData();
    }, []);


    //click the buttons to reset the filters
    const handleClearFilters = () => {
        setFilters({
            category: '',
            cost: '',
            location: '',
            language: '',
        });
    };

    //allow for togeling on and off
    const handleLanguageChange = (value) => {
        setFilters((prev) => ({
        ...prev,
        language: prev.language === value ? '' : value, // toggle off if same value
        }));
    };

  return (
    <div className="filters-box">
        <h4>{t("Filters")}</h4>
        <div className="filters-section">
            <div className="filter-group">
                <label>{t("Category")}</label>
                
                <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: Number(e.target.value) }))}
                >
                    <option value="">All Categories</option>
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
                    onChange={(e) => setFilters(prev => ({ ...prev, cost: e.target.value }))}
                >
                    <option value="">{t("Any Cost")}</option>
                    <option value="FALSE">{t("Free")}</option>{/*FALSE means it is free*/}
                    <option value="TRUE">{t("Paid")}</option>{/*TRUE means it costs money*/}
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
                <label key={lang} className="radio-label">
                    <input
                        type="radio"
                        name="language"
                        value={lang}
                        checked={filters.language === lang}
                        onClick={() => handleLanguageChange(lang)}//toggle support
                        readOnly
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
