/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import Navbar from '../navbar/navbar';
import './ManageCategories.css'; // <-- new CSS file for styles

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('category_id', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error.message);
      setErrorMsg('Failed to fetch categories.');
    } else {
      setCategories(data);
      setErrorMsg('');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Update Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) {
      alert('Category name is required');
      return;
    }

    if (editingCategory) {
      // Update
      const { error } = await supabase
        .from('categories')
        .update({ category: trimmed })
        .eq('category_id', editingCategory.category_id);

      if (error) {
        console.error('Error updating category:', error.message);
        alert(`Error: ${error.message}`);
      } else {
        fetchCategories();
        setNewCategory('');
        setEditingCategory(null);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('categories')
        .insert([{ category: trimmed }])
        .select();

      if (error) {
        console.error('Error adding category:', error.message);
        alert(`Error: ${error.message}`);
      } else {
        setCategories([...categories, ...data]);
        setNewCategory('');
      }
    }
  };

  // Edit
  const handleEditCategory = (category) => {
    setNewCategory(category.category);
    setEditingCategory(category);
  };

  // Delete
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    // Cascade delete if needed
    await supabase.from('service_categories').delete().eq('category_id', id);

    const { error } = await supabase.from('categories').delete().eq('category_id', id);
    if (error) {
      console.error('Error deleting category:', error.message);
      alert(`Error: ${error.message}`);
    } else {
      fetchCategories();
    }
  };

  return (
    <div className="manage-categories-page">
      <Navbar />
      <div className="manage-categories-container">
        <h1 className="page-title">Manage Categories</h1>

        {/* Form Card */}
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
            <button type="submit" className="btn-primary">
              {editingCategory ? 'Update' : 'Add'}
            </button>
            {editingCategory && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategory('');
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {errorMsg && <p className="error-text">{errorMsg}</p>}
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.category_id}>
                  <td>{cat.category_id}</td>
                  <td>{cat.category}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditCategory(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCategory(cat.category_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
