import React from 'react';
import { X, Clock, Calendar, DollarSign, Users, Utensils, MapPin, Phone, Mail, Star, Check } from 'lucide-react';

const MessDetailsPopup = ({ mess, onClose, subscription, attendance }) => {
  // Helper to get today's day in lowercase to match backend schema
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  const todaysMenu = Array.isArray(mess.menu)
    ? mess.menu.filter((item) => !item.dayOfWeek || item.dayOfWeek.toLowerCase() === today)
    : [];

  // Payment derived info (optional)
  const payment = subscription
    ? {
        amountPaid: subscription.amountPaid || 0,
        totalPrice: subscription.totalPrice || 0,
        amountDue: Math.max((subscription.totalPrice || 0) - (subscription.amountPaid || 0), 0),
        paymentStatus: subscription.paymentStatus || 'unpaid',
      }
    : null;

  const paymentProgress = payment && payment.totalPrice > 0
    ? Math.round((payment.amountPaid / payment.totalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">{mess.name}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto p-4 flex-grow">
          {/* Mess Image */}
          <div className="relative h-64 bg-gray-300 rounded-lg mb-6">
            {mess.imageUrl ? (
              <img 
                src={mess.imageUrl} 
                alt={mess.name} 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                <Utensils className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-primary-500 mr-1" />
                <span className="font-medium">₹{mess.pricePerMeal} per meal</span>
              </div>
              {mess.ratingAverage && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span>{mess.ratingAverage.toFixed(1)}</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4">{mess.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">{mess.address}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">{mess.capacity} capacity</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">
                  {mess.openingTime} - {mess.closingTime}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-600">
                  {mess.daysOpen?.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Today's Menu - detailed section visible in popup */}
          {todaysMenu.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Today's Menu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {todaysMenu.map((item, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    {item.imageUrl || item.image ? (
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.name || item.dish}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    ) : null}
                    <div className="font-medium">{item.name || item.dish}</div>
                    {item.description && (
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {(item.type || '').toString().charAt(0).toUpperCase() + (item.type || '').toString().slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Details (if subscription provided) */}
          {subscription && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <div className="text-sm text-gray-500">Amount Paid</div>
                  <div className="text-green-600 font-medium">₹{payment.amountPaid.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Amount Due</div>
                  <div className="text-red-600 font-medium">₹{payment.amountDue.toFixed(2)}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${paymentProgress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{paymentProgress}% paid</span>
                <span>₹{payment.amountPaid.toFixed(2)} of ₹{payment.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Attendance (read-only display) */}
          {typeof attendance === 'boolean' && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Attendance</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${attendance ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {attendance ? 'Marked Present' : 'Marked Absent'}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                <span>{mess.contactPhone}</span>
              </div>
              {mess.contactEmail && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{mess.contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cuisine Types */}
          {mess.cuisineTypes?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Cuisine Types</h3>
              <div className="flex flex-wrap gap-2">
                {mess.cuisineTypes.map((cuisine, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Options */}
          {mess.dietaryOptions?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Dietary Options</h3>
              <div className="flex flex-wrap gap-2">
                {mess.dietaryOptions.map((option, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Features */}
          {mess.specialFeatures?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Special Features</h3>
              <div className="flex flex-wrap gap-2">
                {mess.specialFeatures.map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-sm rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          {mess.subscriptionPlans?.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Subscription Plans</h3>
              <div className="space-y-4">
                {mess.subscriptionPlans.map((plan) => (
                  <div 
                    key={plan.id || plan._id} 
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-lg">{plan.name}</div>
                        <div className="text-gray-600">{plan.durationDays} days</div>
                        {plan.description && (
                          <div className="text-sm text-gray-500 mt-1">{plan.description}</div>
                        )}
                      </div>
                      <div className="text-xl font-bold text-primary-600">₹{plan.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessDetailsPopup;