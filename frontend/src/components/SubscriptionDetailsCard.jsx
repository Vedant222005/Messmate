import React from 'react';
import { Calendar, Clock, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Added optional showHeader prop to avoid duplicating mess name when embedded under a header card
const SubscriptionDetailsCard = ({ subscription, showHeader = true }) => {
  const {
    mess,
    subscriptionStartDate,
    subscriptionEndDate,
    totalDays,
    daysSpent,
    daysRemaining,
    status,
    paymentStatus,
    amountPaid,
    amountDue,
    totalPrice
  } = subscription;

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate progress percentage
  const progressPercentage = Math.round((daysSpent / totalDays) * 100);

  // Payment progress percentage
  const paymentProgressPercentage = Math.round((amountPaid / totalPrice) * 100);

  // Status badge color
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Payment status badge color
  const getPaymentStatusColor = () => {
    switch (paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partially_paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Optional Header with Mess Name */}
      {showHeader && (
        <div className="bg-primary-500 text-white p-4">
          <h3 className="text-lg font-medium">{mess?.name || 'Subscription'}</h3>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      )}

      {/* Subscription Details */}
      <div className="p-4">
        {!showHeader && (
          <div className="flex items-center mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Start Date</div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              <span>{formatDate(subscriptionStartDate)}</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">End Date</div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              <span>{formatDate(subscriptionEndDate)}</span>
            </div>
          </div>
        </div>

        {/* Days Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Days Progress</span>
            <span className="text-sm text-gray-500">{daysSpent} of {totalDays} days</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-500 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{daysRemaining} days remaining</span>
            <span className="text-xs text-gray-500">{progressPercentage}% completed</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Payment Details</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentStatusColor()}`}>
              {paymentStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-sm text-gray-500">Amount Paid</div>
              <div className="flex items-center text-green-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>₹{amountPaid.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Amount Due</div>
              <div className="flex items-center text-red-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>₹{amountDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Payment Progress</span>
              <span className="text-sm text-gray-500">₹{amountPaid.toFixed(2)} of ₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${paymentProgressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">₹{amountDue.toFixed(2)} remaining</span>
              <span className="text-xs text-gray-500">{paymentProgressPercentage}% paid</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-sm font-medium">
            Make Payment
          </button>
          <button 
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
            onClick={() => {
              // Scroll to the absence planning section
              const absenceSection = document.getElementById('absence-planning-section');
              if (absenceSection) {
                absenceSection.scrollIntoView({ behavior: 'smooth' });
                // Highlight the section briefly
                absenceSection.classList.add('highlight-section');
                setTimeout(() => {
                  absenceSection.classList.remove('highlight-section');
                }, 2000);
              }
            }}
          >
            Report Absence
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsCard;