import { useState, useEffect } from 'react';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import { Save, FileText, CheckCircle, XCircle } from 'lucide-react';

const PageManager = () => {
  const [pages, setPages] = useState(['about', 'contact']);
  const [activePage, setActivePage] = useState('about');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await api.get(`/pages/${activePage}`);
        setContent(res.data.page.content || '');
      } catch (err) {
        // If not found, start with empty content
        setContent('');
      }
    };
    fetchPage();
  }, [activePage]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/pages/${activePage}`, { 
        title: activePage.charAt(0).toUpperCase() + activePage.slice(1),
        content 
      });
      setMessage({ type: 'success', text: 'Page updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Static Pages</h1>
        <p className="text-slate-500 font-medium mt-1">Manage the core standalone pages of your website.</p>
      </div>

      <div className="flex space-x-2 border-b border-slate-200">
        {pages.map(slug => (
          <button
            key={slug}
            onClick={() => setActivePage(slug)}
            className={`px-6 py-3 font-bold text-sm tracking-wide transition-colors border-b-2 ${
              activePage === slug 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {slug.charAt(0).toUpperCase() + slug.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        
        {message && (
          <div className={`flex items-center space-x-2 p-4 mb-6 rounded-xl font-bold text-sm ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wide">
          Editing: {activePage}
        </h3>
        <p className="text-sm text-slate-500 mb-6 font-medium">Use HTML markup to securely format your content.</p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="admin-input h-96 resize-y font-mono text-sm leading-relaxed mb-6"
          placeholder={`Enter HTML content for the ${activePage} page...`}
        />

        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center px-8"
        >
          {saving ? 'Saving...' : (
            <>
              <Save size={18} className="mr-2" /> Save Page
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PageManager;
