import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { LogIn, User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      const apiErr = err.response?.data?.error || err.response?.data?.message || err.message;
      const errorString = typeof apiErr === 'string' ? apiErr : (apiErr?.message || JSON.stringify(apiErr) || 'Registration failed');
      setError(errorString);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome!</h2>
          <p className="text-slate-500 mb-8 font-medium">Your account has been created successfully. Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="text-4xl font-black text-slate-900 tracking-tighter">
            DIGITAL<span className="text-primary-600">ERA</span>
          </Link>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Join our community</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight text-center">Create your account</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                name="name"
                required
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 flex items-center justify-center group disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
              {!loading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-bold text-sm">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-primary-600 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
