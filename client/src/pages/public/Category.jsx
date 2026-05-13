import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import ArticleCard from '../../components/ArticleCard';
import Spinner from '../../components/Spinner';
import SEOHead from '../../components/SEOHead';
import { Newspaper, ChevronRight } from 'lucide-react';

const Category = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articleRes, categoryRes] = await Promise.all([
          api.get(`/articles?category=${slug}`),
          api.get(`/categories/${slug}`)
        ]);
        setArticles(articleRes.data.articles);
        setCategory(categoryRes.data.category);
      } catch (err) {
        console.error('Failed to fetch category data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEOHead 
        title={category?.name || 'Category'} 
        description={category?.description || `Browse articles in ${category?.name} category.`} 
      />
      
      <div className="mb-16">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={14} />
          <span className="text-primary-600">Categories</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight">
          {category?.name || 'Category'}
        </h1>
        <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
          {category?.description}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center">
          <Newspaper size={64} className="mx-auto text-slate-200 mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">No articles in this category yet</h3>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">We're currently preparing some insightful pieces for this section. Stay tuned!</p>
          <Link to="/" className="btn btn-primary px-8">Back to Home</Link>
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

export default Category;
