import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import "./Organisation.css";
import { useTranslation } from "react-i18next";

function Organisation() {
  const { t, i18n } = useTranslation();

  const { companyName } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [serviceTranslation, setServiceTranslation] = useState(null);

  

  useEffect(() => {
    const fetchService = async () => {
      try {
        // Fetch service data by company name
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("company_name", companyName)
          .single();

        if (error) {
          console.error("Error fetching service:", error);
          setService(null);
          setLoading(false);
          return; // Stop here if no data
        }

        setService(data);

        // ✅ Only fetch translation if service exists
        if (data && data.service_id) {
          const { data: translationData, error: translationError } =
            await supabase
              .from("service_translations")
              .select("services_offered_maori")
              .eq("service_id", data.service_id)
              .single();

          if (translationError) {
            console.error("Error fetching translation:", translationError);
          } else {
            setServiceTranslation(
              translationData?.services_offered_maori || null
            );
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [companyName]);

  //format the websites so they always open as the website rather then as in the site
  const formatWebsite = (url) => {
    if (!url) return null;
    //if url starts with http:// or https:// its fine leave it
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    //add https://
    return `https://${url}`;
  };

  if (loading) return <p>{t("Loading organisation...")}</p>;
  if (!service) return <p>{t("Organisation not found")}.</p>;



  //set up so there is a fall back logo which can be used
  const fallbackLocalLogo = `/services_logo/${service.company_name}.png`;


  return (
    <div className="organisation-page">
      {/*for if we want to add that sidebar of like related links that we have in the figma
            <aside className="sidebar">
                
            </aside>
            */}

      <div className="back-container">
        <Link to="/services" className="back-button">
          ← {t("Back to Services")}
        </Link>
      </div>

      <main className="organisation-content">
        <header className="organisation-header">
          <img
            src={
              service.company_logo_path
                ? supabase.storage
                    .from("Pictures")
                    .getPublicUrl(service.company_logo_path).data.publicUrl
                : fallbackLocalLogo
            }
            alt={`${service.company_name} logo`}
            className="organisation-logo"
            onError={(e) => {
              

              // First fallback: local stored image
              if (e.target.src.includes("Pictures")) {
                e.target.src = fallbackLocalLogo;
                return;
              }

              // Final fallback: default logo
              e.target.src = "/services_logo/Default.png";
            }}
          />


          <h1>{service.company_name}</h1>
        </header>

        <section className="organisation-details">
          <div className="contact-info">
            <p>
              <strong>{t("Phone")}:</strong> {service.phone || "N/A"}
            </p>
            <p>
              <strong>{"Email"}:</strong> {service.email || "N/A"}
            </p>

            <p>
              <strong>{t("Website")}:</strong>{" "}
              <a
                href={formatWebsite(service.website)}
                target="_blank"
                rel="noreferrer"
              >
                {service.website}
              </a>
            </p>
            <p>
              <strong>{t("Physical Address")}:</strong>{" "}
              {service.physical_address}
            </p>
            <p>
              <strong>{t("Languages")}:</strong> {service.languages}
            </p>
          </div>
          <div className="extra-info">
            <p>
              <strong>{t("Operating Hours")}:</strong> {service.hours}
            </p>
            <p>
              <strong>{t("Cost")}:</strong> {service.cost}
            </p>
            <p>
              <strong>{t("Referral")}:</strong> {service.referral}
            </p>
            <p>
              <strong>{t("Other Notes")}:</strong> {service.other_notes}
            </p>
          </div>
        </section>

        <section className="services-offered">
          <h2>{t("Services Offered")}</h2>
          <div className="services-list">
            {/*if current language is maori and a translation exists then displays that version*/}
            {i18n.language === "mi" && serviceTranslation ? (
              serviceTranslation
                .split("\n")
                .map((item, idx) => <p key={idx}>• {item.trim()}</p>)
            ) : service.services_offered ? (
              service.services_offered
                .split("\n")
                .map((item, idx) => <p key={idx}>• {item.trim()}</p>)
            ) : (
              <p>{t("No services listed")}.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Organisation;
