import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user, error: authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await login(email, password);
      // Success is handled by useEffect
    } catch (err) {
      // Error is handled by context state
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-3xl font-black text-primary-600 tracking-tighter text-center block mb-8">
          DIGITAL<span className="text-slate-900">ERA</span>
        </Link>
        <div className="bg-white py-10 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Login</h2>
            <p className="text-sm text-slate-500 mt-1">Access the DigitalEra CMS dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start">
                <AlertCircle size={18} className="mr-2 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  className="admin-input pl-10"
                  placeholder="admin@digitalera.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  className="admin-input pl-10"
                  placeholder="Your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn btn-primary py-3 text-lg flex items-center justify-center"
            >
              {submitting ? <Loader2 className="animate-spin mr-2" size={20} /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <Link to="/" className="text-sm font-medium text-slate-400 hover:text-primary-600">
              Return to public website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
