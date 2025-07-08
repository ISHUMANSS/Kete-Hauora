
import './App.css';

import supabase from './config/supabaseClient.js';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import HomePage from './components/homepage/Homepage.jsx';
import AboutPage from './components/about/About.jsx';
import LoginPage from './components/login/Login.jsx';
import AdminPage from './components/admin/Admin.jsx';
import RegisterPage from './components/login/Register.jsx';
import AddOrganisationForm from './components/admin/AddOrganisationForm.jsx';
import EditOrganisationForm from './components/admin/EditOrganisationForm.jsx';
import Organisation from './components/organisation/Organisation.jsx';
import Navbar from './components/navbar/navbar.js';



function App() {
  return (

    <Router>
      <Navbar />
      {/*did this so that the everything would be shifted down from the navbar*/}
      <div className='page-content'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/admin" element={<AdminPage />}/>{/*make it so that users have to be loged in to be able to use this with protected routes*/}
          <Route path="/addOrg" element={<AddOrganisationForm />} />
          <Route path="/editOrg/:companyName" element={<EditOrganisationForm />} />

          <Route path="/organisation/:companyName" element={<Organisation />}/>

        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
