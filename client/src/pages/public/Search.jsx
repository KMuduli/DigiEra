import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/api';
import ArticleCard from '../../components/ArticleCard';
import Spinner from '../../components/Spinner';
import SEOHead from '../../components/SEOHead';
import { Search as SearchIcon, Newspaper, ChevronRight } from 'lucide-react';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      try {
        setLoading(true);
        const res = await api.get(`/articles?search=${encodeURIComponent(query)}`);
        setArticles(res.data.articles);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead title={`Search: ${query}`} description={`Search results for "${query}" on DigitalEra.`} />
      
      <div className="mb-16">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={14} />
          <span className="text-primary-600">Search</span>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-4 tracking-tight flex items-center gap-4">
          <SearchIcon size={48} className="text-primary-600 shrink-0" />
          <span>Results for "{query}"</span>
        </h1>
        <p className="text-lg text-slate-500">
          We found {articles.length} article{articles.length !== 1 ? 's' : ''} matching your query.
        </p>
      </div>

      {!query ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please enter a search term</h2>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center">
          <Newspaper size={64} className="mx-auto text-slate-200 mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">No results found</h3>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">Try checking your spelling or using more general keywords to find what you're looking for.</p>
          <Link to="/" className="btn btn-secondary px-8">Back to All Articles</Link>
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

export default Search;
