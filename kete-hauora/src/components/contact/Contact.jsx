import "./Contact.css";

import Navbar from "../navbar/navbar";

//import { useTranslation } from 'react-i18next';

function ContactPage() {
  //const { t } = useTranslation();

  return (
    <div className="contact">
      <Navbar />

      <div className="contact-content">
        <h1>Contact Us</h1>
      </div>
    </div>
  );
}

export default ContactPage;
