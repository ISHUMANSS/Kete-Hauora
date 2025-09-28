import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

import supabase from "../../config/supabaseClient";
import Navbar from "../navbar/navbar";

//import { useTranslation } from 'react-i18next';

function HomePage() {
  return (
    <div className="homepage">
      <Navbar />
      <div className="homepage-content">
        <h1>Te Kete Hauora</h1>
        <p className="subtitle">
          Your community health and wellbeing directory.
        </p>

        <p>
          Te Kete Hauora makes it simple to find local health and community
          services across Counties Manukau. Whether you’re looking for medical
          care, mental health support, social services, or community programs,
          this platform helps you connect with the right services quickly and
          easily.
        </p>

        <div className="why-section">
          <h2>Why use Te Kete Hauora?</h2>
          <ul>
            <li>✅ Up-to-date information – no more outdated PDFs</li>
            <li>
              ✅ Simple search – find services by category, cost, or location
            </li>
            <li>
              ✅ Accessible to everyone – on mobile, desktop, and in multiple
              languages
            </li>
            <li>
              ✅ Community-driven – providers can update their details directly
            </li>
          </ul>
        </div>

        <div className="start-section">
          <h2>Start exploring today</h2>
          <p>
            Go to the{" "}
            <Link to="/services" className="link-highlight">
              Find a Service
            </Link>{" "}
            page on the navigation bar to search by category or discover
            services available in your community.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

//I think this must be where the users role is being checked??
export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error) setRole(data.role);
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
};
