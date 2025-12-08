import React, { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import "./RecentlyUpdatedServices.css";

function RecentlyUpdatedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    async function loadServices() {
      const { data, error } = await supabase
        .from("services")
        .select("service_id, company_name, updated_at")
        .order("updated_at", { ascending: false })
        .limit(30);

      if (!error && data) setServices(data);
      setLoading(false);
    }

    loadServices();
  }, []);

  
  return (
    <div className="recent-page">
      <Navbar />
        <div className="recent-container">
            <div className="header-row">
                <button onClick={() => navigate(-1)} className="back-button">
                ← Back
                </button>

                <div className="header-text">
                <h1>Recently Updated Services</h1>
                <p>Showing the 30 most recently edited services.</p>
                </div>
            </div>

            {loading ? (
            <p>Loading...</p>
            ) : (
            <div className="recent-list">
                {services.map((service) => (
                <div key={service.service_id} className="recent-card">
                    <h3>{service.company_name}</h3>
                    <p>
                    Last updated:{" "}
                    {new Date(service.updated_at).toLocaleString()}
                    </p>

                    
                </div>
                ))}
            </div>
            )}
      </div>
    </div>
  );
}

export default RecentlyUpdatedServices;
