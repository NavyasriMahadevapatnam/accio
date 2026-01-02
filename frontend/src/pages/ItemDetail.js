import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PackageSearch, MapPin, Clock, User, TrendingUp, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ItemDetail = ({ token, user }) => {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItemDetail();
    if (type === 'lost') {
      fetchMatches();
    }
  }, [id, type]);

  const fetchItemDetail = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/${type}/${id}`);
      setItem(response.data);
    } catch (error) {
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/matches/suggestions/${id}`);
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch matches', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p>Item not found</p>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg">
              {item.photo && (
                <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={`data:image/jpeg;base64,${item.photo}`}
                    alt={item.item_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h1 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">{item.item_name}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-5 h-5" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-5 h-5" />
                  <span>{new Date(item.date_time).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-5 h-5" />
                  <span>{item.user_email}</span>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">{item.description || 'N/A'}</p>
              </div>
              {item.kept_with && (
                <div className="bg-accent/10 rounded-xl p-4">
                  <p className="text-sm text-slate-700"><strong>Item Location:</strong> {item.kept_with}</p>
                </div>
              )}
              {user?.id !== item.user_id && (
                <Button
                  data-testid="contact-btn"
                  className="w-full mt-6 bg-primary text-white hover:bg-primary/90 h-12 rounded-full font-medium"
                  onClick={() => window.location.href = '/messages'}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Owner
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Matches */}
          {type === 'lost' && matches.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold text-slate-900 font-outfit">Potential Matches</h3>
                </div>
                <div className="space-y-4">
                  {matches.map((match) => (
                    <Link key={match.id} to={`/item/found/${match.found_item.id}`}>
                      <div className="border border-slate-200 rounded-xl p-4 hover:border-accent transition-colors cursor-pointer">
                        {match.found_item.photo && (
                          <img
                            src={`data:image/jpeg;base64,${match.found_item.photo}`}
                            alt={match.found_item.item_name}
                            className="w-full aspect-video object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900">{match.found_item.item_name}</h4>
                          <span className="text-sm font-medium text-accent">{match.similarity_score}% match</span>
                        </div>
                        <p className="text-xs text-slate-600">{match.found_item.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
