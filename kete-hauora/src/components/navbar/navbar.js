/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
  }, [user, navigate]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18next.changeLanguage(selectedLang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // back to home
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
        <li><Link to="/services" className="nav-button">
        <span className="material-symbols-outlined">search</span>
        {t("Find A Service")}</Link></li>

        {!user ? (
          // Login if not logged in
         <li>
        <Link to="/login">
            <span className="login-icon material-symbols-outlined">person</span>
            {t("Login")}
          </Link>
        </li>
        ) : (
          // Logout if logged in
          <li>
            <button onClick={handleLogout} className="logout-btn">
              {t("Logout")}
            </button>
          </li>
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
