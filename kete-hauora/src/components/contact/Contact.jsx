import './Contact.css';

import Navbar from '../navbar/navbar';

import { useTranslation } from 'react-i18next';

function ContactPage() {
  

  const { t } = useTranslation();

  return (
    <div className="home">
      <Navbar />
      
      <div className="center-container">
        <h1 className='title'>Kete Hauora - {t("Contact page")}</h1>

      </div>
    </div>
  );
}

export default ContactPage;