import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, AlertCircle, Clock, Calendar, DollarSign, Plus, Minus, Utensils } from 'lucide-react';
import { authAPI } from '../utils/api';

const RegisterPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  
  // Additional state for mess provider registration
  const [messData, setMessData] = useState({
    messName: '',
    messDescription: '',
    messAddress: '',
    cuisineTypes: [],
    pricePerMeal: '',
    capacity: '',
    openingTime: '',
    closingTime: '',
    daysOpen: [],
    contactPhone: '',
    contactEmail: '',
    specialFeatures: [],
    dietaryOptions: [],
    newCuisineType: '',
    newSpecialFeature: '',
    subscriptionPlans: [
      { name: 'Weekly', durationDays: 7, price: '', description: 'Weekly subscription plan' },
      { name: 'Monthly', durationDays: 30, price: '', description: 'Monthly subscription plan' }
    ]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // No longer need password validation state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset error when user starts typing
    if (error) {
      setError('');
    }
  };
  
  const handleMessDataChange = (e) => {
    const { name, value } = e.target;
    setMessData({
      ...messData,
      [name]: value
    });
  };
  
  const handleDayToggle = (day) => {
    const updatedDays = [...messData.daysOpen];
    if (updatedDays.includes(day)) {
      const index = updatedDays.indexOf(day);
      updatedDays.splice(index, 1);
    } else {
      updatedDays.push(day);
    }
    setMessData({
      ...messData,
      daysOpen: updatedDays
    });
  };
  
  const handleDietaryOptionToggle = (option) => {
    const updatedOptions = [...messData.dietaryOptions];
    if (updatedOptions.includes(option)) {
      const index = updatedOptions.indexOf(option);
      updatedOptions.splice(index, 1);
    } else {
      updatedOptions.push(option);
    }
    setMessData({
      ...messData,
      dietaryOptions: updatedOptions
    });
  };
  
  const handleAddCuisineType = () => {
    if (messData.newCuisineType.trim() !== '') {
      setMessData({
        ...messData,
        cuisineTypes: [...messData.cuisineTypes, messData.newCuisineType.trim()],
        newCuisineType: ''
      });
    }
  };
  
  const handleAddSpecialFeature = () => {
    if (messData.newSpecialFeature.trim() !== '') {
      setMessData({
        ...messData,
        specialFeatures: [...messData.specialFeatures, messData.newSpecialFeature.trim()],
        newSpecialFeature: ''
      });
    }
  };
  
  const handleSubscriptionPlanChange = (index, field, value) => {
    const updatedPlans = [...messData.subscriptionPlans];
    updatedPlans[index][field] = value;
    setMessData({
      ...messData,
      subscriptionPlans: updatedPlans
    });
  };

  const validatePassword = (password) => {
    // Only check if password exists
    if (!password || password.trim() === '') {
      return 'Password cannot be empty';
    }
    
    return null; // Password is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    // Validate mess data if provider role is selected
    if (formData.role === 'provider') {
      if (!messData.messName || !messData.messAddress || !messData.pricePerMeal || !messData.capacity || !messData.contactPhone) {
        setError('Please fill all required mess details');
        return;
      }
      
      // Validate subscription plans
      for (const plan of messData.subscriptionPlans) {
        if (!plan.price) {
          setError('Please set prices for all subscription plans');
          return;
        }
      }
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      
      const response = await authAPI.register(registerData);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('messmate_token', token);
      
      // If provider, create mess
      if (user.role === 'provider') {
        try {
          // Format mess data
          const messPayload = {
            name: messData.messName,
            description: messData.messDescription,
            address: messData.messAddress,
            cuisineTypes: messData.cuisineTypes,
            pricePerMeal: Number(messData.pricePerMeal),
            capacity: Number(messData.capacity),
            openingTime: messData.openingTime,
            closingTime: messData.closingTime,
            daysOpen: messData.daysOpen,
            contactPhone: messData.contactPhone,
            contactEmail: messData.contactEmail || user.email,
            specialFeatures: messData.specialFeatures,
            dietaryOptions: messData.dietaryOptions,
            subscriptionPlans: messData.subscriptionPlans.map(plan => ({
              ...plan,
              price: Number(plan.price),
              durationDays: Number(plan.durationDays)
            }))
          };
          
          // Create mess using API
          await messAPI.createMess(messPayload);
        } catch (messError) {
          console.error('Error creating mess:', messError);
          // Continue anyway, user can create mess later
        }
      }
      
      onLogin(user);
      setIsLoading(false);
      
      // Navigate based on role
      if (user.role === 'customer') {
        navigate('/dashboard');
      } else {
        navigate('/provider-dashboard');
      }
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join MessMate</h2>
          <p className="mt-2 text-gray-600">Create your account and get started</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as
            </label>
            <div className="flex space-x-4">
              <label className="flex-1">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  formData.role === 'customer' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <User className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                  <p className="text-center text-sm font-medium">Customer</p>
                </div>
              </label>
              
              <label className="flex-1">
                <input
                  type="radio"
                  name="role"
                  value="provider"
                  checked={formData.role === 'provider'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  formData.role === 'provider' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <User className="w-6 h-6 mx-auto mb-2 text-primary-500" />
                  <p className="text-center text-sm font-medium">Mess Provider</p>
                </div>
              </label>
            </div>
          </div>
          
          {/* Mess Provider Form Fields - Only shown when provider role is selected */}
          {formData.role === 'provider' && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mess Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mess Name*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Utensils className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="messName"
                      value={messData.messName}
                      onChange={handleMessDataChange}
                      className="pl-10 w-full input"
                      placeholder="Enter mess name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mess Address*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="messAddress"
                      value={messData.messAddress}
                      onChange={handleMessDataChange}
                      className="pl-10 w-full input"
                      placeholder="Enter mess address"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="messDescription"
                  value={messData.messDescription}
                  onChange={handleMessDataChange}
                  className="w-full input"
                  placeholder="Describe your mess"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Meal*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="pricePerMeal"
                      value={messData.pricePerMeal}
                      onChange={handleMessDataChange}
                      className="pl-10 w-full input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="capacity"
                      value={messData.capacity}
                      onChange={handleMessDataChange}
                      className="pl-10 w-full input"
                      placeholder="Maximum number of customers"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="openingTime"
                      value={messData.openingTime}
                      onChange={handleMessDataChange}
                      className="pl-10 w-full input"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="closingTime"
                      value={messData.closingTime}
                      onChange={handleMessDataChange}
                      className="pl-10 w-full input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Days Open</label>
                <div className="flex flex-wrap gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-1 rounded-full text-sm ${messData.daysOpen.includes(day) ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={messData.contactPhone}
                    onChange={handleMessDataChange}
                    className="pl-10 w-full input"
                    placeholder="Contact phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="contactEmail"
                    value={messData.contactEmail}
                    onChange={handleMessDataChange}
                    className="pl-10 w-full input"
                    placeholder="Contact email (if different from account)"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Types</label>
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      name="newCuisineType"
                      value={messData.newCuisineType}
                      onChange={handleMessDataChange}
                      className="w-full input"
                      placeholder="Add cuisine type"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCuisineType}
                    className="ml-2 p-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {messData.cuisineTypes.map((cuisine, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Features</label>
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      name="newSpecialFeature"
                      value={messData.newSpecialFeature}
                      onChange={handleMessDataChange}
                      className="w-full input-field"
                      placeholder="Add special feature"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpecialFeature}
                    className="ml-2 p-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {messData.specialFeatures.map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Options</label>
                <div className="flex flex-wrap gap-2">
                  {['vegetarian', 'non-vegetarian', 'vegan', 'jain', 'gluten-free'].map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleDietaryOptionToggle(option)}
                      className={`px-3 py-1 rounded-full text-sm ${messData.dietaryOptions.includes(option) ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plans</label>
                {messData.subscriptionPlans.map((plan, index) => (
                  <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
                    <div className="font-medium">{plan.name} Plan</div>
                    <div className="text-sm text-gray-500 mb-2">{plan.durationDays} days</div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => handleSubscriptionPlanChange(index, 'price', e.target.value)}
                          className="pl-10 w-full input"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={plan.description}
                        onChange={(e) => handleSubscriptionPlanChange(index, 'description', e.target.value)}
                        className="w-full input"
                        placeholder="Plan description"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {formData.role === 'customer' ? 'Full Name' : 'Mess Name'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field pl-10"
                placeholder={formData.role === 'customer' ? 'Enter your full name' : 'Enter mess name'}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field pl-10"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="input-field pl-10"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address Field */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="input-field pl-10"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field pl-10 pr-10"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Please enter a password for your account.
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="input-field pl-10 pr-10"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-4 text-lg"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;