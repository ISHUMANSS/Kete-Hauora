import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">LOGO</Link>
      <ul className="nav-links">
        <li><Link to="/about">About</Link></li>
        <li>
          <span className="login-icon material-symbols-outlined">person</span>
          <Link to="/login">Login</Link>
        </li>
        <li><Link to="/admin">Admin Page</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
