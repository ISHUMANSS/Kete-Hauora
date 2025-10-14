import "./Contact.css";
import Navbar from "../navbar/navbar";
import { useTranslation } from "react-i18next";

function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="contact">
      <Navbar />

      <section className="contact-hero">
        <h1>{t("Contact Us")}</h1>
        <p>
          {t("Reach out to the Kete Hauora team for any queries or support.")}
        </p>
      </section>

      <div className="contact-content">
        {/* Contact Info Section */}
        <div className="contact-info">
          <h2>{t("Contact Information")}</h2>
          <p>
            <strong>{t("Email")}:</strong> example@example.com
          </p>
          <p>
            <strong>{t("Phone")}:</strong> +64 9 XXX XXXX
          </p>
          <p>
            <strong>{t("Address")}:</strong> 123 Example Street, Auckland
          </p>
        </div>

        {/* Placeholder Section for Optional Content */}
        <div className="contact-extra">
          <h2>{t("Other Info")}</h2>
          <p>
            {t(
              "Additional information or instructions for contacting the team can go here."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
