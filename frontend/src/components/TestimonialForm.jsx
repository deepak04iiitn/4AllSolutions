import React, { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function TestimonialForm({ onTestimonialSubmit }) {

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organization: '',
    testimonial: '',
    rating: 0,
    profileImage: ''
  });

  const {currentUser} = useSelector((state) => state.user);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    setFormData({ ...formData, rating: newRating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.testimonial || !formData.rating) {
      setError('Name, testimonial and rating are required');
      return;
    }

    try {
      // Create submission data with profile image from currentUser
      const submissionData = {
        ...formData,
        profileImage: currentUser.profilePicture, // Set profile image from currentUser
        userRef: currentUser._id,
      };

      const response = await fetch('/backend/testimonials/createTestimonial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess('Testimonial submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        role: '',
        organization: '',
        testimonial: '',
        rating: 0,
        profileImage: ''
      });

      // Call the callback function if provided
      if (onTestimonialSubmit) {
        setTimeout(onTestimonialSubmit, 1500); // Give time to show success message
      }
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
    }
  };


  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full transform translate-x-20 -translate-y-20 opacity-20" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-100 rounded-full transform -translate-x-20 translate-y-20 opacity-20" />
      
      <div className="relative z-10 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Quote size={24} className="text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Share Your Experience</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-500 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <input
                type="text"
                id="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`focus:outline-none transition-colors duration-200 hover:scale-110 transform ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star
                      fill={star <= formData.rating ? 'currentColor' : 'none'}
                      size={28}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-1">
              Your Testimonial
            </label>
            <textarea
              id="testimonial"
              value={formData.testimonial}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Share your experience with us..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-200 font-medium"
          >
            Submit Testimonial
          </button>
        </form>
      </div>
    </div>
  );
}