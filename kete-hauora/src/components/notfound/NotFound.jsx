import React from "react";
import Navbar from "../navbar/navbar";
import { Link } from "react-router-dom";
import './NotFound.css';

//fall back page for if an invalid link is entered or clicked

const NotFound = () => {
    return (
        <div>
            <Navbar />
            <div className="notfound-container">
                <h1 className="notfound-title">404</h1>
                <p className="notfound-message">Page not found</p>
                <p className="notfound-message">Sorry, we couldn’t find the page you’re looking for.</p>
                
                <Link to="/">
                    <button className="notfound-button">Go Home</button>
                </Link>
            </div>
        </div>
  );
};

export default NotFound;
