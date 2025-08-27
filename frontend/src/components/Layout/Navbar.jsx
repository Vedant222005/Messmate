import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';
import { authAPI } from '../../utils/api';
import NotificationDropdown from '../UI/NotificationDropdown';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      // Remove token from localStorage
      localStorage.removeItem('messmate_token');
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove token and log user out on client side even if API call fails
      localStorage.removeItem('messmate_token');
      onLogout();
      navigate('/');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">MessMate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!user ? (
                <>
                  <Link to="/" className={`navbar-link ${isActive('/') ? 'text-primary-500 bg-primary-50' : ''}`}>
                    Home
                  </Link>
                  <Link to="/about" className={`navbar-link ${isActive('/about') ? 'text-primary-500 bg-primary-50' : ''}`}>
                    About
                  </Link>
                  <Link to="/contact" className={`navbar-link ${isActive('/contact') ? 'text-primary-500 bg-primary-50' : ''}`}>
                    Contact
                  </Link>
                  <Link to="/login" className="btn btn-primary ml-4">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-secondary">
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors duration-200"
                    >
                      <Bell className="w-6 h-6 text-gray-700" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        3
                      </span>
                    </button>
                    {showNotifications && (
                      <NotificationDropdown onClose={() => setShowNotifications(false)} />
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowProfile(!showProfile)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <User className="w-6 h-6 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </button>
                    {showProfile && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowProfile(false)}
                        >
                          <User className="w-4 h-4 inline mr-2" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mb-4">
              {!user ? (
                <>
                  <Link to="/" className="block navbar-link" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                  <Link to="/about" className="block navbar-link" onClick={() => setIsOpen(false)}>
                    About
                  </Link>
                  <Link to="/contact" className="block navbar-link" onClick={() => setIsOpen(false)}>
                    Contact
                  </Link>
                  <div className="pt-4 space-y-2">
                    <Link to="/login" className="block w-full btn btn-primary text-center" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="block w-full btn btn-secondary text-center" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg mb-3">
                    <User className="w-8 h-8 text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="block navbar-link" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left navbar-link text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;