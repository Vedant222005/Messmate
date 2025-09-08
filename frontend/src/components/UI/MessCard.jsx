import React from 'react';
import { Star, MapPin, DollarSign } from 'lucide-react';

// Card used in lists. For Explore section, today's menu stays visible here.
// For subscribed messes, details (payment/attendance/full menu) should be shown in a separate popup/card.
const MessCard = ({ mess, onSubscribe, onViewDetails, showSubscribeButton = true, showTodaysMenu = true }) => {
  // Determine today's menu if menu items carry dayOfWeek
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const menuToShow = Array.isArray(mess.menu)
    ? mess.menu
        .filter((item) => !item.dayOfWeek || item.dayOfWeek.toLowerCase() === today)
        .slice(0, 3)
    : [];

  return (
    <div className="card p-6">
      <div className="relative">
        <img
          src={mess.image}
          alt={mess.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        {mess.isSubscribed && (
          <span className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Subscribed
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{mess.name}</h3>
      
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
        <span className="ml-1 text-sm font-medium text-gray-700">{mess.rating}</span>
      </div>
      
      <div className="flex items-center text-gray-600 mb-3">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="text-sm">{mess.location}</span>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-primary-500">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="font-semibold">₹{mess.monthlyPrice}/month</span>
        </div>
      </div>
      
      {/* Today's Menu Preview (visible in Explore cards) */}
      {showTodaysMenu && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Today's Menu</h4>
          <div className="grid grid-cols-3 gap-2">
            {menuToShow.map((item, index) => (
              <div key={index} className="text-center">
                <img
                  src={item.image}
                  alt={item.dish}
                  className="w-full h-12 object-cover rounded-md mb-1"
                />
                <p className="text-xs text-gray-600 truncate">{item.dish}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showSubscribeButton && !mess.isSubscribed && (
        <button
          onClick={() => onSubscribe(mess.id)}
          className="w-full btn btn-primary"
        >
          Subscribe Now
        </button>
      )}
      
      {mess.isSubscribed && (
        <button className="w-full btn btn-secondary" onClick={() => onViewDetails && onViewDetails(mess)}>
          View Details
        </button>
      )}
    </div>
  );
};

export default MessCard;