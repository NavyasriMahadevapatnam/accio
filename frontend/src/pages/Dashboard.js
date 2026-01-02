import { Link } from 'react-router-dom';
import { LogOut, PackagePlus, PackageSearch, MessageCircle, Trophy, Award } from 'lucide-react';
import { Button } from '../components/ui/button';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <PackageSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-outfit text-primary">ACCIO</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-900">{user?.email}</div>
              <div className="text-xs text-slate-500 flex items-center justify-end gap-2">
                <Award className="w-3 h-3" />
                {user?.points || 0} points
              </div>
            </div>
            <Button 
              onClick={onLogout} 
              data-testid="logout-btn"
              variant="outline" 
              className="h-10 px-6 rounded-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">Welcome back!</h1>
          <p className="text-lg text-slate-600">What would you like to do today?</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link to="/report-lost">
            <div data-testid="lost-action-card" className="group bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PackagePlus className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2 font-outfit">I Lost Something</h3>
              <p className="text-slate-600">Report a lost item and get AI-powered match suggestions</p>
            </div>
          </Link>

          <Link to="/report-found">
            <div data-testid="found-action-card" className="group bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PackageSearch className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2 font-outfit">I Found Something</h3>
              <p className="text-slate-600">Report a found item and help someone recover it</p>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100">
          <h3 className="text-xl font-semibold text-slate-900 mb-6 font-outfit">Quick Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/browse-lost">
              <Button data-testid="browse-lost-btn" variant="outline" className="w-full h-14 rounded-xl justify-start">
                <PackagePlus className="w-5 h-5 mr-3" />
                Browse Lost Items
              </Button>
            </Link>
            <Link to="/browse-found">
              <Button data-testid="browse-found-btn" variant="outline" className="w-full h-14 rounded-xl justify-start">
                <PackageSearch className="w-5 h-5 mr-3" />
                Browse Found Items
              </Button>
            </Link>
            <Link to="/messages">
              <Button data-testid="messages-btn" variant="outline" className="w-full h-14 rounded-xl justify-start">
                <MessageCircle className="w-5 h-5 mr-3" />
                Messages
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button data-testid="leaderboard-btn" variant="outline" className="w-full h-14 rounded-xl justify-start">
                <Trophy className="w-5 h-5 mr-3" />
                Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
