import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ProfilePage from './pages/ProfilePage';
import { authAPI } from './utils/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Check for stored user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('messmate_token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('messmate_token');
        }
      }
    };
    
    fetchUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('messmate_token');
    }
  };

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                user ? (
                  user.role === 'customer' ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/provider-dashboard" replace />
                  )
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                user ? (
                  user.role === 'customer' ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/provider-dashboard" replace />
                  )
                ) : (
                  <RegisterPage onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/provider-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['customer', 'provider', 'admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="max-w-2xl mx-auto text-center px-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">About MessMate</h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      MessMate is revolutionizing the way students and mess providers connect. 
                      We provide a seamless platform for meal management, subscription tracking, 
                      and communication between mess owners and their customers.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-primary-600 font-bold text-2xl">500+</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Happy Students</h3>
                        <p className="text-gray-600">Satisfied customers across multiple cities</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-primary-600 font-bold text-2xl">50+</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Mess Partners</h3>
                        <p className="text-gray-600">Trusted mess providers on our platform</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-primary-600 font-bold text-2xl">24/7</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                        <p className="text-gray-600">Round-the-clock customer assistance</p>
                      </div>
                    </div>
                  </div>
                </div>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="max-w-2xl mx-auto px-4">
                    <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
                      <p className="text-xl text-gray-600">
                        Have questions? We'd love to hear from you.
                      </p>
                    </div>
                    
                    <div className="card p-8">
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input type="text" className="input-field" placeholder="Your name" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" className="input-field" placeholder="Your email" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                          <input type="text" className="input-field" placeholder="Subject" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                          <textarea className="input-field h-32" placeholder="Your message"></textarea>
                        </div>
                        <button type="submit" className="w-full btn btn-primary">
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;