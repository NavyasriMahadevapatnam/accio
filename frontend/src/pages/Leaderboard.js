import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PackageSearch, Trophy, Award, Medal } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Leaderboard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/leaderboard`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-slate-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <PackageSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-outfit text-primary">ACCIO</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">Leaderboard</h1>
          <p className="text-lg text-slate-600">Top helpers in our community</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">No users yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {users.map((user, index) => (
              <div
                key={user.id}
                data-testid="leaderboard-item"
                className={`flex items-center justify-between p-6 border-b border-slate-100 last:border-b-0 ${
                  index < 3 ? 'bg-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {index < 3 ? getRankIcon(index) : `#${index + 1}`}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.email}</p>
                    {user.badges && user.badges.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {user.badges.map((badge, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span className="text-xl font-bold text-slate-900">{user.points || 0}</span>
                  <span className="text-sm text-slate-600">pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
