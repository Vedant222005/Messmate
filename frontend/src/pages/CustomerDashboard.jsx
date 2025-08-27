import React, { useState } from 'react';
import { Search, Filter, Star, Calendar, CheckCircle, XCircle, Clock, Bell } from 'lucide-react';
import MessCard from '../components/UI/MessCard';
import { mockMesses } from '../utils/mockData';

const CustomerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [attendance, setAttendance] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const subscribedMesses = mockMesses.filter(mess => mess.isSubscribed);
  const unsubscribedMesses = mockMesses.filter(mess => !mess.isSubscribed);
  
  const todaysMenu = subscribedMesses.length > 0 ? subscribedMesses[0].menu : [];

  const handleSubscribe = (messId) => {
    console.log('Subscribing to mess:', messId);
    // Handle subscription logic
  };

  const handleAttendanceToggle = () => {
    setAttendance(!attendance);
  };

  const filteredMesses = () => {
    let messes = filterBy === 'subscribed' ? subscribedMesses : 
                  filterBy === 'available' ? unsubscribedMesses : mockMesses;
                  
    if (searchTerm) {
      messes = messes.filter(mess => 
        mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mess.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return messes;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your meals and subscriptions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <CheckCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subscriptions</p>
                <p className="text-2xl font-semibold text-gray-900">{subscribedMesses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">28 Meals</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900">4.3</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                <p className="text-2xl font-semibold text-gray-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Menu */}
        {todaysMenu.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Today's Menu</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field text-sm py-2"
                  />
                </div>
                <button
                  onClick={handleAttendanceToggle}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    attendance 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  {attendance ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Present</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Absent</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todaysMenu.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <img
                    src={item.image}
                    alt={item.dish}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-gray-900 mb-1">{item.dish}</h3>
                  <p className="text-primary-600 font-semibold">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messes by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="input-field pl-10 pr-8"
            >
              <option value="all">All Messes</option>
              <option value="subscribed">Subscribed</option>
              <option value="available">Available</option>
            </select>
          </div>
        </div>

        {/* Subscribed Messes */}
        {subscribedMesses.length > 0 && (filterBy === 'all' || filterBy === 'subscribed') && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscribedMesses
                .filter(mess => !searchTerm || 
                  mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  mess.location.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((mess) => (
                <MessCard
                  key={mess.id}
                  mess={mess}
                  onSubscribe={handleSubscribe}
                  showSubscribeButton={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Messes */}
        {unsubscribedMesses.length > 0 && (filterBy === 'all' || filterBy === 'available') && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Messes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unsubscribedMesses
                .filter(mess => !searchTerm || 
                  mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  mess.location.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((mess) => (
                <MessCard
                  key={mess.id}
                  mess={mess}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredMesses().length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messes found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Absence Planning */}
        <div className="card p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Your Absence</h2>
          <p className="text-gray-600 mb-4">
            Let us know when you won't be available for meals to help with better planning.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                className="input-field"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                className="input-field"
              />
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary">
                <Bell className="w-4 h-4 mr-2" />
                Notify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;