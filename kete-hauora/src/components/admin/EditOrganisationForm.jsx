/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import "./EditOrganisationForm.css";
import { toast } from "react-toastify";
import { useFilters } from "../../context/FiltersContext";

function EditOrganisationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgData, setOrgData] = useState({
    company_name: "",
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


  //set up the edit filters for that service
  const { categories, languages, regions} = useFilters();

  //set what filters are selected 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  //collapsible states for filter sections
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);



  const fieldDescriptions = {
    company_name: "The official name of the organisation or service provider.",
    phone: "Include full phone number with area code (e.g., 09 123 4567).",
    email: "Enter the primary contact email for this organisation.",
    website: "Include the full website link (e.g., https://www.example.com).",
    physical_address: "Full physical address of the organisation.",
    hours: "Provide opening hours (e.g., Mon–Fri 9am–5pm, Sat 10am–2pm).",
    sites: "Describe all locations where the service is offered. Multiple lines are allowed (e.g., offices, client homes, community centres).",
    languages: "List all available languages separated by commas.",
    cost: "Enter cost as a range or note (e.g., Free, $10–$30 per session).",
    services_offered: "Enter each service on a new line — each line becomes a bullet point on the service page.",
    referral: "State whether clients can self-refer or if a referral is required.",
    other_notes: "Add any additional details about the organisation.",
    cost_tf: "Used for filtering services by type — select whether the service is Free, Paid, or Other."
  };

  // Get user role
  useEffect(() => {
    async function getUserRole() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return setLoading(false);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (!profileError && profileData) setRoleId(profileData.role_id);
      setLoading(false);
    }
    getUserRole();
  }, []);

  // Fetch organisations
  useEffect(() => {
    async function fetchOrgs() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      if (roleId === 1) {
        // Super admin all access
        const { data: orgs, error: orgError } = await supabase
          .from("services")
          .select("*");
        if (!orgError) setResults(orgs);
      } else if (roleId === 2) {
        // Service provider only sees assigned org
        const { data: assigned, error: assignError } = await supabase
          .from("user_organisation")
          .select("organisation_id")
          .eq("user_id", user.id);

        if (!assignError && assigned.length > 0) {
          const orgIds = assigned.map((a) => a.organisation_id);
          const { data: orgs, error: orgError } = await supabase
            .from("services")
            .select("*")
            .in("service_id", orgIds);
          if (!orgError && orgs.length > 0) {
            setSelectedOrg(orgs[0]);
            setOrgData({
              company_name: orgs[0].company_name || "",
              phone: orgs[0].phone || "",
              email: orgs[0].email || "",
              website: orgs[0].website || "",
              physical_address: orgs[0].physical_address || "",
              hours: orgs[0].hours || "",
              sites: orgs[0].sites || "",
              languages: orgs[0].languages || "",
              cost: orgs[0].cost || "",
              services_offered: orgs[0].services_offered || "",
              referral: orgs[0].referral || "",
              other_notes: orgs[0].other_notes || "",
            });

            //get the curret filters assigned
            loadFilterSelections(orgs[0].service_id);
          }
        }
      }
    }

    //get the assigned filters for this service
    async function loadFilterSelections(serviceId) {
      try {
        const [{ data: cats }, { data: regs }, { data: langs }] = await Promise.all([
          supabase.from("service_categories").select("category_id").eq("service_id", serviceId),
          supabase.from("service_regions").select("region_id").eq("service_id", serviceId),
          supabase.from("service_languages").select("language_id").eq("service_id", serviceId),
        ]);

        setSelectedCategories(cats.map((x) => x.category_id));
        setSelectedRegions(regs.map((x) => x.region_id));
        setSelectedLanguages(langs.map((x) => x.language_id));
      } catch (err) {
        console.error(err);
      }
    }

    if (roleId) fetchOrgs();
  }, [roleId]);

  if (loading) return <p>Loading...</p>;
  if (![1, 2].includes(roleId)) {
    return (
      <>
        <p>You must be an admin to edit an organisation.</p>
        <Link to="/">Go to homepage</Link>
      </>
    );
  }

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrgData({ ...orgData, [name]: value });
  };

  // Select organisation (super admin)
  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
    setOrgData({
      company_name: org.company_name || "",
      phone: org.phone || "",
      email: org.email || "",
      website: org.website || "",
      physical_address: org.physical_address || "",
      hours: org.hours || "",
      sites: org.sites || "",
      languages: org.languages || "",
      cost: org.cost || "",
      cost_tf: org.cost_tf ?? null,
      services_offered: org.services_offered || "",
      referral: org.referral || "",
      other_notes: org.other_notes || "",
    });
    // Keep searchInput visible, but clear the search text
    setSearchInput("");
  };


  //handle deleting a service
  const handleDelete = async (serviceId) => {

    //set up diffrent messages depending on role;
    const message = roleId === 1
      ? "Are you sure you want to delete this organisation? This will permanently delete the organisation and all related data. This cannot be undone."
      : "Are you sure you want to delete this organisation? You will no longer be able to access it. This cannot be undone.";

    if (!window.confirm(message)) {
      return;
    }

    try {
      //delete child tables
      //gets rid of the foreign keys
      await supabase.from("service_regions").delete().eq("service_id", serviceId);
      await supabase.from("service_languages").delete().eq("service_id", serviceId);
      await supabase.from("service_categories").delete().eq("service_id", serviceId);
      await supabase.from("service_translations").delete().eq("service_id", serviceId);

      //delete the service
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("service_id", serviceId);

      if (error) throw error;

      toast.success("Organisation deleted successfully!");
      //navigate to the correct admin dashboard
      goToDashboard(roleId);
    } catch (err) {
      toast.error("Delete failed: " + err.message);
    }
  };


  //navigate to the correct dash depending on role
  const goToDashboard = (roleId) => {
    if (roleId === 1) navigate("/super-admin-dashboard");
    else if (roleId === 2) navigate("/provider-dashboard");
    else navigate("/");
  };

  //allow for edits in the service
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrg) return toast.warn("No organisation selected.");

    const { error } = await supabase
      .from("services")
      .update(orgData)
      .eq("service_id", selectedOrg.service_id);

    if (error) {
      toast.error("Update failed: " + error.message);
      return;
    }

    //update filter relationships
    await updateFilters(selectedOrg.service_id);

    toast.success("Organisation updated!");
        
  };

  async function updateFilters(serviceId) {
    try {
      //delete existing
      await supabase.from("service_categories").delete().eq("service_id", serviceId);
      await supabase.from("service_regions").delete().eq("service_id", serviceId);
      await supabase.from("service_languages").delete().eq("service_id", serviceId);

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

    } catch (err) {
      console.error(err);
      toast.error("Failed to update filters.");
    }
  }



  //rest the form
  const handleClearSelection = () => {
    setSelectedOrg(null);
    setOrgData({
      company_name: "",
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
  };

  //change the assiged filters by toggling them on and off
  //toggle category
  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  //toggle region
  const toggleRegion = (id) => {
    setSelectedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  //toggle language
  const toggleLanguage = (id) => {
    setSelectedLanguages((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };



  return (
    <>
      <div className="edit-org-page">
        <div className="edit-org-card">
          <button className="edit-org-back" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className="edit-org-title">Edit Organisation</h1>
          <p className="edit-org-subtitle">Update organisation details below</p>

          {/* Super admin search stays visible */}
          {roleId === 1 && (
            <div className="edit-org-search">
              <input
                type="text"
                placeholder="Search organisation..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {results.length > 0 && searchInput && (
                <ul>
                  {results
                  .filter((org) =>
                    org.company_name
                      .toLowerCase()
                      .startsWith(searchInput.toLowerCase())
                  )
                  .map((org) => (
                    <li
                      key={org.service_id}
                      onClick={() => handleSelectOrg(org)}
                    >
                      {org.company_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Selected organisation form */}
          {selectedOrg && (
            <form className="edit-org-form" onSubmit={handleUpdate}>
              <div className="edit-org-fields">
                {[
                  { label: "Organisation Name", name: "company_name" },
                  { label: "Phone", name: "phone" },
                  { label: "Email", name: "email" },
                  { label: "Website", name: "website" },
                  { label: "Physical Address", name: "physical_address" },
                  { label: "Hours", name: "hours" },
                  { label: "Sites", name: "sites", textarea: true },
                  { label: "Languages", name: "languages" },
                  { label: "Cost", name: "cost" },
                  { label: "Referral", name: "referral" },
                ].map((field) => (
                  <div className="form-group" key={field.name}>
                    <label>{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        className="form-textarea"
                        name={field.name}
                        value={orgData[field.name]}
                        onChange={handleChange}
                        rows={field.name === "sites" ? 3 : 2}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        className="form-input"
                        name={field.name}
                        value={orgData[field.name]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {fieldDescriptions[field.name] && (
                      <p className="field-description">{fieldDescriptions[field.name]}</p>
                    )}
                  </div>
                ))}


                <div className="form-group">
                  <label>Services Offered</label>
                  <textarea
                    className="form-textarea"
                    name="services_offered"
                    value={orgData.services_offered}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter services offered"
                  />
                  <p className="field-description">{fieldDescriptions.services_offered}</p>
                </div>

                <div className="form-group">
                  <label>Other Notes</label>
                  <textarea
                    className="form-textarea"
                    name="other_notes"
                    value={orgData.other_notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter any other notes"
                  />
                  <p className="field-description">{fieldDescriptions.other_notes}</p>
                </div>
              </div>
              <div className="form-group">
                <label>Cost Type</label>
                <select
                  className="form-textarea"
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
                >
                  <option value="NULL">Other</option>
                  <option value="FALSE">Free</option>
                  <option value="TRUE">Paid</option>
                </select>
                <p className="field-description">{fieldDescriptions.cost_tf}</p>
              </div>
              


                {/*Still need to assign it so it works for the super and alaso assign it for the add*/}
                {roleId === 2 && (
                <div className="edit-org-filters-container">
                  <label>Assign filters</label>
                  {/* Categories */}
                  <div className="edit-org-filter-section">
                    <div 
                      className="edit-org-filter-header"
                      onClick={() => setCategoriesOpen(!categoriesOpen)}
                    >
                      <h3 className="edit-org-filter-title">Categories</h3>
                      <span className="edit-org-toggle-icon">
                        {categoriesOpen ? "−" : "+"}
                      </span>
                    </div>
                    {categoriesOpen && (
                      <div className="edit-org-filter-box">
                        {categories.map((c) => (
                          <label key={c.category_id} className="edit-org-checkbox">
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
                  <div className="edit-org-filter-section">
                    <div 
                      className="edit-org-filter-header"
                      onClick={() => setRegionsOpen(!regionsOpen)}
                    >
                      <h3 className="edit-org-filter-title">Regions</h3>
                      <span className="edit-org-toggle-icon">
                        {regionsOpen ? "−" : "+"}
                      </span>
                    </div>
                    {regionsOpen && (
                      <div className="edit-org-filter-box">
                        {regions.map((r) => (
                          <label key={r.region_id} className="edit-org-checkbox">
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
                  <div className="edit-org-filter-section">
                    <div 
                      className="edit-org-filter-header"
                      onClick={() => setLanguagesOpen(!languagesOpen)}
                    >
                      <h3 className="edit-org-filter-title">Languages</h3>
                      <span className="edit-org-toggle-icon">
                        {languagesOpen ? "−" : "+"}
                      </span>
                    </div>
                    {languagesOpen && (
                      <div className="edit-org-filter-box">
                        {languages.map((l) => (
                          <label key={l.language_id} className="edit-org-checkbox">
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
              )}
              

              <button className="edit-org-submit" type="submit">
                Save Changes
              </button>
              {roleId === 1 && (
                <button
                  className="edit-org-clear"
                  type="button"
                  onClick={handleClearSelection}
                >
                  Clear Selection
                </button>
              )}
              <button
                className="edit-org-delete"
                type="button"
                onClick={() => handleDelete(selectedOrg.service_id)}
              >
                Delete Organisation
              </button>
            </form>
            
          )}
        </div>
      </div>
    </>
  );
}

export default EditOrganisationForm;
