import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Save, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        const userData = response.data;
        setUser(userData);
        setForm({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          role: userData.role || ''
        });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        navigate('/login');
      }
    };
    
    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Call API to update user profile
      const updateData = {
        name: form.name,
        phone: form.phone,
        address: form.address
      };
      
      await authAPI.updateProfile(updateData);
      
      // Refresh user data
      const response = await authAPI.getCurrentUser();
      const updatedUser = response.data;
      setUser(updatedUser);
      
      setSaving(false);
    } catch (err) {
      setSaving(false);
      setError(
        err.response?.data?.message ||
        'Failed to update profile. Please try again.'
      );
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600">View and update your personal information.</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    className="input-field pl-10"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="input-field pl-10 bg-gray-50"
                    value={form.email}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="phone"
                    className="input-field pl-10"
                    placeholder="Your phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  className="input-field bg-gray-50 capitalize"
                  value={form.role}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  name="address"
                  className="input-field pl-10 min-h-[96px]"
                  placeholder="Your address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary flex items-center" disabled={saving}>
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

