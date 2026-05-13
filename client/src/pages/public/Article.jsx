import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import SEOHead from '../../components/SEOHead';
import { Calendar, User, Tag, ChevronLeft, MessageCircle, Clock, Eye } from 'lucide-react';

const Article = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data.article);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) return <Spinner />;
  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Post Not Found</h2>
        <p className="text-slate-500 mb-8">{error || "The article you're looking for doesn't exist."}</p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <ChevronLeft size={18} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="pb-20">
      <SEOHead 
        title={article.metaTitle || article.title} 
        description={article.metaDesc || article.excerpt} 
        slug={article.slug}
        image={article.featuredImage}
      />

      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest mb-6 transition-transform hover:-translate-x-1"
          >
            <ChevronLeft size={16} className="mr-1" /> All Articles
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            <Link to={`/category/${article.category.slug}`} className="text-primary-600 hover:underline">
              {article.category.name}
            </Link>
            <span>•</span>
            <div className="flex items-center">
              <Clock size={16} className="mr-1.5" />
              <span>5 min read</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Eye size={16} className="mr-1.5" />
              <span>{article.views} views</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
            {article.title}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <User size={24} />
            </div>
            <div>
              <div className="font-bold text-slate-900">{article.author?.name || 'Admin'}</div>
              <div className="text-sm text-slate-500 flex items-center">
                <Calendar size={14} className="mr-1.5" /> {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 -mt-8 mb-16">
          <img 
            src={`http://localhost:5000${article.featuredImage}`} 
            alt={article.title} 
            className="w-full h-auto aspect-video object-cover rounded-2xl shadow-2xl border-4 border-white"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="prose prose-slate lg:prose-xl prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-600 prose-pre:p-0 prose-img:rounded-2xl max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span 
                key={tag.id} 
                className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
              >
                <Tag size={14} className="mr-2" /> {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section (Simplified for this version) */}
        <section className="mt-20">
          <div className="flex items-center space-x-3 mb-10">
            <MessageCircle className="text-primary-600" size={28} />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recent Comments</h2>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            {article.comments && article.comments.length > 0 ? (
              <div className="space-y-8">
                {article.comments.map(comment => (
                  <div key={comment.id} className="pb-8 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-bold text-slate-900">{comment.authorName}</div>
                      <div className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</div>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">"{comment.content}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">No comments yet. Be the first to join the conversation!</p>
              </div>
            )}
            
            <div className="mt-12 pt-10 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Add your thoughts</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" className="admin-input" />
                  <input type="email" placeholder="Your Email" className="admin-input" />
                </div>
                <textarea rows="4" placeholder="Write your comment here..." className="admin-input h-32 resize-none"></textarea>
                <button type="button" className="btn btn-primary px-8">Post Comment</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default Article;
