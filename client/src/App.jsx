import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';

// Components & Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Article from './pages/public/Article';
import Category from './pages/public/Category';
import Search from './pages/public/Search';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Trending from './pages/public/Trending';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ArticleList from './pages/admin/ArticleList';
import ArticleForm from './pages/admin/ArticleForm';
import CategoryManager from './pages/admin/CategoryManager';
import CommentModerator from './pages/admin/CommentModerator';
import PageManager from './pages/admin/PageManager';
import VisitorList from './pages/admin/VisitorList';

// Scroll to top helper
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Site Layout Wrapper
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/article/:slug" element={<PublicLayout><Article /></PublicLayout>} />
            <Route path="/category/:slug" element={<PublicLayout><Category /></PublicLayout>} />
            <Route path="/search" element={<PublicLayout><Search /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/trending" element={<PublicLayout><Trending /></PublicLayout>} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin Routes (Protected via AdminLayout) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="articles" element={<ArticleList />} />
              <Route path="articles/new" element={<ArticleForm />} />
              <Route path="articles/edit/:id" element={<ArticleForm />} />
              {/* Optional: Add Category/Tag/Comment management here */}
              <Route path="categories" element={<CategoryManager />} />
              <Route path="comments" element={<CommentModerator />} />
              <Route path="pages" element={<PageManager />} />
              <Route path="visitors" element={<VisitorList />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<PublicLayout><div className="py-40 text-center"><h1 className="text-6xl font-black text-slate-900 mb-4">404</h1><p className="text-xl text-slate-500">Page not found.</p></div></PublicLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
