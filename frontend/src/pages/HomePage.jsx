import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Users, Star, Utensils, Calendar, MessageSquare } from 'lucide-react';
import TestimonialCard from '../components/UI/TestimonialCard';
import { mockTestimonials } from '../utils/mockData';

const HomePage = () => {
  const features = [
    {
      icon: <Utensils className="w-8 h-8 text-primary-500" />,
      title: "Daily Menus",
      description: "Browse fresh daily menus from multiple mess providers in your area."
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary-500" />,
      title: "Attendance Tracking",
      description: "Mark your presence easily and track your meal consumption patterns."
    },
    {
      icon: <Users className="w-8 h-8 text-primary-500" />,
      title: "Subscription Management",
      description: "Flexible subscription plans with easy renewals and cancellations."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-primary-500" />,
      title: "Direct Communication",
      description: "Stay connected with your mess providers for updates and feedback."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="animate-slide-up">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                MessMate – 
                <span className="text-primary-500"> Your Meal, Your Way</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with the best mess providers in your area. Track your meals, 
                manage subscriptions, and never miss a delicious meal again.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn btn-primary inline-flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/about" className="btn btn-secondary">
                  Learn More
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">500+</div>
                  <div className="text-gray-600 text-sm">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">50+</div>
                  <div className="text-gray-600 text-sm">Mess Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">4.8★</div>
                  <div className="text-gray-600 text-sm">Average Rating</div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                alt="Delicious meals"
                className="rounded-2xl shadow-2xl w-full object-cover animate-bounce-gentle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MessMate?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make meal management simple, efficient, and enjoyable for both 
              students and mess providers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How MessMate Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up">
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600">
                Create your account as a student or mess provider in minutes.
              </p>
            </div>
            
            <div className="text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse & Subscribe</h3>
              <p className="text-gray-600">
                Find the best mess options in your area and subscribe to your favorites.
              </p>
            </div>
            
            <div className="text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enjoy Meals</h3>
              <p className="text-gray-600">
                Track your meals, manage attendance, and enjoy delicious food daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied users
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Meal Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and mess providers who are already enjoying 
            the convenience of MessMate.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn bg-white text-primary-500 hover:bg-gray-100 px-8 py-4 text-lg inline-block">
              Join Now
            </Link>
            <Link to="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-500 px-8 py-4 text-lg inline-block">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;