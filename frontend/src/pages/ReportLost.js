import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { PackageSearch, Upload } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ReportLost = ({ token }) => {
  const [formData, setFormData] = useState({
    item_name: '',
    location: '',
    date_time: '',
    description: '',
    photo: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result.split(',')[1] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/lost/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Lost item reported successfully!');
      navigate('/browse-lost');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to report item');
    } finally {
      setLoading(false);
    }
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">Report Lost Item</h1>
          <p className="text-lg text-slate-600">Help us find your item with detailed information</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg">
          <form data-testid="report-lost-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="item_name">Item Name *</Label>
              <Input
                id="item_name"
                data-testid="item-name-input"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                className="mt-2 h-12"
                placeholder="e.g., Blue Backpack, iPhone 13, Wallet"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location Lost *</Label>
              <Input
                id="location"
                data-testid="location-input"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-2 h-12"
                placeholder="e.g., Library 3rd Floor, Cafeteria"
                required
              />
            </div>

            <div>
              <Label htmlFor="date_time">Date & Time *</Label>
              <Input
                id="date_time"
                type="datetime-local"
                data-testid="datetime-input"
                value={formData.date_time}
                onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                className="mt-2 h-12"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                data-testid="description-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 min-h-32"
                placeholder="Provide detailed description: color, brand, distinctive features, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="photo">Photo (Optional)</Label>
              <div className="mt-2">
                <label htmlFor="photo" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary transition-colors">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600">Click to upload photo</span>
                  </div>
                  <input
                    id="photo"
                    type="file"
                    data-testid="photo-input"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {formData.photo && <p className="text-sm text-green-600 mt-2">✓ Photo uploaded</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1 h-12 rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="submit-btn"
                disabled={loading}
                className="flex-1 bg-secondary text-white hover:bg-secondary/90 h-12 rounded-full font-medium shadow-lg"
              >
                {loading ? 'Reporting...' : 'Report Lost Item'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;
