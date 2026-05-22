import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import { supabase } from '../../lib/supabase';

import {
  ChevronLeft,
  Save,
  Send,
  Image as ImageIcon,
  X,
  Search,
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

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    categoryId: '',
    status: 'DRAFT',
    metaTitle: '',
    metaDesc: '',
    targetKeywords: '',
    readingTime: '',
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
            slug: art.slug,
            content: art.content,
            excerpt: art.excerpt || '',
            categoryId: art.categoryId,
            status: art.status,
            metaTitle: art.metaTitle || '',
            metaDesc: art.metaDesc || '',
            targetKeywords: art.targetKeywords || '',
            readingTime: art.readingTime || '',
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

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuillChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  // SUPABASE IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setSubmitting(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (error) {
        // Detailed error for the user to troubleshoot
        if (error.message === 'bucket_not_found' || error.error === 'Bucket not found') {
          throw new Error('Supabase bucket "blog-images" not found. Please create it in your Supabase dashboard.');
        }
        throw error;
      }

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        featuredImage: data.publicUrl
      }));

    } catch (err) {
      console.error('Upload Error:', err);
      alert(`Image upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();

      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }

      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      <div className="flex justify-between items-center">
        <Link
          to="/admin/articles"
          className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary-600"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to list
        </Link>

        <div className="flex space-x-3">

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="btn btn-secondary flex items-center"
          >
            {submitting
              ? <Loader2 size={18} className="mr-2 animate-spin" />
              : <Save size={18} className="mr-2" />
            }

            Save as Draft
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="btn btn-primary flex items-center"
          >
            {submitting
              ? <Loader2 size={18} className="mr-2 animate-spin" />
              : <Send size={18} className="mr-2" />
            }

            {isEdit && formData.status === 'PUBLISHED'
              ? 'Update Post'
              : 'Publish Article'}
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6">

          <input
            type="text"
            name="title"
            placeholder="Enter article title..."
            className="text-4xl font-black w-full border-none outline-none"
            value={formData.title}
            onChange={handleInputChange}
          />

          <div className="bg-slate-900 rounded-xl overflow-hidden min-h-[500px]">

            <div className="bg-slate-800 text-slate-400 text-xs px-4 py-2">
              HTML Source Code
            </div>

            <textarea
              className="w-full min-h-[500px] p-6 bg-transparent text-emerald-400 font-mono outline-none"
              placeholder="Write your article in HTML here..."
              value={formData.content}
              onChange={(e) => handleQuillChange(e.target.value)}
            />

          </div>

          <div className="card p-6">

            <div className="flex items-center space-x-2 mb-4">
              <AlignLeft size={20} />
              <h3 className="font-bold">Excerpt</h3>
            </div>

            <textarea
              name="excerpt"
              rows="4"
              className="admin-input h-32 resize-none"
              placeholder="A short summary..."
              value={formData.excerpt}
              onChange={handleInputChange}
            />

          </div>

        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">

          <div className="card p-6">

            <div className="flex items-center space-x-2 mb-4">
              <Settings size={20} />
              <h3 className="font-bold">Post Settings</h3>
            </div>

            <div className="space-y-4">

              <select
                name="categoryId"
                className="admin-input"
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>

                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* FEATURED IMAGE */}
              <div>

                <label className="block text-sm font-bold mb-2">
                  Featured Image
                </label>

                {formData.featuredImage ? (

                  <div className="relative rounded-xl overflow-hidden aspect-video border">

                    <img
                      src={formData.featuredImage}
                      alt="Featured"
                      className="h-full w-full object-cover"
                    />

                    <button
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          featuredImage: ''
                        }))
                      }
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X size={16} />
                    </button>

                  </div>

                ) : (

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer">

                    <ImageIcon size={32} className="mb-2 text-slate-400" />

                    <p className="text-xs font-bold uppercase">
                      Upload Image
                    </p>

                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                  </label>

                )}

              </div>

            </div>

          </div>

          {/* SEO SETTINGS */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Search size={20} className="text-primary-600" />
              <h3 className="font-bold text-lg">SEO & Discovery</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">URL Slug</label>
                <input
                  type="text"
                  name="slug"
                  className="admin-input"
                  placeholder="article-url-slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Meta Title</label>
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
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Meta Description</label>
                <textarea
                  name="metaDesc"
                  className="admin-input h-24 resize-none"
                  placeholder="Brief description for search results..."
                  value={formData.metaDesc}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Target Keywords</label>
                <input
                  type="text"
                  name="targetKeywords"
                  className="admin-input"
                  placeholder="react, tips, tutorial"
                  value={formData.targetKeywords}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Reading Time</label>
                <input
                  type="text"
                  name="readingTime"
                  className="admin-input"
                  placeholder="e.g. 5 min"
                  value={formData.readingTime}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-primary-100 text-primary-700 uppercase tracking-tighter">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1.5 hover:text-primary-900">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    className="admin-input pl-10"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ArticleForm;