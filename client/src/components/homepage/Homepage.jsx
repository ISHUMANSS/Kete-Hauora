import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import SearchAll from '../searchall/searchall';
import Search from '../search/search';

function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const handleSearchClick = () => {
    setSearchTrigger(prev => prev + 1);//tells search component to re run
  };

  return (
    <div className="home">
      <div className="navbar">
        <Link to="/">LOGO</Link>
        <ul className="nav-links">
          <li><Link to="/about">About</Link></li>
          <li>
            <span className="login-icon material-symbols-outlined">person</span>
            <Link to="/login">Login</Link>
          </li>
          <li><Link to="/admin">temp admin for testing</Link></li>
        </ul>
      </div>
      
      <div className="center-container">
        <h1>Kete Hauora</h1>
        <div className="search">
          <span className="search-icon material-symbols-outlined">search</span>
          <input
            className="search-input"
            type="search"
            placeholder="Enter service ID"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={handleSearchClick}>Search</button>
        </div>
      </div>

      <div className="search-results">
        <Search serviceName={searchInput} triggerSearch={searchTrigger} />
        <SearchAll />
      </div>
    </div>
  );
}

export default HomePage;
