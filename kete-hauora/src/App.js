import "./global-colors.css";
import "./global-fonts.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import HomePage from "./components/homepage/Homepage.jsx";
import AboutPage from "./components/about/About.jsx";
import LoginPage from "./components/login/Login.jsx";
import RegisterPage from "./components/login/Register.jsx";
import AddOrganisationForm from "./components/admin/AddOrganisationForm.jsx";
import EditOrganisationForm from "./components/admin/EditOrganisationForm.jsx";
import Organisation from "./components/organisation/Organisation.jsx";
import Navbar from "./components/navbar/navbar.js";
import NotFound from "./components/notfound/NotFound.jsx";
import ManageAccounts from "./components/admin/ManageAccounts.jsx";
import Services from "./components/services/Services.jsx";
import { FiltersProvider } from "./context/FiltersContext.jsx";
import SuperAdminDashboard from "./components/admin/SuperAdminDashboard.jsx";
import ProviderDashboard from "./components/admin/ProviderDashboard.jsx";
import ManageCategories from "./components/admin/ManageCategories.jsx";
import ContactPage from "./components/contact/Contact.jsx";

// Wrapper component to conditionally show Navbar
function AppLayout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/register"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="page-content">{children}</div>
    </>
  );
}

function App() {
  return (
    <FiltersProvider>
      {/*get all of the filters needed*/}
      <Router>
        <AppLayout>
          {/*did this so that the everything would be shifted down from the navbar*/}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/addOrg" element={<AddOrganisationForm />} />
            <Route path="/editOrg" element={<EditOrganisationForm />} />
            <Route path="/manageAccounts" element={<ManageAccounts />} />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/organisation/:companyName"
              element={<Organisation />}
            />
            <Route
              path="/super-admin-dashboard"
              element={<SuperAdminDashboard />}
            />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />

            {/*manage filters*/}
            <Route path="/managecategories" element={<ManageCategories />} />
            <Route path="/manageregions" element={<ManageRegions />} />
            <Route path="/managelanguages" element={<ManageLanguages />} />

            {/*catch all route for any thing that doesn't exist*/}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </Router>
    </FiltersProvider>
  );
}

export default App;
