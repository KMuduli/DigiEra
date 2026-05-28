import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-black text-primary-600 tracking-tighter mb-4 block">DIGITAL<span className="text-slate-900">ERA</span></Link>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Your source for the latest in technology, programming, and web development. 
              We provide deep dives, tutorials, and insights to help you stay ahead in the digital era.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/technology" className="text-slate-500 hover:text-primary-600 transition-colors">Technology</Link></li>
              <li><Link to="/category/programming" className="text-slate-500 hover:text-primary-600 transition-colors">Programming</Link></li>
              <li><Link to="/category/web-development" className="text-slate-500 hover:text-primary-600 transition-colors">Web Development</Link></li>
              <li><Link to="/category/ai-machine-learning" className="text-slate-500 hover:text-primary-600 transition-colors">AI & ML</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors">Contact</Link></li>
              <li><Link to="/" className="text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} DigitalEra. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-600">Twitter</a>
            <a href="#" className="hover:text-slate-600">GitHub</a>
            <a href="#" className="hover:text-slate-600">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
