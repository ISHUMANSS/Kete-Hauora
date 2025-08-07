import React, { useState } from 'react';
//import { Link } from 'react-router-dom';
import './HomePage.css';
import SearchAll from '../searchall/searchall';
import Search from '../search/search';
import supabase from "../../config/supabaseClient";
import Navbar from '../navbar/navbar';
import SearchBar from '../searchBar/searchBar';
import FiltersBox from '../filters/Filters';

import { useTranslation } from 'react-i18next';

function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [filters, setFilters] = useState({ category: "", cost: "" });

  const handleSearchClick = () => {
    setSearchTrigger(prev => prev + 1); //tells search component to re run
  };

  const { t } = useTranslation();

  return (
    <div className="home">
      <Navbar />
      
      <div className="center-container">
        <h1 className='title'>Kete Hauora</h1>
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={handleSearchClick}
          
        />
        <FiltersBox
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="search-results">
        <Search serviceName={searchInput} triggerSearch={searchTrigger} filters={filters} />
        <SearchAll />
      </div>
    </div>
  );
}

export default HomePage;


//I think this must be where the users role is being checked??
export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error) setRole(data.role);
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
};
