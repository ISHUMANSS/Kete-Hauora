
# Kete-Hauora

Te Kete Hauora is a wellness service directory that connects whānau, individuals, and health professionals with a wide range of services across Counties Manukau. It helps people find support that suits their needs and empowers communities to take control of their wellbeing.

This version is a digital version of the orginal Te Kete Hauora Wellness Service Directory which was created as a pdf by the Middlemore Foundation. This project was created in partnership with Auckland University of Technology Bachelor of Computer & Information Sciences Research & Development Project, by final year students for the capstone Research and Development Project.

## Table of Contents

- [Kete-Hauora](#kete-hauora)
- [Credits / Partnerships](#credits--partnerships)
- [Project Goals / Problem Statement](#project-goals--problem-statement)
- [Used By](#used-by)
- [Features](#features)
- [Demo](#demo)
- [Screenshots / UI Preview](#screenshots--ui-preview)
- [Tech Stack](#tech-stack)
- [Color Reference](#color-reference)
- [Deployment](#deployment)
- [Run Locally](#run-locally)
- [Environment Variables](#environment-variables)
- [Roadmap / Future Work](#roadmap--future-work)
- [Authors](#authors)
- [Contact / Support](#contact--support)

## Credits / Partnerships


## Project Goals / Problem Statement

The original *Te Kete Hauora* directory existed only as a static PDF document. While useful, it had several limitations:
- Difficult to keep up to date with new or changing services  
- Not mobile-friendly or easily searchable  
- Limited accessibility for diverse communities and languages  

This project aims to solve these issues by creating a "dynamic", digital version of the directory that:  
- Provides a searchable, user-friendly interface  
- Ensures information is kept up-to-date more easily
- Supports multilingual access (starting with Pacific languages)  
- Empowers whānau, individuals, and health professionals to quickly find the right services  
- Strengthens community wellbeing by making resources more visible and accessible  

## Used By

This project is used by the following companies:

- Company 1
- Company 2


## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform


## Demo

Video comming soon


## Screenshots / UI Preview
coming soon
## Tech Stack

**Client:** React, i18next  

**Backend / Database:** Supabase (PostgreSQL, Auth)  

**Deployment:** Netlify  

***Tools & Services***

- **GitHub** – version control and collaboration  
- **Figma** – UI/UX design and prototyping  
- **Trello** – project management and task tracking  
- **Supabase Dashboard** – database and authentication management  
- **Netlify Dashboard** – deployment and hosting  

## Color Reference

This will be where the colour refrence from tui goes
| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Example Color | ![#0a192f](https://via.placeholder.com/10/0a192f?text=+) #0a192f |
| Example Color | ![#f8f8f8](https://via.placeholder.com/10/f8f8f8?text=+) #f8f8f8 |
| Example Color | ![#00b48a](https://via.placeholder.com/10/00b48a?text=+) #00b48a |
| Example Color | ![#00d1a0](https://via.placeholder.com/10/00b48a?text=+) #00d1a0 |

## Deployment

This project is currently deployed on [Netlify](https://ketehauora.netlify.app/).

- **Branch:** Deploys automatically from the `main` branch  
- **Build Command:** `npm run build`  
- **Publish Directory:** `/kete-hauora/build`  
- **Environment Variables:** Make sure all `.env` variables are set in the Netlify dashboard for production  

To redeploy: (currently not active as development is still on going)
- Push changes to the `main` branch, or  
- Trigger a manual deploy via the Netlify dashboard  

## Run Locally

Clone the project

```bash
  git clone https://github.com/ISHUMANSS/Kete-Hauora
```

Go to the project directory

```bash
  cd kete-hauora
```

Install dependencies (as of 12/09/25)

```bash
  npm install
```
```bash
   npm i react-router-dom
```
```bash
  npm i @supabase/supabase-js
```
```bash
  npm install i18next react-i18next i18next-browser-languagedetector --legacy-peer-deps
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_SUPABASE_URL`

`REACT_APP_SUPABASE_ANON_KEY`

## Roadmap / Future Work

The current version was created as the result of an Rearch and Development full year project so time to work on it and the potential scope of the product is more limited then what the project could have been. 

Future development could include:

- **Multilingual Support**  
  - Full support for Pacific languages and Te Reo Māori  
  - User-selectable language preferences  

- **Service Provider Portal**  
  - Allow providers to submit and manage their own listings  
  - Verification and moderation system to ensure accuracy  

- **Enhanced Search & Filtering**  
  - Location-based search to show nearby services  

- **User Accounts**  
  - Save favourite services for quick access  
  - Personalised recommendations

- **Chat Bot**
    - Allow users to message a chat bot to get personalised recommendations

- **Accessibility Improvements**  
  - Compliance with WCAG (Web Content Accessibility Guidelines) standards  
  - Mobile-first enhancements  

- **Community Feedback & Moderation**  
  - Users can suggest corrections or updates  
  - Moderators review and approve changes  

- **Analytics & Reporting**  
  - Insights into which services are most searched  
  - Data to help providers and stakeholders understand community needs  

- **Deployment Enhancements**  
  - Custom domain name and improved hosting configuration  
  - Continuous Integration/Continuous Deployment (CI/CD) pipeline  


## Authors

- [@Is_human](https://github.com/ISHUMANSS) (Alister Faid)
- [@Flynn Butler](https://github.com/flynnB01) (Flynn Butler)
- [@Kimju](https://github.com/DetectiveKimju) (Kimju Teung)
- [@Christopher Miller](https://github.com/Chris-M1) (Christopher Miller)
- [@Tuitauofiti](https://github.com/Tuitauofiti) (Tuitauofiti Galuvao - Chu Shing)


## Contact / Support
