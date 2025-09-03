import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">LOGO</Link>
      </div>

      <div className="hamburger" onClick={toggleSidebar}>
        ☰
      </div>

      <ul className={`nav-links ${sidebarOpen ? 'open' : ''}`}>
        <li><Link to="/">{t("Home")}</Link></li>
        <li><Link to="/about">{t("About")}</Link></li>
        <li>
          <Link to="/login">
            <span className="login-icon material-symbols-outlined">person</span>{t("Login")}
          </Link>
        </li>
        <li><Link to="/admin">{t("Admin")}</Link></li>
      </ul>
         {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

    </nav>
  );
};

export default Navbar;
