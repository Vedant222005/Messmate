import React from 'react';
import { Bell, Clock, CreditCard, Info } from 'lucide-react';
import { mockNotifications } from '../../utils/mockData';

const NotificationDropdown = ({ onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'menu': return <Bell className="w-4 h-4 text-blue-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {mockNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {notification.time}
                </div>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-sm text-primary-500 font-medium hover:text-primary-600 transition-colors duration-200">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;