/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';

const Navbar = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();   
  const [profile, setProfile] = useState(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role_id')
          .eq('id', user.id)
          .single();

        if (!error) {
          setProfile(data);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18next.changeLanguage(selectedLang);
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
        <li><Link to="/contact">{t("Contact Us")}</Link></li>
        <li><Link to="/services">{t("Find A Service")}</Link></li>
        <li>
          <Link to="/login">
            <span className="login-icon material-symbols-outlined">person</span>
            {t("Login")}
          </Link>
        </li>

        {/* role based admin */}
        {user && profile?.role_id === 1 && (
          <li><Link to="/super-admin-dashboard">Admin</Link></li>
        )}
        {user && profile?.role_id === 2 && (
          <li><Link to="/provider-dashboard">Admin</Link></li>
        )}

        {/* language selector */}
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
