import React from "react";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import './NotFound.css';

import { useTranslation } from 'react-i18next';

//fall back page for if an invalid link is entered or clicked

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div>
            <Navbar />
            <div className="notfound-container">
                <h1 className="notfound-title">404</h1>
                <p className="notfound-message">{t("Page not found")}</p>
                <p className="notfound-message">{t("Sorry, we couldn’t find the page you’re looking for.")}</p>
                
                <Link to="/">
                    <button className="notfound-button">{t("Back to Home")}</button>
                </Link>
            </div>
        </div>
  );
};

export default NotFound;
