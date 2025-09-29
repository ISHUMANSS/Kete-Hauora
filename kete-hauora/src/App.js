
import './App.css';

//import supabase from './config/supabaseClient.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/homepage/Homepage.jsx';
import AboutPage from './components/about/About.jsx';
import LoginPage from './components/login/Login.jsx';
// import AdminPage from './components/admin/Admin.jsx';
import RegisterPage from './components/login/Register.jsx';
import AddOrganisationForm from './components/admin/AddOrganisationForm.jsx';
import EditOrganisationForm from './components/admin/EditOrganisationForm.jsx';
import Organisation from './components/organisation/Organisation.jsx';
import Navbar from './components/navbar/navbar.js';
import NotFound from './components/notfound/NotFound.jsx';
import ManageAccounts from './components/admin/ManageAccounts.jsx';
import Services from './components/services/Services.jsx';
import { FiltersProvider } from './context/FiltersContext.jsx';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard.jsx';
import ProviderDashboard from './components/admin/ProviderDashboard.jsx';
import ManageCategories from './components/admin/ManageCategories.jsx';
import ContactPage from './components/contact/Contact.jsx';


function App() {
  return (
    <FiltersProvider>{/*get all of the filters needed*/}
      <Router>
        <Navbar />
        {/*did this so that the everything would be shifted down from the navbar*/}
        <div className='page-content'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/addOrg" element={<AddOrganisationForm />} />
            <Route path="/editOrg" element={<EditOrganisationForm />} />
            <Route path="/manageAccounts" element={<ManageAccounts />} />

            <Route path='/contact' element={<ContactPage />} />

            <Route path="/services" element={<Services />} />

            <Route path="/organisation/:companyName" element={<Organisation />}/>

            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/managecategories" element={<ManageCategories />} />

            {/*catch all route for any thing that doesn't exist*/}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </div>
      </Router>
    </FiltersProvider>
    
  );
}

export default App;
