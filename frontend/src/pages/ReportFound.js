import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { PackageSearch, Upload } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ReportFound = ({ token }) => {
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    location: '',
    date_time: '',
    photo: '',
    kept_with: ''
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
    
    if (!formData.photo) {
      toast.error('Photo is required for found items');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/found/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Found item reported successfully! +10 points');
      navigate('/browse-found');
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">Report Found Item</h1>
          <p className="text-lg text-slate-600">Help reunite someone with their lost item</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg">
          <form data-testid="report-found-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="item_name">Item Name *</Label>
              <Input
                id="item_name"
                data-testid="item-name-input"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                className="mt-2 h-12"
                placeholder="e.g., Blue Backpack, iPhone, Wallet"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                <SelectTrigger data-testid="category-select" className="mt-2 h-12">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="bags">Bags & Backpacks</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="documents">Documents & IDs</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books & Stationery</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location Found *</Label>
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
              <Label htmlFor="date_time">Date & Time Found *</Label>
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
              <Label htmlFor="photo">Photo (Required) *</Label>
              <div className="mt-2">
                <label htmlFor="photo" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-accent transition-colors">
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
                    required
                  />
                </label>
                {formData.photo && <p className="text-sm text-green-600 mt-2">✓ Photo uploaded</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="kept_with">Item Location *</Label>
              <Select value={formData.kept_with} onValueChange={(value) => setFormData({ ...formData, kept_with: value })} required>
                <SelectTrigger data-testid="kept-with-select" className="mt-2 h-12">
                  <SelectValue placeholder="Where is the item now?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finder">With me (finder)</SelectItem>
                  <SelectItem value="security">College Security Office</SelectItem>
                  <SelectItem value="admin">Administrative Office</SelectItem>
                  <SelectItem value="library">Library Front Desk</SelectItem>
                </SelectContent>
              </Select>
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
                className="flex-1 bg-accent text-black hover:bg-accent/90 h-12 rounded-full font-medium shadow-lg"
              >
                {loading ? 'Reporting...' : 'Report Found Item'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;
