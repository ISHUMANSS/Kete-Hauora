//reusable compoent for adding and deleting filters

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import Navbar from "../navbar/navbar";
import "./ManageFilters.css";
import { useFilters } from "../../context/FiltersContext";
import FilterAssignmentPanel from "./FilterAssignmentPanel";

const ManageFilters = ({ title, tableName, idField, nameField, joinTable }) => {
  const { categories, languages, regions, loading } = useFilters();
  const [newFilter, setNewFilter] = useState("");
  const [editingFilter, setEditingFilter] = useState(null);
  const [assigningFilter, setAssigningFilter] = useState(null);

  const navigate = useNavigate();

  //pick which filters to show based on the table name
  const filters =
    tableName === "categories"
      ? categories
      : tableName === "languages"
      ? languages
      : tableName === "region"
      ? regions
      : [];

  // ------------------ SAVE / UPDATE FILTER ------------------
  const handleSaveFilter = async (e) => {
    e.preventDefault();
    const trimmed = newFilter.trim();
    if (!trimmed) return alert("Name is required");

    try {
      if (editingFilter) {
        const { error } = await supabase
          .from(tableName)
          .update({ [nameField]: trimmed })
          .eq(idField, editingFilter[idField]);
        if (error) throw error;
      } else {
        const newRecord = { [nameField]: trimmed };

        // 2. Log it to the console to debug.
        console.log("Attempting to insert:", newRecord);

        // 3. Send the new object to Supabase.
        const { error } = await supabase.from(tableName).insert(newRecord);
        
        if (error) throw error;
      }
      alert(`${title} saved successfully!`);
      setNewFilter("");
      setEditingFilter(null);
      //trigger a manual refresh in your context would be better but for now we just reload
      window.location.reload(); //this re fetchs the context data
    } catch (err) {
      console.error("Error saving:", err.message);
      alert("Error saving: " + err.message);
    }
  };

  // ------------------ DELETE FILTER ------------------
  const handleDeleteFilter = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await supabase.from(joinTable).delete().eq(idField, id);
      await supabase.from(tableName).delete().eq(idField, id);
      alert(`${title} deleted successfully.`);
      window.location.reload(); //re fetch context data on reload
    } catch (err) {
      console.error("Error deleting:", err.message);
      alert("Error deleting: " + err.message);
    }
  };

  if (loading) return <p>Loading {title}...</p>;

  return (
    <div className="manage-categories-page">
      <Navbar />
      <div className="manage-categories-container">
        <button className="btn-secondary back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">{title}</h1>

        {/* Add/Edit Form */}
        <div className="form-wrapper">
          <div className="form-card">
            <h2>{editingFilter ? `Edit ${title.slice(7, -1)}` : `Add ${title.slice(7, -1)}`}</h2>
            <form onSubmit={handleSaveFilter} className="category-form">
              <input
                type="text"
                className="input-box"
                value={newFilter}
                onChange={(e) => setNewFilter(e.target.value)}
                placeholder={`Enter ${title.slice(7, -1)} name`}
              />
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingFilter ? "Update" : "Add"}
                </button>
                {editingFilter && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingFilter(null);
                      setNewFilter("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        {filters.length === 0 ? (
          <p>No {title} found.</p>
        ) : (
          <div className="filter-grid">
                {filters.map((item) => (
                <div key={item[idField]} className="filter-card">
                    <h3>{item[nameField]}</h3>
                    <div className="action-buttons">
                    <button
                        className="btn-edit"
                        onClick={() => {
                        setEditingFilter(item);
                        setNewFilter(item[nameField]);
                        }}
                    >
                        Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteFilter(item[idField])}>
                        Delete
                    </button>
                    <button className="btn-assign" onClick={() => setAssigningFilter(item)}>
                        Assign
                    </button>
                    </div>
                </div>
                ))}
            </div>
        )}

        {/* Assignment Panel */}
        {assigningFilter && (
          <div className="overlay">
            <div className="overlay-content">
              <FilterAssignmentPanel
                title={title}
                table={joinTable}
                idField={idField}
                selectedFilter={{
                  ...assigningFilter,
                  name: assigningFilter[nameField],
                }}
                onClose={() => {
                  setAssigningFilter(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFilters;
