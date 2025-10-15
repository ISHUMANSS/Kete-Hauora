//reusable pannel for assigning filters
//works for languages, catagoreis, regions

import React, { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";
import { toast } from "react-toastify";

const FilterAssignmentPanel = ({ title, table, idField, selectedFilter, onClose }) => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedServices, setAssignedServices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("service_id, company_name")
        .order("company_name", { ascending: true });
      if (error) return console.error(error);
      setServices(data || []);
    };

    const fetchAssignments = async () => {
      const { data, error } = await supabase
        .from(table)
        .select("service_id")
        .eq(idField, selectedFilter[idField]);
      if (error) return console.error(error);
      setAssignedServices(data.map((d) => d.service_id));
    };

    Promise.all([fetchServices(), fetchAssignments()]).then(() => setLoading(false));
  }, [table, idField, selectedFilter]);

  const handleAddService = (id) => {
    if (!assignedServices.includes(id)) setAssignedServices([...assignedServices, id]);
  };

  const handleRemoveService = (id) => {
    setAssignedServices((prev) => prev.filter((sid) => sid !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from(table).delete().eq(idField, selectedFilter[idField]);
      if (assignedServices.length > 0) {
        const rows = assignedServices.map((service_id) => ({
          [idField]: selectedFilter[idField],
          service_id,
        }));
        await supabase.from(table).insert(rows);
      }
      toast.success("Assignments saved!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save assignments: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = services.filter((s) =>
    s.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="assign-panel">
        
        <div className="assign-header">
            <h3>
            Assign Services to <span>{selectedFilter.name || selectedFilter.category}</span>
            </h3>
            <button className="btn-close" onClick={onClose}>Close</button>
        </div>
        <div className="assign-content">

            <h4>Currently assinged</h4>

            <div className="assigned-tags">
                {assignedServices.map((id) => {
                const svc = services.find((s) => s.service_id === id);
                    return (
                        <span key={id} className="tag">
                        {svc?.company_name}
                        <button onClick={() => handleRemoveService(id)}>×</button>
                        </span>
                    );
                })}
            </div>

            <h4>Assign more</h4>

            <input
                type="text"
                className="search-input"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="service-results-grid">
                {filtered.map((svc) => (
                <div key={svc.service_id} className="service-card">
                    <p>{svc.company_name}</p>
                    <button
                    className="btn-small"
                    onClick={() => handleAddService(svc.service_id)}
                    disabled={assignedServices.includes(svc.service_id)}
                    >
                    Add
                    </button>
                </div>
                ))}
            </div>
        </div>

        <div className="save-section">
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default FilterAssignmentPanel;
