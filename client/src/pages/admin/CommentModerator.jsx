import { useState, useEffect } from 'react';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  MessageSquare, 
  User, 
  Mail, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CommentModerator = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/comments/admin');
      setComments(res.data.comments);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleStatusUpdate = async (id, approved) => {
    try {
      await api.patch(`/comments/${id}/status`, { approved });
      setComments(prev => 
        prev.map(c => c.id === id ? { ...c, approved } : c)
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment permanentely?')) return;
    try {
      await api.delete(`/comments/${id}`);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'PENDING') return !c.approved;
    if (filter === 'APPROVED') return c.approved;
    return true;
  });

  if (loading && comments.length === 0) return <Spinner />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Comment Moderation</h1>
          <p className="text-slate-500 font-medium">Review and manage thoughts from your readers.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['ALL', 'PENDING', 'APPROVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                filter === f 
                ? 'bg-primary-600 text-white shadow-md shadow-primary-200' 
                : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="card p-20 text-center">
            <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-medium text-lg">No {filter.toLowerCase()} comments found.</p>
          </div>
        ) : (
          filteredComments.map(comment => (
            <div key={comment.id} className={`card border-l-4 transition-all duration-300 ${comment.approved ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-sm ${comment.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {(comment.user?.name || comment.authorName || 'U').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 flex items-center">
                        {comment.user?.name || comment.authorName || 'Unknown User'}
                        {!comment.approved && (
                          <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded tracking-tighter">Pending</span>
                        )}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center text-xs text-slate-400 font-bold">
                          <Mail size={12} className="mr-1" /> {comment.user?.email || comment.authorEmail || 'No Email'}
                        </span>
                        <span className="flex items-center text-xs text-slate-400 font-bold">
                          <Calendar size={12} className="mr-1" /> {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        <Link 
                          to={`/article/${comment.article?.slug}`} 
                          target="_blank"
                          className="flex items-center text-xs text-primary-600 font-black hover:underline"
                        >
                          <ExternalLink size={12} className="mr-1" /> On: {comment.article?.title}
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {comment.approved ? (
                      <button 
                        onClick={() => handleStatusUpdate(comment.id, false)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Unapprove"
                      >
                        <XCircle size={20} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(comment.id, true)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-100 italic">
                  "{comment.content}"
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentModerator;
