import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown, FolderTree } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch dynamic categories for the dropdown menu
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '#', hasDropdown: true },
    { name: 'Trending', path: '/trending' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-[#0b101e] border-b border-slate-800 sticky top-0 z-50 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
                <span className="text-white font-black text-xl leading-none">D</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DigitalEra</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group/nav flex items-center">
                  <Link 
                    to={link.path} 
                    className={`text-sm font-medium flex items-center h-full py-6 
                      ${isActive(link.path) ? 'text-white' : 'text-slate-400 hover:text-white transition-colors'}
                    `}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} className="ml-1" />}
                  </Link>
                  
                  {/* Dropdown Menu for Categories */}
                  {link.hasDropdown && categories.length > 0 && (
                    <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-48 bg-[#1a233a] rounded-xl shadow-2xl border border-slate-700/80 py-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-[60] translate-y-2 group-hover/nav:-translate-y-1">
                      {categories.map((cat) => (
                        <Link 
                          key={cat.id} 
                          to={`/category/${cat.slug}`}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-indigo-500/10 transition-colors"
                        >
                          <FolderTree size={14} className="text-indigo-400 mr-2" />
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Subtle active indicator line */}
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 rounded-t-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section (Search + Auth) */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search articles..."
                className="bg-[#1a233a] border border-slate-700/50 rounded-lg py-2 pl-4 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-48 xl:w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 hover:text-white transition-colors">
                <Search size={16} />
              </button>
            </form>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="relative group cursor-pointer">
                  <div className="flex items-center space-x-2 bg-[#1a233a] border border-slate-700/50 rounded-full pl-1 pr-3 py-1 hover:border-slate-600 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-200">
                      {user.name.toLowerCase() === 'admin' ? 'Account' : user.name.split(' ')[0]}
                    </span>
                  </div>
                  
                  {/* Account Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a233a] rounded-xl shadow-2xl shadow-black/50 border border-slate-700/80 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] translate-y-1 group-hover:translate-y-0">
                    <div className="px-4 py-2 border-b border-slate-700/50 mb-1">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Account</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:bg-slate-800/50 hover:text-red-300 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0b101e] border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link 
                  to={link.path} 
                  className={`flex justify-between items-center px-3 py-2 text-base font-medium rounded-lg ${
                    isActive(link.path) 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
                {/* Mobile Categories Sub-links */}
                {link.hasDropdown && categories.length > 0 && (
                  <div className="pl-6 pr-3 py-2 space-y-1 border-l border-slate-700 ml-4 mt-1">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.id} 
                        to={`/category/${cat.slug}`}
                        className="block px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="pt-4 pb-4 border-t border-slate-800 px-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#1a233a] border border-slate-700/50 rounded-lg py-2 pl-4 pr-10 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={18} />
              </button>
            </form>

            {user ? (
              <div className="bg-[#1a233a] rounded-xl p-3 border border-slate-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-black">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin/dashboard" className="col-span-2 text-center text-xs font-bold text-indigo-400 bg-indigo-500/10 py-2 rounded-lg hover:bg-indigo-500/20 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => logout()}
                    className="col-span-2 text-center text-xs font-bold text-red-400 bg-red-500/10 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-center text-sm font-semibold py-2 rounded-lg shadow-lg shadow-indigo-600/20">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
