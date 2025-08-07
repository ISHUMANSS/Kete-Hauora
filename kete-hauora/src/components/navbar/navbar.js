import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">LOGO</Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          <Link to="/login"><span className="login-icon material-symbols-outlined">person</span>Login</Link>
        </li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
