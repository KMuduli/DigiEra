import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { 
  ChevronLeft, 
  Save, 
  Send, 
  Image as ImageIcon, 
  X, 
  Search, 
  Plus, 
  Loader2,
  Settings,
  AlignLeft,
  Tag as TagIcon
} from 'lucide-react';

const ArticleForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    status: 'DRAFT',
    metaTitle: '',
    metaDesc: '',
    featuredImage: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          api.get('/categories'),
          api.get('/tags')
        ]);
        setCategories(catRes.data?.categories || []);
        setAllTags(tagRes.data?.tags || []);

        if (isEdit) {
          const res = await api.get(`/articles/admin/${id}`);
          const art = res.data.article;
          setFormData({
            title: art.title,
            content: art.content,
            excerpt: art.excerpt || '',
            categoryId: art.categoryId,
            status: art.status,
            metaTitle: art.metaTitle || '',
            metaDesc: art.metaDesc || '',
            featuredImage: art.featuredImage || '',
            tags: (art.tags || []).map(t => t.name)
          });
        }
      } catch (err) {
        console.error('Failed to fetch article data', err);
        alert('Error loading data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const body = new FormData();
    body.append('image', file);

    try {
      setSubmitting(true);
      const res = await api.post('/upload', body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, featuredImage: res.data.url }));
    } catch (err) {
      alert('Image upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = async (publish = false) => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      alert('Please fill in title, content and category.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { 
        ...formData, 
        categoryId: parseInt(formData.categoryId, 10),
        status: publish ? 'PUBLISHED' : formData.status 
      };

      if (isEdit) {
        await api.put(`/articles/${id}`, payload);
      } else {
        await api.post('/articles', payload);
      }
      
      navigate('/admin/articles');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <Link to="/admin/articles" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
          <ChevronLeft size={18} className="mr-1" /> Back to list
        </Link>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleSubmit(false)} 
            disabled={submitting}
            className="btn btn-secondary flex items-center"
          >
            {submitting ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
            Save as Draft
          </button>
          <button 
            onClick={() => handleSubmit(true)} 
            disabled={submitting}
            className="btn btn-primary flex items-center shadow-lg shadow-primary-200"
          >
            {submitting ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Send size={18} className="mr-2" />}
            {isEdit && formData.status === 'PUBLISHED' ? 'Update Post' : 'Publish Article'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-0 overflow-visible border-none shadow-none bg-transparent">
            <input
              type="text"
              name="title"
              placeholder="Enter article title..."
              className="text-4xl md:text-5xl font-black text-slate-900 border-none bg-transparent w-full p-0 py-2 focus:ring-0 outline-none placeholder:text-slate-300 tracking-tight mb-4"
              value={formData.title}
              onChange={handleInputChange}
            />
            
            <div className="bg-slate-900 rounded-xl shadow-inner border border-slate-800 overflow-hidden min-h-[500px] flex flex-col">
              <div className="bg-slate-800 text-slate-400 text-xs font-black uppercase tracking-widest px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                <span>HTML Source Code</span>
                <span>Format: Pure HTML</span>
              </div>
              <textarea 
                className="w-full h-full min-h-[500px] p-6 outline-none resize-y leading-loose text-sm font-mono bg-transparent text-emerald-400 placeholder:text-slate-600 focus:ring-0"
                placeholder="Write your article in HTML here..."
                value={formData.content} 
                onChange={(e) => handleQuillChange(e.target.value)}
              />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-2 text-slate-900 mb-6">
              <AlignLeft size={20} className="text-primary-600" />
              <h3 className="text-lg font-black tracking-tight">Excerpt</h3>
            </div>
            <textarea
              name="excerpt"
              rows="4"
              className="admin-input h-32 resize-none"
              placeholder="A short summary of the article for search results..."
              value={formData.excerpt}
              onChange={handleInputChange}
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Recommended: 150-160 characters</p>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Status & Featured Image */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 text-slate-900 mb-6">
              <Settings size={20} className="text-primary-600" />
              <h3 className="text-lg font-black tracking-tight">Post Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select
                  name="categoryId"
                  className="admin-input"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  {(categories || []).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 font-black">Featured Image</label>
                {formData.featuredImage ? (
                  <div className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200">
                    <img src={`${api.defaults.baseURL.replace('/api', '')}${formData.featuredImage}`} className="h-full w-full object-cover" />
                    <button 
                      onClick={() => setFormData(p => ({ ...p, featuredImage: '' }))}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center py-5">
                      <ImageIcon className="text-slate-300 mb-2" size={32} />
                      <p className="text-xs font-bold text-slate-400 uppercase">Upload Image</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 text-slate-900 mb-6">
              <TagIcon size={20} className="text-primary-600" />
              <h3 className="text-lg font-black tracking-tight">Tags</h3>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                className="admin-input"
                placeholder="Type and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map(tag => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-1 bg-primary-50 text-primary-600 text-xs font-bold rounded-lg group">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1.5 text-primary-400 hover:text-primary-600">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 text-slate-900 mb-6">
              <Search size={20} className="text-primary-600" />
              <h3 className="text-lg font-black tracking-tight">SEO Metadata</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  className="admin-input"
                  placeholder="SEO Title"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Meta Description</label>
                <textarea
                  name="metaDesc"
                  rows="3"
                  className="admin-input resize-none h-24"
                  placeholder="Short description for search engines"
                  value={formData.metaDesc}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
