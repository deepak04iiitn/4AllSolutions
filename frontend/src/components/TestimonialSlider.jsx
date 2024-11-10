import React, { useState } from 'react';
import { Star, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useSelector } from 'react-redux';

// Custom Modal component to replace shadcn Dialog
const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        {children}
      </div>
    </div>
  );
};

const TestimonialCard = ({ testimonial, onClick }) => {

  const { currentUser } = useSelector((state) => state.user);
  
  // Clamp testimonial text to roughly 3-4 lines (assuming average word length)
  const clampedTestimonial = testimonial.testimonial.length > 200 
    ? testimonial.testimonial.slice(0, 40) + '...'
    : testimonial.testimonial;

  return (

    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full w-full">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={testimonial.profileImage}
            alt={testimonial.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-purple-100"
          />
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-gray-800">{testimonial.name}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{testimonial.role}</p>
            <p className="text-purple-600 text-xs sm:text-sm">{testimonial.organization}</p>
          </div>
        </div>

        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                i < testimonial.rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex-grow">
          <p className="text-gray-600 italic text-sm sm:text-base">
            "{clampedTestimonial}"
          </p>
          {testimonial.testimonial.length > 200 && (
            <button
              onClick={onClick}
              className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-xs sm:text-sm"
            >
              Read more
            </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
          {new Date(testimonial.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const TestimonialModal = ({ isOpen, onClose, testimonial }) => {

  const { currentUser } = useSelector((state) => state.user);

  if (!testimonial) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-4">
          <img
            src={testimonial.profileImage}
            alt={testimonial.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-purple-100"
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{testimonial.name}</h2>
            <p className="text-gray-600">{testimonial.role}</p>
            <p className="text-purple-600">{testimonial.organization}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  i < testimonial.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed italic">
            "{testimonial.testimonial}"
          </p>
          
          <div className="mt-6 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
            Posted on {new Date(testimonial.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default function TestimonialSlider({ testimonials = [] }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const handleScroll = (direction) => {
    if (direction === 'left') {
      setScrollPosition((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    } else {
      setScrollPosition((prev) => (prev + 1) % testimonials.length);
    }
  };

  if (!testimonials.length) return null;

  return (
    <div className="relative w-full bg-gradient-to-b from-white to-gray-50 py-8 sm:py-12">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
      >
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      </button>
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
      >
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      </button>

      <div className="overflow-hidden mx-auto max-w-7xl px-4 sm:px-8">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${scrollPosition * 100}%)`,
          }}
        >
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="min-w-full sm:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1rem)] p-2 sm:p-4 flex-shrink-0"
            >
              <TestimonialCard
                testimonial={item}
                onClick={() => setSelectedTestimonial(item)}
              />
            </div>
          ))}
        </div>
      </div>

      <TestimonialModal
        isOpen={!!selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
        testimonial={selectedTestimonial}
      />
    </div>
  );
}