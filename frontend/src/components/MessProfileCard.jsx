import React, { useState } from 'react';
import { Clock, Calendar, DollarSign, Users, Utensils, MapPin, Phone, Mail, Star, Check } from 'lucide-react';

// Updated to support a popup flow via onViewDetails from parent (CustomerDashboard)
const MessProfileCard = ({ mess, isSubscribed, onSubscribe, onViewDetails }) => {
  const [selectedPlan, setSelectedPlan] = useState(mess.subscriptionPlans?.[0]?.id || '');

  const handleSubscribe = () => {
    if (selectedPlan) {
      onSubscribe(mess._id, selectedPlan);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Mess Header with Image */}
      <div className="relative h-48 bg-gray-300">
        {mess.imageUrl ? (
          <img 
            src={mess.imageUrl} 
            alt={mess.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Utensils className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-bold text-white">{mess.name}</h3>
        </div>
      </div>

      {/* Basic Info */}
      <div className="p-4">
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

        <p className="text-gray-600 mb-3">{mess.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600 truncate">{mess.address}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{mess.capacity} capacity</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">
              {mess.openingTime} - {mess.closingTime}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">
              {mess.daysOpen?.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ')}
            </span>
          </div>
        </div>

        {/* View Details opens a popup in parent if provided */}
        <button 
          onClick={() => (onViewDetails ? onViewDetails(mess) : null)} 
          className="text-primary-500 text-sm font-medium hover:text-primary-600 mb-2"
        >
          View Details
        </button>

        {/* Subscription Plans preview (selection kept here so Subscribe works from card) */}
        {mess.subscriptionPlans?.length > 0 && !isSubscribed && (
          <div className="mt-2">
            <h4 className="font-medium mb-2">Subscription Plans</h4>
            <div className="space-y-3">
              {mess.subscriptionPlans.map((plan) => (
                <div 
                  key={plan.id || plan._id} 
                  className={`p-3 border rounded-md cursor-pointer ${selectedPlan === (plan.id || plan._id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                  onClick={() => setSelectedPlan(plan.id || plan._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-gray-600">{plan.durationDays} days</div>
                      {plan.description && (
                        <div className="text-xs text-gray-500 mt-1">{plan.description}</div>
                      )}
                    </div>
                    <div className="text-lg font-bold text-primary-600">₹{plan.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4">
          {isSubscribed ? (
            <button 
              className="w-full py-2 px-4 bg-green-500 text-white rounded-md font-medium flex items-center justify-center"
              disabled
            >
              <Check className="h-5 w-5 mr-2" />
              Subscribed
            </button>
          ) : (
            <button 
              onClick={handleSubscribe} 
              className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md font-medium"
              disabled={!selectedPlan}
            >
              Subscribe Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessProfileCard;