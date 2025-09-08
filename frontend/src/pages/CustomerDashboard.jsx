import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Calendar, CheckCircle, XCircle, Clock, Bell, Utensils } from 'lucide-react';
import MessCard from '../components/UI/MessCard';
import MessProfileCard from '../components/MessProfileCard';
import SubscriptionDetailsCard from '../components/SubscriptionDetailsCard';
import MessDetailsPopup from '../components/MessDetailsPopup';
import { mockMesses } from '../utils/mockData';

const CustomerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [attendance, setAttendance] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');

  // Popup state for Explore -> View Details
  const [showPopup, setShowPopup] = useState(false);
  const [popupMess, setPopupMess] = useState(null);
  const [popupSubscription, setPopupSubscription] = useState(null);
  
  // Absence form state
  const [selectedSubscription, setSelectedSubscription] = useState('');
  const [absenceType, setAbsenceType] = useState('single');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [absenceReason, setAbsenceReason] = useState('');

  // For demo purposes, we'll use mock data
  // In a real app, you would fetch this data from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const subscribedMesses = mockMesses.filter(mess => mess.isSubscribed);
      const unsubscribedMesses = mockMesses.filter(mess => !mess.isSubscribed);
      
      // Mock subscription data
      const mockSubscriptions = subscribedMesses.map(mess => ({
        _id: `sub-${mess.id}`,
        mess: {
          _id: mess.id,
          name: mess.name,
          imageUrl: mess.image
        },
        subscriptionStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        subscriptionEndDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        totalDays: 60,
        daysSpent: 15,
        daysRemaining: 45,
        status: 'active',
        paymentStatus: 'partially_paid',
        amountPaid: 2000,
        amountDue: 1500,
        totalPrice: 3500
      }));
      
      setSubscriptions(mockSubscriptions);
      setMesses(unsubscribedMesses);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle absence submission
  const handleSubmitAbsence = () => {
    try {
      // Find the subscription object
      const subscription = subscriptions.find(sub => sub._id === selectedSubscription);
      
      if (!subscription) {
        alert('Please select a valid subscription');
        return;
      }

      // Prepare dates array
      let absenceDates = [];
      
      if (absenceType === 'single') {
        // Single day absence
        absenceDates.push({
          date: fromDate,
          reason: absenceReason || 'No reason provided'
        });
      } else {
        // Date range absence
        const start = new Date(fromDate);
        const end = new Date(toDate);
        
        // Loop through all dates in the range
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          absenceDates.push({
            date: date.toISOString().split('T')[0],
            reason: absenceReason || 'No reason provided'
          });
        }
      }

      // In a real app, we would call the API
      // await orderAPI.requestAbsence(subscription._id, absenceDates);
      
      // For demo, just show success message
      alert(`Absence request submitted for ${subscription.mess.name}`);
      
      // Reset form
      setSelectedSubscription('');
      setAbsenceType('single');
      setFromDate(new Date().toISOString().split('T')[0]);
      setToDate(new Date().toISOString().split('T')[0]);
      setAbsenceReason('');
      
    } catch (error) {
      console.error('Error submitting absence request:', error);
      alert('Failed to submit absence request. Please try again.');
    }
  };
  
  const subscribedMesses = mockMesses.filter(mess => mess.isSubscribed);
  const unsubscribedMesses = mockMesses.filter(mess => !mess.isSubscribed);
  
  const todaysMenu = subscribedMesses.length > 0 ? subscribedMesses[0].menu : [];

  const handleSubscribe = (messId, planId) => {
    console.log('Subscribing to mess:', messId, 'with plan:', planId);
    // In a real app, you would make an API call to create a subscription
    // For demo purposes, we'll just log the action
    alert(`Subscription request sent for mess ID: ${messId} with plan ID: ${planId}`);
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



        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'subscriptions' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Your Subscriptions
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'explore' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('explore')}
          >
            Explore Messes
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your subscriptions...</p>
          </div>
        )}

        {/* Subscriptions Tab */}
        {!loading && activeTab === 'subscriptions' && (
          <div>
            {subscriptions.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Subscribed Messes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscribedMesses.map((mess) => (
                    <div key={mess.id} className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary-100 via-white to-primary-100 p-[1px] shadow-sm hover:shadow-xl transition-shadow">
                      <div className="bg-white rounded-2xl overflow-hidden">
                        {/* Mess Header with Image */}
                        <div className="relative h-48">
                          {mess.image ? (
                            <img 
                              src={mess.image} 
                              alt={mess.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Utensils className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                          {/* Subscribed badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 ring-1 ring-green-200">
                              Subscribed
                            </span>
                          </div>
                          {/* Name */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-xl font-bold text-white drop-shadow-sm">{mess.name}</h3>
                          </div>
                        </div>

                        {/* Subscription Details */}
                        <div className="p-6">
                          {/* Find the corresponding subscription for this mess */}
                          {subscriptions
                            .filter(sub => sub.mess._id === mess.id)
                            .map(subscription => (
                              <div key={subscription._id} className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <SubscriptionDetailsCard subscription={subscription} showHeader={false} />
                                <div className="mt-4 flex justify-end">
                                  <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                      setPopupMess({
                                        _id: mess.id,
                                        name: mess.name,
                                        imageUrl: mess.image,
                                        pricePerMeal: Math.round(mess.monthlyPrice / 30),
                                        address: mess.location,
                                        capacity: 50,
                                        openingTime: '8:00 AM',
                                        closingTime: '10:00 PM',
                                        daysOpen: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
                                        contactPhone: '+91 9876543210',
                                        contactEmail: 'contact@example.com',
                                        cuisineTypes: ['North Indian','South Indian'],
                                        dietaryOptions: ['vegetarian','non-vegetarian'],
                                        specialFeatures: ['Home Delivery','Special Sunday Menu'],
                                        menu: mess.menu,
                                        subscriptionPlans: [
                                          { id: 'plan1', name: 'Monthly', durationDays: 30, price: mess.monthlyPrice, description: 'Regular monthly plan with all meals included' },
                                          { id: 'plan2', name: 'Quarterly', durationDays: 90, price: mess.monthlyPrice * 3 * 0.9, description: '10% discount on 3-month subscription' }
                                        ]
                                      });
                                      setPopupSubscription(subscription);
                                      setShowPopup(true);
                                    }}
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscriptions</h3>
                <p className="text-gray-600 mb-4">Subscribe to a mess to get started</p>
                <button 
                  onClick={() => setActiveTab('explore')} 
                  className="btn btn-primary"
                >
                  Explore Messes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Explore Messes Tab */}
        {!loading && activeTab === 'explore' && (
          <div>
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
                  <option value="available">Available</option>
                </select>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Messes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unsubscribedMesses
                .filter(mess => !searchTerm || 
                  mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  mess.location.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((mess) => (
                <MessProfileCard
                  key={mess.id}
                  mess={{
                    _id: mess.id,
                    name: mess.name,
                    imageUrl: mess.image,
                    pricePerMeal: Math.round(mess.monthlyPrice / 30),
                    address: mess.location,
                    capacity: 50,
                    openingTime: '8:00 AM',
                    closingTime: '10:00 PM',
                    daysOpen: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                    contactPhone: '+91 9876543210',
                    contactEmail: 'contact@example.com',
                    cuisineTypes: ['North Indian', 'South Indian'],
                    dietaryOptions: ['vegetarian', 'non-vegetarian'],
                    specialFeatures: ['Home Delivery', 'Special Sunday Menu'],
                    menu: mess.menu, // pass mock today's menu
                    subscriptionPlans: [
                      {
                        id: 'plan1',
                        name: 'Monthly',
                        durationDays: 30,
                        price: mess.monthlyPrice,
                        description: 'Regular monthly plan with all meals included'
                      },
                      {
                        id: 'plan2',
                        name: 'Quarterly',
                        durationDays: 90,
                        price: mess.monthlyPrice * 3 * 0.9,
                        description: '10% discount on 3-month subscription'
                      }
                    ]
                  }}
                  onSubscribe={handleSubscribe}
                  onViewDetails={(m)=>{ setPopupMess(m); setShowPopup(true); }}
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

        {/* Details Popup */}
        {showPopup && popupMess && (
          <MessDetailsPopup 
            mess={popupMess} 
            onClose={() => setShowPopup(false)}
            subscription={popupSubscription}
            attendance={attendance}
          />
        )}

        {/* Absence Planning */}
        <div id="absence-planning-section" className="card p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Your Absence</h2>
          <p className="text-gray-600 mb-4">
            Let us know when you won't be available for meals to help with better planning.
          </p>
          
          {subscriptions.length > 0 ? (
            <div className="space-y-6">
              {/* Subscription Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Subscription</label>
                <select 
                   className="input-field w-full"
                   value={selectedSubscription}
                   onChange={(e) => setSelectedSubscription(e.target.value)}
                 >
                   <option value="">-- Select a subscription --</option>
                   {subscriptions.map(subscription => (
                     <option key={subscription._id} value={subscription._id}>
                       {subscription.mess.name} - Ends {new Date(subscription.subscriptionEndDate).toLocaleDateString()}
                     </option>
                   ))}
                 </select>
              </div>
              
              {/* Absence Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Absence Type</label>
                <div className="flex space-x-4">
                   <label className="flex items-center">
                     <input 
                       type="radio" 
                       name="absenceType" 
                       value="single" 
                       className="mr-2" 
                       checked={absenceType === 'single'}
                       onChange={() => setAbsenceType('single')}
                     />
                     <span>Single Day</span>
                   </label>
                   <label className="flex items-center">
                     <input 
                       type="radio" 
                       name="absenceType" 
                       value="range" 
                       className="mr-2" 
                       checked={absenceType === 'range'}
                       onChange={() => setAbsenceType('range')}
                     />
                     <span>Date Range</span>
                   </label>
                 </div>
              </div>
              
              {/* Date Selection */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                     type="date"
                     className="input-field w-full"
                     min={new Date().toISOString().split('T')[0]}
                     value={fromDate}
                     onChange={(e) => setFromDate(e.target.value)}
                     required
                   />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                     type="date"
                     className="input-field w-full"
                     min={fromDate}
                     value={toDate}
                     onChange={(e) => setToDate(e.target.value)}
                     disabled={absenceType === 'single'}
                     required={absenceType === 'range'}
                   />
                </div>
              </div>
              
              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea 
                   className="input-field w-full" 
                   rows="2" 
                   placeholder="Briefly explain why you'll be absent"
                   value={absenceReason}
                   onChange={(e) => setAbsenceReason(e.target.value)}
                 ></textarea>
              </div>
              
              {/* Submit Button */}
              <div>
                <button 
                   className="btn btn-primary w-full sm:w-auto"
                   onClick={handleSubmitAbsence}
                   disabled={!selectedSubscription || !fromDate || (absenceType === 'range' && !toDate)}
                 >
                   <Bell className="w-4 h-4 mr-2" />
                   Submit Absence Request
                 </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">You need an active subscription to mark absences.</p>
              <button 
                onClick={() => setActiveTab('explore')} 
                className="mt-3 btn btn-primary"
              >
                Explore Messes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;