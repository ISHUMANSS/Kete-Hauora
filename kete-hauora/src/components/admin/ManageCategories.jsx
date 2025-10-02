/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import Navbar from '../navbar/navbar';
import './ManageCategories.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [assigningRowId, setAssigningRowId] = useState(null);
  const [assignedServiceIds, setAssignedServiceIds] = useState(new Set());
  const [pendingAssignedServiceIds, setPendingAssignedServiceIds] = useState(new Set());
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState(null);

  const navigate = useNavigate();

  // Fetch categories & services
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: cats, error: catsErr } = await supabase
        .from('categories')
        .select('*, service_categories(service_id)')
        .order('category_id', { ascending: true });
      if (catsErr) throw catsErr;

      const { data: svcs, error: svcsErr } = await supabase
        .from('services')
        .select('*')
        .order('company_name', { ascending: true });
      if (svcsErr) throw svcsErr;

      setCategories(cats || []);
      setServices(svcs || []);
    } catch (err) {
      console.error('fetchData error:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAssignedServiceNames = (cat) => {
    if (!cat.service_categories || cat.service_categories.length === 0) return 'None';
    const names = services
      .filter(svc =>
        cat.service_categories.some(sc => Number(sc.service_id) === Number(svc.service_id))
      )
      .map(svc => svc.company_name);
    return names.join(', ');
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return alert('Category name is required');

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({ category: trimmed })
          .eq('category_id', editingCategory.category_id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{ category: trimmed }]);
        if (error) throw error;
      }
      setNewCategory('');
      setEditingCategory(null);
      await fetchData();
    } catch (err) {
      console.error('Error saving category:', err.message || err);
      alert('Error saving category: ' + (err.message || err));
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await supabase.from('service_categories').delete().eq('category_id', id);
      await supabase.from('categories').delete().eq('category_id', id);
      await fetchData();
    } catch (err) {
      console.error('Error deleting category:', err.message || err);
      alert('Error deleting category: ' + (err.message || err));
    }
  };

  const toggleAssignRow = async (categoryId) => {
    if (assigningRowId === categoryId) {
      setAssigningRowId(null);
      setAssignedServiceIds(new Set());
      setPendingAssignedServiceIds(new Set());
      return;
    }

    setAssigningRowId(categoryId);
    setAssignError(null);
    setAssignLoading(true);

    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('service_id')
        .eq('category_id', categoryId);

      if (error) throw error;

      const assignedIds = new Set((data || []).map(d => Number(d.service_id)));
      setAssignedServiceIds(assignedIds);
      setPendingAssignedServiceIds(new Set(assignedIds));
    } catch (err) {
      console.error(err);
      setAssignError('Failed to load assigned services');
      setAssignedServiceIds(new Set());
      setPendingAssignedServiceIds(new Set());
    } finally {
      setAssignLoading(false);
    }
  };

  const togglePendingService = (serviceId) => {
    const idNum = Number(serviceId);
    setPendingAssignedServiceIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idNum)) newSet.delete(idNum);
      else newSet.add(idNum);
      return newSet;
    });
  };

  const saveAssignments = async (categoryId) => {
    if (!categoryId) return;
    setAssignLoading(true);
    try {
      const currentAssigned = Array.from(assignedServiceIds);
      const pending = Array.from(pendingAssignedServiceIds);

      const toDelete = currentAssigned.filter(id => !pending.includes(id));
      if (toDelete.length > 0) {
        const { error } = await supabase
          .from('service_categories')
          .delete()
          .in('service_id', toDelete)
          .eq('category_id', categoryId);
        if (error) throw error;
      }

      const toInsert = pending.filter(id => !currentAssigned.includes(id));
      if (toInsert.length > 0) {
        const { error } = await supabase
          .from('service_categories')
          .insert(toInsert.map(service_id => ({ category_id: categoryId, service_id })));
        if (error) throw error;
      }

      setAssignedServiceIds(new Set(pending));
      alert('Assignments saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save assignments: ' + (err.message || err));
    } finally {
      setAssignLoading(false);
    }
  };

  const cancelAssignments = () => {
    setPendingAssignedServiceIds(new Set(assignedServiceIds));
  };

  return (
    <div className="manage-categories-page">
      <Navbar />
      <div className="manage-categories-container">
        <button className="btn-secondary back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="page-title">Manage Categories</h1>

        {/* Add/Edit Form */}
        <div className="form-wrapper">
          <div className="form-card">
            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSaveCategory} className="category-form">
              <input
                type="text"
                className="input-box"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Add'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => { setEditingCategory(null); setNewCategory(''); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Categories Table */}
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Assigned Services</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <React.Fragment key={cat.category_id}>
                  <tr>
                    <td>{cat.category_id}</td>
                    <td>{cat.category}</td>
                    <td>{getAssignedServiceNames(cat)}</td>
                    <td className="action-buttons">
                      <button className="btn-edit" onClick={() => { setEditingCategory(cat); setNewCategory(cat.category); }}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteCategory(cat.category_id)}>Delete</button>
                      <button className="btn-assign" onClick={() => toggleAssignRow(cat.category_id)}>
                        {assigningRowId === cat.category_id ? 'Close' : 'Assign'}
                      </button>
                    </td>
                  </tr>

                  {assigningRowId === cat.category_id && (
                    <tr>
                      <td colSpan={4}>
                        {assignLoading ? (
                          <p>Loading...</p>
                        ) : (
                          <div className="services-assign-container" >
                            {services.map(svc => (
                              <label key={svc.service_id} className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={pendingAssignedServiceIds.has(Number(svc.service_id))}
                                  onChange={() => togglePendingService(Number(svc.service_id))}
                                />
                                <span>{svc.company_name}</span>
                              </label>
                            ))}

                            {/* Save & Cancel buttons at the bottom */}
                            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                className="btn-primary"
                                onClick={() => saveAssignments(cat.category_id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn-secondary"
                                onClick={cancelAssignments}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                        {assignError && <p className="error-text">{assignError}</p>}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
