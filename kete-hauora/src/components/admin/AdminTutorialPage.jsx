import React, { useEffect, useState } from "react";
import "./AdminTutorialPage.css";
import Navbar from "../navbar/navbar";
import { useTranslation } from "react-i18next";
import { supabase } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";

function AdminTutorialPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  // --- Restrict page to admins only ---
  useEffect(() => {
    async function fetchUserRole() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        navigate("/");
        return;
      }

      setRoleId(data.role_id);
      setLoading(false);
    }

    fetchUserRole();
  }, [navigate]);

  if (loading) return null;

  // not admin = redirect
  if (roleId !== 1) {
    navigate("/");
    return null;
  }

  return (
    <div className="about">
      <Navbar />
      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
      </div>


      <div className="about-content">
        <h1>{t("Admin Tutorial and Help Centre")}</h1>
        <p>
          {t("This page provides a complete guide for administrators managing the Te Kete Hauora platform.")}
        </p>

        {/* SECTION 1 - Overview */}
        <section className="about-section">
          <h2>{t("Admin Responsibilities")}</h2>
          <p>
            {t("As an admin, you can manage service providers, add new listings, edit any listings, add/update any filters")}
          </p>
          <ul>
            <li>{t("Add or edit organisation listings")}</li>
            <li>{t("Manage all user accounts and roles")}</li>
            <li>{t("Update filters")}</li>
            <li>{t("Oversee content quality and consistency")}</li>
            <li>Make sure images added are appropriate</li>
          </ul>
        </section>

        {/* SECTION 2 - How to Manage Services */}
        <section className="about-section">
          <h2>{t("Managing Services")}</h2>
          <p>{t("Use the Edit Organisation page to:")}</p>
          <ul>
            <li>{t("Edit organisation information")}</li>
            <li>{t("Assign categories & update service details")}</li>
            <li>{t("Delete services")}</li>
            <li>Make sure images added are appropriate</li>
          </ul>
        </section>

        {/* SECTION 3 - User Management */}
        <section className="about-section">
          <h2>{t("Managing User Accounts")}</h2>
          <p>{t("Admins can add, update, or remove user access.")}</p>
          <ul>
            
            <li>{t("Assign Admin, or Service Provider roles")}</li>
            <li>{t("Assign a provider to their service")}</li>
          </ul>
        </section>

        {/* SECTION 4 - Tutorial Video */}
        <section className="about-section tutorial">
          <h2>{t("Admin Tutorial Video")}</h2>
          <p>{t("Watch this tutorial to understand all admin workflows.")}</p>


          <div style={{ position: 'relative', paddingBottom: 'calc(47.864583333333336% + 41px)', height: '0', width: '100%' }}>
            <iframe
              src="https://demo.arcade.software/XAWv1rhFL7FQOEmvqCkZ?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
              title="Admin Tutorial"
              frameBorder="0"
              loading="lazy"
              allowFullScreen
              allow="clipboard-write"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
            />
          </div>

        </section>
      </div>
    </div>
  );
}

export default AdminTutorialPage;
