import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import Navbar from '../navbar/navbar';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [assignedServices, setAssignedServices] = useState([]); // service IDs for current category

  // Fetch categories & services
  useEffect(() => {
    async function fetchData() {
      const { data: catData } = await supabase.from('categories').select('*').order('created_at');
      const { data: svcData } = await supabase.from('services').select('*').order('company_name');
      setCategories(catData || []);
      setServices(svcData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssignService = (serviceId) => {
    setAssignedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Category name required');

    let categoryId = editingId;
    if (editingId) {
      // Update category
      await supabase.from('categories').update(formData).eq('id', editingId);
    } else {
      // Add new category
      const { data, error } = await supabase.from('categories').insert([formData]).select();
      if (error) return alert('Error adding category');
      categoryId = data[0].id;
      setCategories([...categories, data[0]]);
    }

    // Assign services
    if (assignedServices.length > 0) {
      // Remove old assignments first
      await supabase.from('service_categories').delete().eq('category_id', categoryId);
      // Insert new assignments
      const assignments = assignedServices.map(service_id => ({ service_id, category_id: categoryId }));
      await supabase.from('service_categories').insert(assignments);
    }

    // Reset form
    setFormData({ name: '', description: '' });
    setAssignedServices([]);
    setEditingId(null);
  };

  const handleEditCategory = async (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category.id);

    // Fetch assigned services
    const { data } = await supabase.from('service_categories').select('service_id').eq('category_id', category.id);
    setAssignedServices(data.map(d => d.service_id));
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    await supabase.from('service_categories').delete().eq('category_id', id);
    setCategories(categories.filter(c => c.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Manage Categories</h1>

        <form className="form-card" onSubmit={handleAddCategory}>
          <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
          </div>

          <div className="form-group">
            <label>Assign Services</label>
            <div className="services-list">
              {services.map(svc => (
                <label key={svc.id}>
                  <input
                    type="checkbox"
                    checked={assignedServices.includes(svc.id)}
                    onChange={() => handleAssignService(svc.id)}
                  />
                  {svc.company_name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update Category' : 'Add Category'}
          </button>
        </form>

        <h2>Existing Categories</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditCategory(cat)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCategories;
