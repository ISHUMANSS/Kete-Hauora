//reusable compoent for adding and deleting filters

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import Navbar from "../navbar/navbar";
import "./ManageFilters.css";
import { useFilters } from "../../context/FiltersContext";
import FilterAssignmentPanel from "./FilterAssignmentPanel";
import { toast } from "react-toastify";

const ManageFilters = ({ title, tableName, itemName, idField, nameField, joinTable }) => {
  //allows for the scroll
  const formRef = useRef(null);

  const { categories, languages, regions, loading: filtersLoading, refreshFilters  } = useFilters();
  const [newFilter, setNewFilter] = useState("");
  const [editingFilter, setEditingFilter] = useState(null);
  const [assigningFilter, setAssigningFilter] = useState(null);

  

  const navigate = useNavigate();


  //Auth state
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  //Get current user role
  useEffect(() => {
    async function fetchUserAndRole() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (!profileError && profileData) {
        setRoleId(profileData.role_id);
      }
      setLoading(false);
    }

    fetchUserAndRole();
  }, []);

  //go to the top when editing
  const scrollToForm = () => {
    if (!formRef.current) return;
    const topOffset = 300; //adjust for navbar height
    const elementPosition = formRef.current.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - topOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

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
    if (!trimmed) return toast.warn("Name is required");

    try {
      if (editingFilter) {
        const { error } = await supabase
          .from(tableName)
          .update({ [nameField]: trimmed })
          .eq(idField, editingFilter[idField]);
        if (error) throw error;
      } else {
        const newRecord = { [nameField]: trimmed };
        const { error } = await supabase.from(tableName).insert(newRecord);

        if (error) throw error;
      }
      toast.success(`${title} saved successfully!`);
      setNewFilter("");
      setEditingFilter(null);
      //refresh filters without page reload
      await refreshFilters();
    } catch (err) {
      console.error("Error saving:", err.message);
      toString.error("Error saving: " + err.message);
    }
  };

  // ------------------ DELETE FILTER ------------------
  const handleDeleteFilter = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await supabase.from(joinTable).delete().eq(idField, id);
      await supabase.from(tableName).delete().eq(idField, id);
      toast.success(`${title} deleted successfully.`);
      await refreshFilters();
    } catch (err) {
      console.error("Error deleting:", err.message);
      toast.error("Error deleting: " + err.message);
    }
  };

  
  // Auth checks
  if (loading || filtersLoading) return <p>Loading {title}...</p>;
  
  if (roleId !== 1) {
    return (
      <>
        <Navbar />
        <div className="manage-categories-container">
          <p>You must be a super admin to access this page.</p>
          <Link to="/">Go to homepage</Link>
        </div>
      </>
    );
  }

  return (
    <div className="manage-categories-page">
      <Navbar />
      <div className="manage-categories-container">
        <button className="btn-secondary back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">{title}</h1>

        {/* Add/Edit Form */}
        <div className="form-wrapper" ref={formRef}>
          <div className="form-card">
            <h2>{editingFilter ? `Edit ${itemName}` : `Add ${itemName}`}</h2>
            <form onSubmit={handleSaveFilter} className="category-form">
              <input
                type="text"
                className="input-box"
                value={newFilter}
                onChange={(e) => setNewFilter(e.target.value)}
                placeholder={`Enter ${itemName} name`}
              />
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingFilter ? `Edit ${itemName}` : `Add ${itemName}`}
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

                        scrollToForm();
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
