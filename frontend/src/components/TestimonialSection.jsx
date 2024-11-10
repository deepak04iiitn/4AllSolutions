import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import TestimonialForm from './TestimonialForm';
import TestimonialSlider from './TestimonialSlider';
import { useSelector } from 'react-redux';

const CustomAlert = ({ children }) => (
  <div className="max-w-md mx-auto mb-6 px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-center">
    <p className="text-sm font-medium">{children}</p>
  </div>
);

export default function TestimonialSection() {
  const [showForm, setShowForm] = useState(false);
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/backend/testimonials/getTestimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleTestimonialClick = () => {
    if (currentUser) {
      setShowForm(true);
      setShowAuthAlert(false);
    } else {
      setShowAuthAlert(true);
      setTimeout(() => setShowAuthAlert(false), 5000);
    }
  };

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!showForm ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Quote className="w-12 h-12 text-purple-500" />
            </div>
            
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 mb-6">
              Share Your Success Story
            </h2>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
              Join thousands of professionals who found their dream careers through TrendingJobs4All. Your journey could inspire others!
            </p>

            {showAuthAlert && (
              <CustomAlert>
                Please sign in to share your testimonial.
              </CustomAlert>
            )}
            
            <button
              onClick={handleTestimonialClick}
              className="inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Quote className="w-5 h-5 mr-2" />
              Share Your Testimonial
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <button
              onClick={() => setShowForm(false)}
              className="mb-6 inline-flex items-center px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
            <TestimonialForm onTestimonialSubmit={() => {
              setShowForm(false);
              fetchTestimonials();
            }} />
          </div>
        )}

        {/* Testimonial Slider */}
        {!loading && testimonials.length > 0 && (
          <div className="mt-16">
            <TestimonialSlider testimonials={testimonials} />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}