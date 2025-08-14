import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  return (
    <div className="navbar">
      <Link to="/">LOGO</Link>
      <ul className="nav-links">
        <li><Link to="/">{t("Home")}</Link></li>
        <li><Link to="/about">{t("About")}</Link></li>
        <li>
          <Link to="/login"><span className="login-icon material-symbols-outlined">person</span>{t("Login")}</Link>
        </li>
        <li><Link to="/admin">{t("Admin")}</Link></li>
      </ul>
    </div>
  );
};

export default Navbar;
