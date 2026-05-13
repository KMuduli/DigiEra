import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  FileText
} from 'lucide-react';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchArticles = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/articles/admin?page=${page}&search=${searchTerm}`);
      setArticles(res.data.articles);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch articles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      try {
        await api.delete(`/articles/${id}`);
        fetchArticles(pagination.page);
      } catch (err) {
        alert('Failed to delete article');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Articles</h1>
          <p className="text-slate-500 mt-2">Manage all your blog content in one place.</p>
        </div>
        <Link to="/admin/articles/new" className="btn btn-primary flex items-center shadow-lg shadow-primary-200">
          <Plus size={20} className="mr-2" /> Create New
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by title..."
            className="admin-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn btn-secondary flex items-center text-sm py-2">
            <Filter size={16} className="mr-2 text-slate-400" /> Filter
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-black tracking-widest text-slate-400">
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center"><Spinner /></td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">No articles found matching your criteria.</td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                          {article.featuredImage ? (
                            <img src={`http://localhost:5000${article.featuredImage}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-300 bg-slate-50"><FileText size={20} /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{article.title}</p>
                          <p className="text-xs text-slate-400 mt-1">Ref: {article.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {article.category?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase font-black px-2 py-1 rounded tracking-widest ${
                        article.status === 'PUBLISHED' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-500'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-500 text-xs">
                        <Eye size={14} className="mr-1" /> {article.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link 
                          to={`/article/${article.slug}`} 
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          to={`/admin/articles/edit/${article.id}`}
                          className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex space-x-2">
            <button 
              disabled={pagination.page <= 1}
              onClick={() => fetchArticles(pagination.page - 1)}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchArticles(pagination.page + 1)}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
