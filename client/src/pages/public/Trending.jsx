import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import api from '../../api/api';
import ArticleCard from '../../components/ArticleCard';
import SEOHead from '../../components/SEOHead';
import Spinner from '../../components/Spinner';

const Trending = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/articles?sort=trending&limit=15');
        setArticles(res.data.articles);
      } catch (err) {
        console.error('Failed to fetch trending articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const topThree = articles.slice(0, 3);
  const theRest = articles.slice(3);

  return (
    <div className="bg-white min-h-screen pb-32">
      <SEOHead 
        title="Trending Articles | DigitalEra" 
        description="Discover the most popular and highly-viewed tech articles on DigitalEra." 
      />
      
      {/* ─── Cinematic Hero ─── */}
      <section className="bg-[#0b101e] pt-4 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] -ml-64 -mb-64"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            <Flame size={14} className="mr-2 fill-orange-400 animate-pulse" />
            Viral Content
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 leading-none">
            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 italic">Insights</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Real-time feed of the most shared and discussed technical articles across our global developer community.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        
        {loading ? (
          <div className="pt-20"><Spinner /></div>
        ) : articles.length > 0 ? (
          <div className="space-y-24">
            
            {/* ─── Top Tier ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {topThree.map((article, index) => (
                <div key={article.id} className="group relative">
                  <div className={`absolute -top-6 -left-2 z-10 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl scale-110 group-hover:rotate-12 transition-all duration-500 ${
                    index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-600' :
                    index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                    'bg-gradient-to-br from-orange-600 to-red-700'
                  }`}>
                    {index + 1}
                  </div>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* ─── Secondary Tier ─── */}
            <div className="space-y-12">
              <div className="flex items-center space-x-4">
                <div className="h-px flex-1 bg-slate-100"></div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-300">More Trending content</h2>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {theRest.map((article, index) => (
                  <div key={article.id} className="relative transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute -top-3 -left-3 z-10 w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white font-black text-[10px]">
                      {index + 4}
                    </div>
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-xl mt-12">
            <h2 className="text-2xl font-black text-slate-300 italic mb-2">HOTFEED CURRENTLY COLD</h2>
            <p className="text-slate-400 font-medium pb-8 border-b border-slate-50 mx-24">Engage with articles to see them appear here in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
