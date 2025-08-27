import React, { useState } from 'react';
import { 
  Plus, Upload, Users, DollarSign, Calendar, Search, 
  Filter, Edit, Trash2, Bell, CheckCircle, AlertCircle 
} from 'lucide-react';
import { mockCustomers } from '../utils/mockData';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMenuItem, setNewMenuItem] = useState({
    dish: '',
    price: '',
    image: '',
    description: ''
  });
  const [customers] = useState(mockCustomers);

  const handleAddMenuItem = () => {
    if (newMenuItem.dish && newMenuItem.price) {
      console.log('Adding menu item:', newMenuItem);
      setNewMenuItem({ dish: '', price: '', image: '', description: '' });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCustomers = customers.filter(customer => customer.status === 'Active');
  const totalRevenue = activeCustomers.length * 3500; // Assuming average monthly fee

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your mess and customers</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{activeCustomers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-semibold text-gray-900">28</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'menu', label: 'Menu Management', icon: Plus },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'payments', label: 'Payments', icon: DollarSign },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            {/* Add New Menu Item */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Today's Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dish Name</label>
                  <input
                    type="text"
                    value={newMenuItem.dish}
                    onChange={(e) => setNewMenuItem({...newMenuItem, dish: e.target.value})}
                    className="input-field"
                    placeholder="Enter dish name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                    className="input-field"
                    placeholder="Enter price"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newMenuItem.description}
                    onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                    className="input-field h-24"
                    placeholder="Enter dish description"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-200">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddMenuItem}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </button>
              </div>
            </div>

            {/* Current Menu */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Menu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { dish: 'Dal Rice', price: 80, image: 'https://images.pexels.com/photos/5864264/pexels-photo-5864264.jpeg' },
                  { dish: 'Paneer Curry', price: 120, image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg' },
                  { dish: 'Roti', price: 15, image: 'https://images.pexels.com/photos/5419336/pexels-photo-5419336.jpeg' }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 relative group">
                    <img
                      src={item.image}
                      alt={item.dish}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-medium text-gray-900 mb-1">{item.dish}</h3>
                    <p className="text-primary-600 font-semibold">₹{item.price}</p>
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-1">
                      <button className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="card p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Plan:</span>
                      <span className="text-sm font-medium">{customer.plan}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        customer.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Attendance:</span>
                      <span className="text-sm font-medium">{customer.attendance}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Joined:</span>
                      <span className="text-sm font-medium">
                        {new Date(customer.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="flex-1 btn btn-secondary text-sm py-2">
                        View Details
                      </button>
                      <button className="px-3 py-2 text-primary-600 hover:text-primary-700">
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">₹{(totalRevenue * 0.85).toLocaleString()}</div>
                  <div className="text-sm text-green-700">Completed Payments</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-2">₹{(totalRevenue * 0.15).toLocaleString()}</div>
                  <div className="text-sm text-orange-700">Pending Payments</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Total Expected</div>
                </div>
              </div>

              {/* Payment List */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr key={customer.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium">{customer.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">₹3,500</td>
                        <td className="py-3 px-4">Jan 31, 2024</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            index % 3 === 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {index % 3 === 0 ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {index % 3 !== 0 && (
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send Notifications</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <select className="input-field">
                  <option>All Customers</option>
                  <option>Active Subscribers Only</option>
                  <option>Pending Payment Customers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter notification title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  className="input-field h-32"
                  placeholder="Enter your message here..."
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button className="btn btn-secondary">Save as Draft</button>
                <button className="btn btn-primary">
                  <Bell className="w-4 h-4 mr-2" />
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;