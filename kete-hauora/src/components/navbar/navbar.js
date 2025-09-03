import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const handleLanguageChange = (e) => { // runs whenever new option is selected from language dropdown and gets value of selected item
    const newLang = e.target.value;
    i18next.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);//remembers selection
  };

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
        <li><Link to="/admin">Admin</Link></li>

        {/*change site language dropdown*/}
        <li>
          <select onChange={handleLanguageChange} value={i18next.language}>
            <option value="en">English</option>
            <option value="mi">Maori</option>
          </select>
        </li>
      </ul>
         {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

    </nav>
  );
};

export default Navbar;
