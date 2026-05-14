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
        const res = await api.get('/articles?sort=trending&limit=12');
        setArticles(res.data.articles);
      } catch (err) {
        console.error('Failed to fetch trending articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pt-16 pb-24">
      <SEOHead 
        title="Trending Articles | DigitalEra" 
        description="Discover the most popular and highly-viewed tech articles on DigitalEra." 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-4 mb-12">
          <div className="bg-orange-100 p-4 rounded-2xl">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trending Now</h1>
            <p className="text-lg text-slate-500 font-medium">The most watched articles by our tech community.</p>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div key={article.id} className="relative transition-transform duration-300 hover:-translate-y-2">
                {/* Visual Ranking Badge */}
                <div className="absolute -top-4 -left-4 z-10 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-4 border-slate-50 flex items-center justify-center text-white font-black shadow-lg">
                  #{index + 1}
                </div>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-400 mb-2">No trending articles yet!</h2>
            <p className="text-slate-500">Check back once our readers start engaging more.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
