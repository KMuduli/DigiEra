import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import ArticleCard from '../../components/ArticleCard';
import Spinner from '../../components/Spinner';
import SEOHead from '../../components/SEOHead';
import { Newspaper, Zap, TrendingUp } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const recentArticles = articles.length > 1 ? articles.slice(1, 4) : [];
  const moreArticles = articles.length > 4 ? articles.slice(4) : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, catRes] = await Promise.all([
          api.get('/articles'),
          api.get('/categories')
        ]);
        setArticles(artRes.data.articles);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-24 pb-24">
      <SEOHead title="Home" description="DigitalEra - Next-generation tech insights and programming tutorials." />
      
      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary-100">
                <Zap size={14} className="mr-2 fill-primary-600" />
                Evolution of Tech
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
                Mastering the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Digital Era</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed mb-10 font-medium">
                Deep architectural dives, enterprise development patterns, and the pulse of artificial intelligence.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#featured" className="btn btn-primary px-10 py-4 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary-200">
                  Explore Latest
                </a>
                <Link to="/trending" className="inline-flex items-center px-6 py-4 text-sm font-black text-slate-600 hover:text-primary-600 transition-all uppercase tracking-widest">
                  <TrendingUp size={20} className="mr-3" />
                  Trending posts
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="mt-12 flex items-center space-x-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Trusted by readers from</div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div className="flex space-x-4 font-black italic text-lg text-slate-900">
                  <span>Google</span>
                  <span>Microsoft</span>
                  <span>Netflix</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-primary-400/20 blur-[120px] rounded-full animate-pulse z-0"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(37,99,235,0.25)] border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=1200" 
                  alt="Enterprise Tech" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Category Quick Navigation ─── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Topics:</span>
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`}
              className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold hover:border-primary-500 hover:text-primary-600 whitespace-nowrap transition-all shadow-sm"
            >
              # {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured & Recent Section ─── */}
      <section id="featured" className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Featured Post */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8 flex items-center">
              <span className="w-8 h-8 bg-primary-600 text-white rounded flex items-center justify-center mr-4 shadow-lg">
                <TrendingUp size={16} />
              </span>
              Featured Edition
            </h2>
            
            {featuredArticle ? (
              <div className="group cursor-pointer">
                <Link to={`/article/${featuredArticle.slug}`} className="block relative aspect-[21/10] overflow-hidden rounded-[2.5rem] mb-8 border-4 border-white shadow-xl">
                  <img src={featuredArticle.featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white max-w-2xl">
                    <span className="px-3 py-1 bg-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                      {featuredArticle.category?.name}
                    </span>
                    <h3 className="text-4xl font-black leading-tight tracking-tight mb-4">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-slate-200 line-clamp-2 opacity-90 leading-relaxed font-medium">
                      {featuredArticle.excerpt}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
                <div className="h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest">
                  Featured post pending...
                </div>
            )}
          </div>

          {/* Trending / Recent Sidebar */}
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8 italic text-right opacity-20">MUST READ</h2>
            
            <div className="space-y-8">
              {recentArticles.map((art, i) => (
                <Link key={art.id} to={`/article/${art.slug}`} className="group flex items-start space-x-6">
                  <div className="text-4xl font-black text-slate-200 group-hover:text-primary-400 transition-colors">
                    0{i + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2 block">{art.category?.name}</span>
                    <h4 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">{new Date(art.createdAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">Join 20k+ Leaders</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Get the weekly digest of technical architecture and enterprise strategies.</p>
                <div className="space-y-3">
                  <input type="email" placeholder="Email address" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                  <button className="w-full btn btn-primary py-3 text-xs font-black uppercase tracking-widest">Subscribe</button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-primary-500/40 transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Grid Exploration ─── */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Deep Archive</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2 px-1">Curated knowledge from the field</p>
          </div>
        </div>

        {moreArticles.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
            <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest">More insights coming soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {moreArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
