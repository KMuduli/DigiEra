import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Users, 
  ChevronRight, 
  ArrowUpRight,
  Plus,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, articlesRes] = await Promise.all([
          api.get('/articles/stats'),
          api.get('/articles/admin?limit=5')
        ]);
        setStats(statsRes.data);
        setLatestArticles(articlesRes.data.articles);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  const statCards = [
    { label: 'Total Articles', value: stats?.totalArticles, icon: <FileText className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Published', value: stats?.published, icon: <ArrowUpRight className="text-emerald-600" />, color: 'bg-emerald-50' },
    { label: 'Total Views', value: stats?.totalViews?.toLocaleString(), icon: <Eye className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Comments', value: stats?.totalComments, icon: <MessageSquare className="text-amber-600" />, color: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-2">Welcome back! Here's what's happening with DigitalEra.</p>
        </div>
        <Link to="/admin/articles/new" className="btn btn-primary flex items-center shadow-lg shadow-primary-200">
          <Plus size={20} className="mr-2" /> New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center">
            <div className={`p-4 rounded-xl ${stat.color} mr-5`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Content</h2>
            <Link to="/admin/articles" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
          </div>
          
          <div className="card divide-y divide-slate-100">
            {latestArticles.map((article) => (
              <div key={article.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                    {article.featuredImage ? (
                      <img src={`http://localhost:5000${article.featuredImage}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400"><FileText size={20} /></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{article.title}</h3>
                    <div className="flex items-center text-xs space-x-3 mt-1">
                      <span className={`px-2 py-0.5 rounded uppercase font-black tracking-tighter ${
                        article.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {article.status}
                      </span>
                      <span className="text-slate-400 font-medium">{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/admin/articles/edit/${article.id}`} className="p-2 text-slate-400 hover:text-primary-600">
                  <ChevronRight size={20} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips / System Status */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight px-2">Quick Info</h2>
          <div className="bg-primary-600 rounded-2xl p-6 text-white shadow-xl shadow-primary-200">
            <h3 className="text-lg font-bold mb-3">Welcome to version 1.0</h3>
            <p className="text-primary-100 text-sm leading-relaxed mb-6">
              You're running the latest DigitalEra CMS. All features are active. You can manage your articles, categories and view analytics here.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-sm font-bold bg-white/10 rounded-lg p-3">
                <TrendingUp size={18} className="mr-3" />
                SEO Optimization Active
              </div>
              <div className="flex items-center text-sm font-bold bg-white/10 rounded-lg p-3">
                <LayoutDashboard size={18} className="mr-3" />
                Admin Panel Responsive
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
