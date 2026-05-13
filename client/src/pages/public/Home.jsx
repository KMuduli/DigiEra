import { useState, useEffect } from 'react';
import api from '../../api/api';
import ArticleCard from '../../components/ArticleCard';
import Spinner from '../../components/Spinner';
import SEOHead from '../../components/SEOHead';
import { Newspaper, Zap, TrendingUp } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles');
        setArticles(res.data.articles);
      } catch (err) {
        console.error('Failed to fetch articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEOHead title="Home" description="Welcome to DigitalEra - Your source for technology and programming insights." />
      
      {/* Hero Section */}
      <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap size={14} className="mr-2" />
            Stay Ahead in Tech
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-none">
            Master the <span className="text-primary-600">Digital Era</span> with Expert Insights
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed mb-8">
            Deep dives into modern frameworks, development best practices, and the future of artificial intelligence.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <a href="#latest" className="btn btn-primary px-8 py-3 text-lg">Start Reading</a>
            <a href="/category/programming" className="btn btn-secondary px-8 py-3 text-lg">Tutorials</a>
          </div>
        </div>
        <div className="flex-1 hidden lg:block relative">
          <div className="absolute -inset-4 bg-primary-200 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800" 
            alt="Technology background" 
            className="relative rounded-2xl shadow-2xl border border-slate-200"
          />
        </div>
      </div>

      <div id="latest" className="flex items-center space-x-3 mb-8">
        <TrendingUp className="text-primary-600" size={24} />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Latest Articles</h2>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Newspaper size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No articles found</h3>
          <p className="text-slate-500">We're working on some great content. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
