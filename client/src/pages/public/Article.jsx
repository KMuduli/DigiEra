import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import SEOHead from '../../components/SEOHead';
import { getImageUrl } from '../../utils/image';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, Tag, ChevronLeft, MessageCircle, Clock, Edit2, Trash2, X, Check } from 'lucide-react';

const Article = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  
  // Comment posting state
  const [content, setContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Comment edit state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

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

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await api.post('/comments', {
        content,
        articleId: article.id
      });
      setCommentSuccess(true);
      setContent('');
      
      // Update local state to show new comment immediately
      if (res.data.comment) {
        setArticle(prev => ({
          ...prev,
          comments: [res.data.comment, ...prev.comments]
        }));
      }

      setTimeout(() => setCommentSuccess(false), 5000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateSubmit = async (commentId) => {
    try {
      await api.put(`/comments/${commentId}`, { content: editContent });
      setEditingId(null);
      // Update local state
      setArticle(prev => ({
        ...prev,
        comments: prev.comments.map(c => 
          c.id === commentId ? { ...c, content: editContent } : c
        )
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      // Update local state
      setArticle(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId)
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete comment');
    }
  };

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
        keywords={article.targetKeywords}
      />

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
              <span>{article.readingTime || '5 min read'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <span>{article.author?.name || 'DigitalEra Team'}</span>
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
              <div className="font-bold text-slate-900">{article.author?.name || 'DigitalEra Team'}</div>
              <div className="text-sm text-slate-500 flex items-center">
                <Calendar size={14} className="mr-1.5" /> {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </header>

      {article.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 -mt-8 mb-16">
          <img 
            src={getImageUrl(article.featuredImage)} 
            alt={article.title} 
            className="w-full h-auto aspect-video object-cover rounded-2xl shadow-2xl border-4 border-white"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="prose prose-slate lg:prose-xl prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-600 prose-pre:p-0 prose-img:rounded-2xl max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

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

        {/* Extended Comment Section */}
        <section className="mt-20">
          <div className="flex items-center space-x-3 mb-10">
            <MessageCircle className="text-primary-600" size={28} />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recent Comments</h2>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            {article.comments && article.comments.length > 0 ? (
              <div className="space-y-8">
                {article.comments.map(comment => (
                  <div key={comment.id} className="pb-8 border-b border-slate-50 last:border-0 last:pb-0 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                          {(comment.user?.name || comment.authorName || 'U').charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center">
                            {comment.user?.name || comment.authorName}
                            {comment.user?.id === article.authorId && (
                              <span className="ml-2 text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Author</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      {/* Edit/Delete Actions for Owner */}
                      {user && (user.id === comment.userId || user.role === 'ADMIN') && (
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.id === comment.userId && (
                            <button 
                              onClick={() => handleStartEdit(comment)}
                              className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit Comment"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Comment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Inline Edit Form OR Comment Display */}
                    {editingId === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          className="admin-input h-24 mb-3"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleUpdateSubmit(comment.id)}
                            className="btn btn-primary px-4 py-1.5 text-sm flex items-center"
                          >
                            <Check size={16} className="mr-1.5" /> Save
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="btn btn-secondary px-4 py-1.5 text-sm flex items-center"
                          >
                            <X size={16} className="mr-1.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-600 leading-relaxed">
                        {comment.content}
                      </p>
                    )}
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
              
              {!user ? (
                <div className="text-center py-12 px-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  <User className="mx-auto text-slate-300 mb-4" size={32} />
                  <p className="text-slate-900 font-black mb-2 tracking-tight">Login to make a comment</p>
                  <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto font-medium">Join our community of developers to share your thoughts and insights.</p>
                  <div className="flex justify-center space-x-3">
                    <Link to="/register" className="btn btn-primary px-6 text-sm font-black">Log In / Register</Link>
                  </div>
                </div>
              ) : commentSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl text-sm font-bold">
                  Thank you! Your comment has been posted successfully.
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleCommentSubmit}>
                  {/* Notice that user details are now automatically handled by the backend */}
                  <textarea 
                    name="content"
                    rows="4" 
                    placeholder="Join the discussion... Note: Be respectful and constructive." 
                    className="admin-input h-32 resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                  <button 
                    type="submit" 
                    disabled={submittingComment || !content.trim()}
                    className="btn btn-primary px-8 flex items-center font-black disabled:opacity-50"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
};

export default Article;
