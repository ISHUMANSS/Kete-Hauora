import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AddOrganisationForm.css";
import { toast } from "react-toastify";
import { useFilters } from "../../context/FiltersContext";

function AddOrganisationForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [orgData, setOrgData] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    physical_address: "",
    hours: "",
    sites: "",
    languages: "",
    cost: "",
    services_offered: "",
    referral: "",
    other_notes: "",
  });

  //get filters from context
  const { categories, languages, regions } = useFilters();

  //filter selections
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  //collapsible states for filter sections
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);


  //idk who ever is reading this the person who did this one just did it really weirdly and like i'm not gonna change their work i'm just making it worse
  const fieldDescriptions = {
    name: "The official name of the organisation or service provider.",
    phone: "Include full phone number with area code (e.g., 09 123 4567).",
    website: "Website for the service.",
    hours: "Provide opening hours (e.g., Mon–Fri 9am–5pm, Sat 10am–2pm).",
    languages: "List all available languages separated by commas.",
    cost: "Enter cost as a range or note (e.g., Free, $10–$30 per session).",
    services_offered:
      "Enter each service on a new line (enter) - each line becomes a bullet point on the service page.",
    referral:
      "State whether clients can self-refer or if a referral is required.",
    other_notes: "Add any additional details about the organisation.",
    sites: "Describe the locations where the service is offered. You can include offices, client homes, community centres, and other venues. Use multiple lines if needed.",
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to access this page.</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  //toggle functions for filters
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleRegion = (id) => {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (id) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: newService, error } = await supabase
      .from("services")
      .insert([
      {
        company_name: orgData.name,
        phone: orgData.phone,
        email: orgData.email,
        website: orgData.website,
        physical_address: orgData.physical_address,
        hours: orgData.hours,
        sites: orgData.sites,
        languages: orgData.languages,
        cost: orgData.cost,
        cost_tf: orgData.cost_tf,
        services_offered: orgData.services_offered,
        referral: orgData.referral,
        other_notes: orgData.other_notes,
      },
    ])
    .select();
    if (error) {
      toast.error("Failed to add organisation: " + error.message);
      return;
    }
    //get the newly created service ID
    const serviceId = newService[0].service_id;

    //insert the filters to the new service
    try {
      //insert categories
      if (selectedCategories.length > 0) {
        await supabase.from("service_categories").insert(
          selectedCategories.map((id) => ({
            service_id: serviceId,
            category_id: id,
          }))
        );
      }

      //insert regions
      if (selectedRegions.length > 0) {
        await supabase.from("service_regions").insert(
          selectedRegions.map((id) => ({
            service_id: serviceId,
            region_id: id,
          }))
        );
      }

      //insert languages
      if (selectedLanguages.length > 0) {
        await supabase.from("service_languages").insert(
          selectedLanguages.map((id) => ({
            service_id: serviceId,
            language_id: id,
          }))
        );
      }

      toast.success("Organisation created with filters!");
      navigate("/super-admin-dashboard");
    } catch (filterError) {
      toast.error("Organisation created but failed to add filters: " + filterError.message);
      navigate("/super-admin-dashboard");
    }
  };

  return (
    <>
      <div className="add-org-page">
        <div className="add-org-card">
          <button className="add-org-back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="add-org-title">Add Organisation</h1>
          <p className="add-org-subtitle">
            Fill in organisation details below.
          </p>

          <form className="add-org-form" onSubmit={handleSubmit}>
            {Object.keys(orgData)
              .filter((key) => key !== "cost_tf")
              .map((key) => (
                <div className="form-group" key={key}>
                  <label>
                    {key
                      .replace("_", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                  {key === "services_offered" || key === "other_notes" ? (
                    <textarea
                      name={key}
                      value={orgData[key]}
                      onChange={handleInputChange}
                      rows={key === "services_offered" ? 4 : 3}
                      placeholder={`Enter ${key.replace("_", " ")}`}
                      className="form-textarea"
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={orgData[key]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${key.replace("_", " ")}`}
                      className="form-input"
                    />
                  )}
                  {/* Description under specific fields */}
                  {fieldDescriptions[key] && (
                    <p className="field-description">{fieldDescriptions[key]}</p>
                  )}

                </div>
              ))}

            <div className="form-group">
              <label>Cost Type</label>
              <select
                name="cost_tf"
                value={
                  orgData.cost_tf === true
                    ? "TRUE"
                    : orgData.cost_tf === false
                    ? "FALSE"
                    : "NULL"
                }
                onChange={(e) => {
                  let value = null;
                  if (e.target.value === "TRUE") value = true;
                  else if (e.target.value === "FALSE") value = false;
                  else value = null;
                  setOrgData({ ...orgData, cost_tf: value });
                }}
                className="form-select"
              >
                <option value="NULL">Other</option>
                <option value="FALSE">Free</option>
                <option value="TRUE">Paid</option>
              </select>
               <p className="field-description">
                Used for filtering services by type - select whether the service
                is Free, Paid, or Other.
              </p>
            </div>

            {/* Filter Assignment Section */}
            <div className="add-org-filters-container">
              <label>Assign Filters</label>
              
              {/* Categories */}
              <div className="add-org-filter-section">
                <div 
                  className="add-org-filter-header"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                >
                  <h3 className="add-org-filter-title">Categories</h3>
                  <span className="add-org-toggle-icon">
                    {categoriesOpen ? "−" : "+"}
                  </span>
                </div>
                {categoriesOpen && (
                  <div className="add-org-filter-box">
                    {categories.map((c) => (
                      <label key={c.category_id} className="add-org-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c.category_id)}
                          onChange={() => toggleCategory(c.category_id)}
                        />
                        {c.category}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Regions */}
              <div className="add-org-filter-section">
                <div 
                  className="add-org-filter-header"
                  onClick={() => setRegionsOpen(!regionsOpen)}
                >
                  <h3 className="add-org-filter-title">Regions</h3>
                  <span className="add-org-toggle-icon">
                    {regionsOpen ? "−" : "+"}
                  </span>
                </div>
                {regionsOpen && (
                  <div className="add-org-filter-box">
                    {regions.map((r) => (
                      <label key={r.region_id} className="add-org-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedRegions.includes(r.region_id)}
                          onChange={() => toggleRegion(r.region_id)}
                        />
                        {r.region}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="add-org-filter-section">
                <div 
                  className="add-org-filter-header"
                  onClick={() => setLanguagesOpen(!languagesOpen)}
                >
                  <h3 className="add-org-filter-title">Languages</h3>
                  <span className="add-org-toggle-icon">
                    {languagesOpen ? "−" : "+"}
                  </span>
                </div>
                {languagesOpen && (
                  <div className="add-org-filter-box">
                    {languages.map((l) => (
                      <label key={l.language_id} className="add-org-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedLanguages.includes(l.language_id)}
                          onChange={() => toggleLanguage(l.language_id)}
                        />
                        {l.language}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="add-org-submit">
              Add Organisation
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddOrganisationForm;
