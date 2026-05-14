import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black text-primary-600 tracking-tighter">DIGITAL<span className="text-slate-900">ERA</span></span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/category/technology" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Tech</Link>
              <Link to="/category/programming" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Coding</Link>
              <Link to="/category/web-development" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">Web</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="bg-slate-100 border-none rounded-full py-1.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary-500 w-48 lg:w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600">
                <Search size={16} />
              </button>
            </form>
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="text-sm font-bold text-slate-600 hover:text-primary-600">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center text-slate-900 border border-slate-200 rounded-full pl-1 pr-3 py-1 bg-slate-50">
                  <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-black mr-2">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-black tracking-tight">{user.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              <Link to="/admin/login" className="flex items-center text-slate-600 hover:text-primary-600 border border-slate-200 px-4 py-1.5 rounded-full transition-all hover:bg-slate-50">
                <User size={18} className="mr-2" />
                <span className="text-sm font-black tracking-tight">Login</span>
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md">Home</Link>
            <Link to="/category/technology" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md">Technology</Link>
            <Link to="/category/programming" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md">Programming</Link>
            <Link to="/category/web-development" className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md">Web Development</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-100 px-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
