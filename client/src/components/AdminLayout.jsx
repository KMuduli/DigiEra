import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  LogOut, 
  Home, 
  PlusCircle, 
  ExternalLink,
  MessageSquare,
  FileCode2,
  Users
} from 'lucide-react';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner fullPage />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Articles', icon: <FileText size={20} />, path: '/admin/articles' },
    { name: 'Categories', icon: <FolderTree size={20} />, path: '/admin/categories' },
    { name: 'Comments', icon: <MessageSquare size={20} />, path: '/admin/comments' },
    { name: 'Static Pages', icon: <FileCode2 size={20} />, path: '/admin/pages' },
    { name: 'Visitors', icon: <Users size={20} />, path: '/admin/visitors' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-30">
        <div className="p-6">
          <Link to="/" className="text-xl font-black text-white tracking-tighter">
            DIGITAL<span className="text-primary-500">ERA</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-primary-600 text-white' 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          <div className="pt-8 pb-2 px-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Actions</p>
          </div>
          
          <Link
            to="/admin/articles/new"
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 hover:text-white transition-all"
          >
            <PlusCircle size={20} className="mr-3 text-emerald-500" />
            New Article
          </Link>
          
          <Link
            to="/"
            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 hover:text-white transition-all"
          >
            <ExternalLink size={20} className="mr-3" />
            View Site
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center px-3 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg mr-3 shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
