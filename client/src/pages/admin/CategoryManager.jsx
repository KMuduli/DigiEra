import { useState, useEffect } from 'react';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import { Plus, Trash2, Edit2, X, Check, FolderTree } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [isEditing, setIsEditing] = useState(null); // ID of category being edited
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setIsEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.put(`/categories/${isEditing}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setIsEditing(category.id);
    setFormData({ name: category.name, description: category.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will fail if articles are using this category.')) return;
    
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  if (loading && categories.length === 0) return <Spinner />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Category Mangement</h1>
          <p className="text-slate-500 font-medium">Organize your articles into logical groups.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Container */}
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center">
              {isEditing ? <Edit2 size={18} className="mr-2 text-primary-600" /> : <Plus size={20} className="mr-2 text-primary-600" />}
              {isEditing ? 'Edit Category' : 'Add New'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  className="admin-input"
                  placeholder="e.g. Technology"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea
                  name="description"
                  className="admin-input h-24 resize-none"
                  placeholder="Optional description..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-2 pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn btn-primary w-full flex items-center justify-center font-bold"
                >
                  {submitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="btn btn-secondary w-full font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Container */}
        <div className="md:col-span-2 space-y-4">
          {categories.length === 0 ? (
            <div className="card p-12 text-center">
              <FolderTree size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">No categories found. Create your first one!</p>
            </div>
          ) : (
            categories.map(category => (
              <div key={category.id} className="card p-5 group hover:border-primary-200 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">{category.name}</h4>
                    <p className="text-slate-500 text-sm mt-1 mb-3">{category.description || 'No description provided.'}</p>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                        {category._count?.articles || 0} Articles
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Slug: /{category.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
