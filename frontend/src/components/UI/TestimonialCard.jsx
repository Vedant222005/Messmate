import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="card p-6 text-center animate-slide-up">
      <div className="relative mb-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full mx-auto object-cover"
        />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary-500 p-2 rounded-full">
            <Quote className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
      
      <div className="flex justify-center mb-2">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
        ))}
      </div>
      
      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
      <p className="text-sm text-gray-500">{testimonial.role}</p>
    </div>
  );
};

export default TestimonialCard;