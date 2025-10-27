/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../config/supabaseClient";
import logo from "../../assets/stacked_logo_white.svg";

const Navbar = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const navbarRef = useRef(null);

  //be able to click off the navbar in phone to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);//close sidebar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Fetch the user's role
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role_id")
          .eq("id", user.id)
          .single();

        if (!error) setProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    i18next.changeLanguage(selectedLang);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // back to home
  };

  //Take an admin to the correct dash board
  const handleDashboardRedirect = () => {
    if (!profile?.role_id) return;
    if (profile.role_id === 1) {
      navigate("/super-admin-dashboard");
    } else if (profile.role_id === 2) {
      navigate("/provider-dashboard");
    } else {
      toast.info("No dashboard assigned for your role.");
    }
  };

  return (
    <nav ref={navbarRef} className="navbar">
      <div className="nav-container">
        <div className="logo">
          <Link to="/">
            <img
              src={logo}
              alt="Middlemore Foundation Logo"
              className="logo-img"
            />
          </Link>
        </div>

        {/* Desktop navigation (hidden on mobile) */}
        <div className="nav-right desktop-only">
          <ul className="nav-links top-row">
            <li>
              <Link to="/about">
                <span className="material-symbols-outlined logout-icon">
                  help
                </span>
                {t("About")}
              </Link>
            </li>
            <li>
              {!user ? (
                // Login if not logged in
                <li>
                  <Link to="/login">
                    <span className="login-icon material-symbols-outlined">
                      person
                    </span>
                    {t("Login")}
                  </Link>
                </li>
              ) : (
                // Logout if logged in
                <li>
                  <button
                    onClick={handleLogout}
                    className="nav-link logout-btn"
                  >
                    <span className="material-symbols-outlined logout-icon">
                      logout
                    </span>
                    {t("Logout")}
                  </button>
                </li>
              )}
            </li>
            <li>
              <div className="language-dropdown">
                <select
                  onChange={handleLanguageChange}
                  value={i18next.language}
                >
                  <option value="en">English</option>
                  <option value="mi">Maori</option>
                </select>
                <span className="dropdown-icon material-symbols-outlined">
                  arrow_drop_down
                </span>
              </div>
            </li>
          </ul>

          <div className="divider"></div>

          <ul className="nav-links bottom-row">
            <li>
              <Link to="/contact">
                <span className="material-symbols-outlined logout-icon">
                  mail
                </span>
                {t("Contact Us")}
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-button">
                <span className="material-symbols-outlined">search</span>
                {t("Find A Service")}
              </Link>
            </li>
            {user && profile?.role_id && (
              <li>
                <button
                  onClick={handleDashboardRedirect}
                  className="nav-button dashboard-btn"
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  {t("Admin")}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile hamburger + sidebar (hidden on desktop) */}
      <div className="mobile-only">
        <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div>

        <ul className={`nav-links ${sidebarOpen ? "open" : ""}`}>
          <li>
            <Link to="/">{t("Home")}</Link>
          </li>
          <li>
            <Link to="/about">{t("About")}</Link>
          </li>
          <li>
            <Link to="/contact">{t("Contact Us")}</Link>
          </li>
          <li>
            <Link to="/services" className="nav-button">
              <span className="material-symbols-outlined">search</span>
              {t("Find A Service")}
            </Link>
          </li>

          {!user ? (
            // Login if not logged in
            <li>
              <Link to="/login">
                <span className="login-icon material-symbols-outlined">
                  person
                </span>
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
          {user && profile?.role_id && (
              <li>
                <button
                  onClick={handleDashboardRedirect}
                  className="nav-button dashboard-btn"
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  {t("Admin")}
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

      </div>
    </nav>
  );
};

export default Navbar;
