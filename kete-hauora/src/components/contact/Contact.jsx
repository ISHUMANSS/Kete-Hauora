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
            <strong>{t("Email")}:</strong> info@middlemorefoundation.org.nz
          </p>
          <p>
            <strong>{t("Phone")}:</strong> 09-270-8808
          </p>
          <p>
            <strong>{t("Address")}:</strong> Colvin Complex, Middlemore Hospital, 100 Hospital Road, Otahuhu, Auckland 2025
          </p>
          <p>
            <strong>{t("Website")}:</strong> 
            <a
                  href="https://www.middlemorefoundation.org.nz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                   https://www.middlemorefoundation.org.nz/
                </a>
          </p>
        </div>

        {/* Placeholder Section for Optional Content */}
        <div className="contact-extra">
          <h2>{t("Created By")}</h2>
          <p>
            {t(
              "Final Year Auckland University of Technology Computer Science Students"
            )}
          </p>
          <div className="creator-block">
            <h3>{t("Project Team")}</h3>

            <div className="creator">
              <p><strong>{t("Name")}:</strong> Alister Faid</p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/alister-faid-1bb64531b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                linkedin.com/in/alister-faid-1bb64531b
                </a>
              </p>
            </div>
            <div className="creator">
              <p><strong>{t("Name")}:</strong> Flynn Butler</p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/flynn-b-925944236/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                https://www.linkedin.com/in/flynn-b-925944236/
                </a>
              </p>
            </div>
            <div className="creator">
              <p><strong>{t("Name")}:</strong> Tuitauofiti Galuvao - Chu Shing</p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/tuitauofiti-galuvao-chu-shing-196658357/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                https://www.linkedin.com/in/tuitauofiti-galuvao-chu-shing-196658357/
                </a>
              </p>
            </div>
            <div className="creator">
              <p><strong>{t("Name")}:</strong> Kimju Teung</p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/kimju-teung-a0027b399/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                https://www.linkedin.com/in/kimju-teung-a0027b399/
                </a>
              </p>
            </div>
            <div className="creator">
              <p><strong>{t("Name")}:</strong> Christopher Miller</p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/flynn-b-925944236/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                Chris Linkedin
                </a>
              </p>
            </div>


           
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
