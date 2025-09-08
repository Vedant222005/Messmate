import React, { useState, useEffect } from 'react';
import { 
  Plus, Upload, Users, DollarSign, Calendar, Search, 
  Filter, Edit, Trash2, Bell, CheckCircle, AlertCircle 
} from 'lucide-react';
import { mockCustomers } from '../utils/mockData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notificationAPI, orderAPI } from '../utils/api';

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
  
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationRecipients, setNotificationRecipients] = useState('all');
  const [loading, setLoading] = useState(false);

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

  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(new Date());
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerAttendanceHistory, setCustomerAttendanceHistory] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedMess, setSelectedMess] = useState('');
  const [messes, setMesses] = useState([]);
  
  // Fetch daily attendance data
  const fetchDailyAttendance = async (messId, date) => {
    if (!messId) return;
    
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await fetch(`/api/orders/daily-attendance/${messId}?date=${formattedDate}`);
      if (!response.ok) throw new Error('Failed to fetch attendance data');
      
      const data = await response.json();
      setAttendanceData(data.attendanceData || []);
      
      return data;
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
      toast.error('Failed to load attendance data');
      return null;
    }
  };
  
  // Fetch provider's messes when component mounts
  useEffect(() => {
    const fetchProviderMesses = async () => {
      try {
        // This would be replaced with an actual API call in a real implementation
        // const response = await messAPI.getProviderMesses();
        // setMesses(response.data);
        
        // For now, we'll use mock data
        setMesses([
          { _id: 'mess1', name: 'Delicious Mess' },
          { _id: 'mess2', name: 'Tasty Bites' }
        ]);
        
        // Set the first mess as selected by default
        if (!selectedMess && messes.length > 0) {
          setSelectedMess(messes[0]._id);
        }
      } catch (error) {
        console.error('Error fetching messes:', error);
        toast.error('Failed to load your messes');
      }
    };
    
    fetchProviderMesses();
  }, []);
  
  // Fetch notifications when component mounts or when tab changes to notifications
  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab]);
  
  // Fetch customer attendance history
  const fetchCustomerAttendance = async (customerId) => {
    if (!customerId) return;
    
    try {
      const response = await fetch(`/api/orders/attendance/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch customer attendance history');
      
      const data = await response.json();
      setCustomerAttendanceHistory(data);
      setShowAttendanceModal(true);
    } catch (error) {
      console.error('Error fetching customer attendance history:', error);
      toast.error('Failed to load customer attendance history');
    }
  };
  
  // Handle marking attendance
  const handleMarkAttendance = async (orderId, isPresent) => {
    try {
      await orderAPI.markAttendance(orderId, selectedAttendanceDate.toISOString(), isPresent);
      
      // Refresh attendance data
      await fetchDailyAttendance(selectedMess, selectedAttendanceDate);
      toast.success(`Customer marked as ${isPresent ? 'present' : 'absent'}`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to update attendance status');
    }
  };
  
  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    }
  };
  
  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      fetchNotifications(); // Refresh notifications
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };
  
  // Handle subscription response (approve/decline)
  const handleSubscriptionResponse = async (notificationId, orderId, action) => {
    try {
      await notificationAPI.respondToSubscription({
        notificationId,
        orderId,
        action
      });
      
      fetchNotifications(); // Refresh notifications
      toast.success(`Subscription request ${action === 'approve' ? 'approved' : 'declined'}`);
    } catch (error) {
      console.error('Error responding to subscription:', error);
      toast.error('Failed to process subscription request');
    }
  };
  
  // Send notification to customers
  const sendNotification = async (e) => {
    e.preventDefault();
    
    if (!notificationTitle || !notificationMessage) {
      toast.error('Please provide both title and message');
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real implementation, you would fetch the appropriate user IDs based on the selected recipient group
      // For now, we'll just simulate sending to all customers
      const userIds = []; // This would be populated with actual user IDs
      
      await notificationAPI.createNotification({
        title: notificationTitle,
        message: notificationMessage,
        userIds
      });
      
      setNotificationTitle('');
      setNotificationMessage('');
      toast.success('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

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
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'attendance', label: 'Attendance', icon: Calendar }
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
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount Paid</th>
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
                        <td className="py-3 px-4">₹{index % 3 === 0 ? '3,500' : (index % 3 === 1 ? '1,500' : '0')}</td>
                        <td className="py-3 px-4">Jan 31, 2024</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            index % 3 === 0 
                              ? 'bg-green-100 text-green-800' 
                              : index % 3 === 1
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                          }`}>
                            {index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'Partially Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {index % 3 !== 0 && (
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700 font-medium">
                                Update Payment
                              </button>
                              <button className="text-primary-600 hover:text-primary-700 font-medium">
                                Send Reminder
                              </button>
                            </div>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
            
            {/* Subscription Requests Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Requests</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {notifications.filter(n => n.metadata?.type === 'subscription_request').length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {notifications
                      .filter(n => n.metadata?.type === 'subscription_request')
                      .map((notification) => (
                        <div key={notification._id} className={`p-4 ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleSubscriptionResponse(notification._id, notification.metadata.orderId, 'approve')}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleSubscriptionResponse(notification._id, notification.metadata.orderId, 'decline')}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No pending subscription requests
                  </div>
                )}
              </div>
            </div>
            
            {/* Absence Requests Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Absence Requests</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {notifications.filter(n => n.metadata?.type === 'absence_request').length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {notifications
                      .filter(n => n.metadata?.type === 'absence_request')
                      .map((notification) => (
                        <div key={notification._id} className={`p-4 ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <button 
                              onClick={() => markNotificationAsRead(notification._id)}
                              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition-colors"
                            >
                              Mark as Read
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No pending absence requests
                  </div>
                )}
              </div>
            </div>
            
            {/* Send Notification Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Notifications</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <select 
                    className="input-field"
                    value={notificationRecipients}
                    onChange={(e) => setNotificationRecipients(e.target.value)}
                  >
                    <option value="all">All Customers</option>
                    <option value="active">Active Subscribers Only</option>
                    <option value="pending">Pending Payment Customers</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter notification title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    className="input-field h-32"
                    placeholder="Enter your message here..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button className="btn btn-secondary">Save as Draft</button>
                  <button 
                    className="btn btn-primary"
                    onClick={sendNotification}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Attendance Section
const AttendanceSection = ({ selectedDate, setSelectedDate, attendanceData, handleMarkAttendance, fetchCustomerAttendance }) => {
  const [selectedMess, setSelectedMess] = useState('');
  const [messes, setMesses] = useState([]);

  useEffect(() => {
    // Fetch provider's messes
    const fetchMesses = async () => {
      try {
        const response = await fetch('/api/messes/provider');
        if (!response.ok) throw new Error('Failed to fetch messes');
        
        const data = await response.json();
        setMesses(data);
        if (data.length > 0) {
          setSelectedMess(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching messes:', error);
        toast.error('Failed to load your messes');
      }
    };
    
    fetchMesses();
  }, []);

  useEffect(() => {
    if (selectedMess) {
      fetchDailyAttendance(selectedMess, selectedDate);
    }
  }, [selectedMess, selectedDate]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Daily Attendance</h2>
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedMess}
            onChange={(e) => setSelectedMess(e.target.value)}
          >
            {messes.map(mess => (
              <option key={mess._id} value={mess._id}>{mess.name}</option>
            ))}
          </select>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Subscription</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Last Attendance</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendanceData.length > 0 ? (
              attendanceData.map((attendance) => (
                <tr key={attendance.orderId}>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={attendance.customer.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                        alt={attendance.customer.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{attendance.customer.name}</p>
                        <p className="text-sm text-gray-500">{attendance.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium">
                      {attendance.subscriptionType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${attendance.isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {attendance.isPresent ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {attendance.lastAttendanceDate ? new Date(attendance.lastAttendanceDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMarkAttendance(attendance.orderId, !attendance.isPresent)}
                        className={`px-3 py-1 rounded text-white text-sm font-medium ${attendance.isPresent ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        Mark {attendance.isPresent ? 'Absent' : 'Present'}
                      </button>
                      <button
                        onClick={() => fetchCustomerAttendance(attendance.customer._id)}
                        className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
                      >
                        View History
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No attendance data available for this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Attendance History Modal */}
      {showAttendanceModal && customerAttendanceHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Attendance History: {customerAttendanceHistory[0]?.customer?.name || 'Customer'}
              </h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {customerAttendanceHistory.map((record) => (
              <div key={record.orderId} className="mb-6 border-b pb-4">
                <h4 className="font-medium text-gray-800 mb-2">{record.messName}</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Subscription Period</p>
                    <p className="font-medium">
                      {new Date(record.subscriptionStartDate).toLocaleDateString()} - {new Date(record.subscriptionEndDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Attendance Rate</p>
                    <p className="font-medium">{record.attendanceRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Present Days</p>
                    <p className="font-medium">{record.presentDays} / {record.daysSpent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Absent Days</p>
                    <p className="font-medium">{record.absenceDays}</p>
                  </div>
                </div>

                <h5 className="font-medium text-gray-800 mb-2">Absence Dates</h5>
                {record.absenceDates.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {record.absenceDates.map((absence) => (
                      <div key={absence._id} className="bg-gray-100 rounded p-2">
                        <p className="text-sm font-medium">{new Date(absence.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{absence.reason}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${absence.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {absence.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No absence records</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;