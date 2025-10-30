import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AddOrganisationForm.css";
import { toast } from "react-toastify";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("services").insert([
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
    ]);

    if (error) {
      toast.error("Failed to add organisation: " + error.message);
    } else {
      toast.success("Organisation created!");
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
