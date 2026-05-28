import { useState, useEffect } from 'react';
import api from '../../api/api';
import Spinner from '../../components/Spinner';
import { 
  Users, 
  MapPin, 
  Globe, 
  Clock, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  
  // Filtering state
  const [dateRange, setDateRange] = useState({ 
    startDate: '', 
    endDate: '' 
  });

  const fetchVisitors = async (page = 1) => {
    try {
      setLoading(true);
      let url = `/visitors?page=${page}`;
      if (dateRange.startDate) url += `&startDate=${dateRange.startDate}`;
      if (dateRange.endDate) url += `&endDate=${dateRange.endDate}`;

      const [listRes, statsRes] = await Promise.all([
        api.get(url),
        api.get('/visitors/stats')
      ]);
      setVisitors(listRes.data.visitors);
      setPagination(listRes.data.pagination);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch visitors', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchVisitors(1);
  };

  const handleReset = () => {
    setDateRange({ startDate: '', endDate: '' });
    // We need to fetch with empty dates immediately
    const resetData = async () => {
      setLoading(true);
      try {
        const [listRes, statsRes] = await Promise.all([
          api.get('/visitors?page=1'),
          api.get('/visitors/stats')
        ]);
        setVisitors(listRes.data.visitors);
        setPagination(listRes.data.pagination);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    resetData();
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  if (loading && visitors.length === 0) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Visitor Analytics</h1>
          <p className="text-slate-500 mt-2">Real-time tracking of website visitors and their activities.</p>
        </div>
        
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">From</span>
            <input 
              type="date" 
              className="admin-input py-1.5 px-3 text-xs" 
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">To</span>
            <input 
              type="date" 
              className="admin-input py-1.5 px-3 text-xs" 
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary py-1.5 px-4 text-[10px] font-black uppercase tracking-widest">
              Apply
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-lg transition-all"
            >
              Reset
            </button>
          </div>
        </form>
        
        <div className="flex space-x-4">
          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Visits</p>
            <p className="text-2xl font-black text-primary-600">{stats?.totalVisits || 0}</p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Unique Users</p>
            <p className="text-2xl font-black text-primary-600">{stats?.uniqueVisitors || 0}</p>
          </div>
        </div>
      </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[10px] font-black tracking-widest text-slate-400">
                <th className="px-6 py-4 text-center w-12">#</th>
                <th className="px-6 py-4">Visitor / Identity</th>
                <th className="px-6 py-4">Location & IP</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 italic">No visitor logs recorded yet.</td>
                </tr>
              ) : (
                visitors.map((log, index) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-center text-slate-300 font-mono text-sm">
                      {(pagination.page - 1) * 10 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${log.userId ? 'bg-primary-600' : 'bg-slate-300'}`}>
                          {log.name ? log.name.charAt(0).toUpperCase() : <Users size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{log.name || 'Anonymous Visitor'}</p>
                          <p className="text-xs text-slate-400">{log.email || 'No email associated'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <Globe size={14} className="mr-1.5 text-slate-400" />
                          {log.ip}
                        </div>
                        <div className="flex items-center text-[10px] text-slate-400 font-black uppercase tracking-wider">
                          <MapPin size={12} className="mr-1.5" />
                          {log.city ? `${log.city}, ${log.country}` : 'Location Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded w-fit mb-1 border border-primary-100">
                          {log.method}
                        </span>
                        <span className="text-sm text-slate-600 font-mono line-clamp-1" title={log.path}>
                          {log.path}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-slate-500 font-medium">
                        <Clock size={14} className="mr-1.5 text-slate-400" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchVisitors(pagination.page - 1)}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchVisitors(pagination.page + 1)}
              className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2">Privacy & Transparency</h3>
          <p className="text-slate-400 text-sm max-w-xl">
            This tracking system is designed for security and content optimization. It logs IP addresses and user activity to prevent spam and understand which articles are trending among your audience.
          </p>
        </div>
        <div className="flex-shrink-0 relative z-10">
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
            <Info className="text-primary-400 mb-3" size={24} />
            <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Geographical data is <br/> approximated via IP.</p>
          </div>
        </div>
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[100px] -mr-32 -mt-32"></div>
      </div>
    </div>
  );
};

export default VisitorList;
