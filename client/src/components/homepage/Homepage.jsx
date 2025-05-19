import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import SearchAll from '../searchall/searchall';


function HomePage() {
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
          </ul>
        </div>
        
        <div>
          <div className="center-container">
            <h1>Kete Hauora</h1>
            <div className="search">
                
                <span className="search-icon material-symbols-outlined">search</span>
                <input className="search-input" type="search" placeholder="$10 per search!!!" />
            </div>
          </div>
        </div>

        <div className="search-results">
            <SearchAll />
        </div>
      
    </div>
  );
}

export default HomePage;