import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PackageSearch, LogOut, TrendingUp, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = ({ token, user, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, lostRes, foundRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BACKEND_URL}/api/lost/list`),
        axios.get(`${BACKEND_URL}/api/found/list`)
      ]);
      
      setStats(statsRes.data);
      setLostItems(lostRes.data);
      setFoundItems(foundRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/delete-post/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Post deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <PackageSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-outfit text-primary">ACCIO Admin</span>
          </Link>
          <Button onClick={onLogout} variant="outline" className="h-10 px-6 rounded-full">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 font-outfit">Admin Dashboard</h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div data-testid="stat-card" className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Total Lost</span>
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.total_lost}</p>
            </div>
            <div data-testid="stat-card" className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Total Found</span>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.total_found}</p>
            </div>
            <div data-testid="stat-card" className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Matched</span>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.successfully_matched}</p>
            </div>
            <div data-testid="stat-card" className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Active Posts</span>
                <TrendingUp className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-3xl font-bold text-slate-900">{stats.active_lost + stats.active_found}</p>
            </div>
          </div>
        )}

        {/* Lost Items */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4 font-outfit">Lost Items</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {lostItems.map((item) => (
              <div key={item.id} data-testid="admin-item" className="flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.item_name}</p>
                  <p className="text-sm text-slate-600">{item.user_email} • {item.location}</p>
                </div>
                <Button
                  data-testid="delete-btn"
                  onClick={() => deletePost('lost', item.id)}
                  variant="destructive"
                  size="sm"
                  className="h-9 px-4 rounded-full"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Found Items */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-4 font-outfit">Found Items</h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {foundItems.map((item) => (
              <div key={item.id} data-testid="admin-item" className="flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.item_name}</p>
                  <p className="text-sm text-slate-600">{item.user_email} • {item.location}</p>
                </div>
                <Button
                  data-testid="delete-btn"
                  onClick={() => deletePost('found', item.id)}
                  variant="destructive"
                  size="sm"
                  className="h-9 px-4 rounded-full"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
