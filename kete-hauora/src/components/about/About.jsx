import React from 'react';
import './AboutPage.css';
import Navbar from '../navbar/navbar';

import { useTranslation } from 'react-i18next';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about">
      <Navbar />
      <div className="about-content">
        <h1>{t("Welcome to Te Kete Hauora")}</h1>
        <p>
          {t("Te Kete Hauora is a wellness service directory that connects whānau, individuals, and health professionals with a wide range of services across Counties Manukau. It helps people find support that suits their needs and empowers communities to take control of their wellbeing.")}
        </p>

        <section className="about-section">
          <h2>{t("Our Purpose")}</h2>
          <p>
            {t("We aim to encourage engagement with wellbeing services that meet cultural, social, spiritual, and health needs. This work aligns with Te Whatu Ora Counties Manukau’s vision for equity and service integration.")}
          </p>
        </section>

        <section className="about-section">
          <h2>{t("Guiding Framework")}</h2>
          <p>
            {t("Te Kete Hauora is grounded in")} <strong>Te Whare Tapa Whā</strong>,
            {t(" a Māori health model developed by Sir Mason Durie. It describes wellbeing through four interconnected pou (pillars):")}
          </p>
          <ul>
            <li><strong>Taha Wairua</strong> – Spiritual wellbeing</li>
            <li><strong>Taha Hinengaro</strong> – Mental & emotional wellbeing</li>
            <li><strong>Taha Tinana</strong> – Physical wellbeing</li>
            <li><strong>Taha Whānau</strong> – Family & social wellbeing</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>{t("Our Values")}</h2>
          <p>
            {t("Guided by the values of Te Whatu Ora Counties Manukau:")}
          </p>
          <ul>
            <li><strong>Manaakitanga</strong> – Caring for people’s wellbeing</li>
            <li><strong>Rangatiratanga</strong> – Excellence, safety, professionalism</li>
            <li><strong>Whakawhanaungatanga</strong> – Inclusion and connection</li>
            <li><strong>Kotahitanga</strong> – Working together as one</li>
          </ul>
        </section>

        <section className="about-section disclaimer">
          <h2>{t("Disclaimer")}</h2>
          <p>
            {t("This project was created in partnership with Auckland University of Technology Bachelor of Computer & Information Sciences Research & Development Project.")}
          </p>
          <p>
            {t("While all due care and diligence has been taken by the students and AUT, these projects are undertaken in the course of student instruction. There is no guarantee of success, and clients assume a degree of risk as part of an arrangement intended to be of mutual benefit.")}
          </p>
          <p>
            {t("On completion, it is hoped that the client will receive a professionally documented and soundly constructed working software application or artefact, while students gain valuable exposure to live environments and real-world problems.")}
          </p>
          <p>
            {t("Consequently, the students and AUT disclaim responsibility and offer no warranty regarding the technology solution or services delivered, both in relation to their use and the results from their use.")}
          </p>
        </section>


        <section className="about-section tutorial">
          <h2>{t("Tutorial Video")}</h2>

          <div className="video-placeholder">
            <p>{t("A short tutorial video will be added here to help you navigate Te Kete Hauora.")}</p>
          </div>
          {/* interactive iframe tutorial */}

            <div style={{ position: 'relative', paddingBottom: 'calc(47.864583333333336% + 41px)', height: '0', width: '100%' }}>
            <iframe
              src="https://demo.arcade.software/TzGnZ1QQTBHBoReuu8Yp?embed&embed_mobile=inline&embed_desktop=inline&show_copy_link=true"
              title="Search and Filter for Health Services in Te Kete Hauora"
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

export default AboutPage;
