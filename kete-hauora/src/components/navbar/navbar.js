import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => { // runs whenever new option is selected from language dropdown and gets value of selected item
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);//remembers selection
  };

  return (
    <div className="navbar">
      <Link to="/">LOGO</Link>
      <ul className="nav-links">
        <li><Link to="/">{t("Home")}</Link></li>
        <li><Link to="/about">{t("About")}</Link></li>
        <li>
          <Link to="/login"><span className="login-icon material-symbols-outlined">person</span>{t("Login")}</Link>
        </li>
        <li><Link to="/admin">Admin</Link></li>

        {/*change site language dropdown*/}
        <li>
          <select onChange={handleLanguageChange} value={i18n.language}>
            <option value="en">English</option>
            <option value="mi">Maori</option>
          </select>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
