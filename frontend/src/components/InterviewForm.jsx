import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function InterviewForm({ toggleModal }) {

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    position: '',
    yoe: '',
    verdict: '',
    experience: '',
    rating: 0,
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

    if (!formData.fullName || !formData.company || !formData.position || !formData.yoe || !formData.verdict || !formData.experience || !formData.rating) {
      setError('All fields are required, including rating');
      return;
    }

    try {
      const response = await fetch('/backend/interviews/createInterviewExp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef : currentUser._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const data = await response.json();
      setSuccess('Experience submitted successfully!');

      // Reset form after successful submission
      setFormData({
        fullName: '',
        company: '',
        position: '',
        yoe: '',
        verdict: '',
        experience: '',
        rating: 0,
      });

      // Optionally close the modal after a delay
      setTimeout(() => {
        toggleModal();
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="relative rounded-2xl shadow-2xl w-full max-w-4xl mx-auto bg-cover bg-center"
      style={{
        backgroundImage: 'url(/assets/interview.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl"></div>

      {/* Container for form with internal scrolling on small screens */}
      <div className="relative z-10 p-6 max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
        <button
          onClick={toggleModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Share Your Interview Experience
          </h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition duration-300 bg-white bg-opacity-50 px-3 py-2 text-base"
                placeholder="Enter your name"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="yoe" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                id="yoe"
                value={formData.yoe}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition duration-300 bg-white bg-opacity-50 px-3 py-2 text-base"
                placeholder="Enter years of experience"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={formData.company}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition duration-300 bg-white bg-opacity-50 px-3 py-2 text-base"
                placeholder="Enter company name"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="verdict" className="block text-sm font-medium text-gray-700">
                Verdict
              </label>
              <select
                id="verdict"
                value={formData.verdict}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition duration-300 bg-white bg-opacity-50 px-3 py-2 text-base"
                onChange={handleChange}
              >
                <option value="">Select verdict</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                id="position"
                value={formData.position}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition duration-300 bg-white bg-opacity-50 px-3 py-2 text-base"
                placeholder="Enter position title"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="flex justify-start space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className={`focus:outline-none transition-colors duration-200 ${
                      star <= formData.rating ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                  >
                    <Star
                      fill={star <= formData.rating ? 'currentColor' : 'none'}
                      size={24}
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <textarea
              id="experience"
              value={formData.experience}
              rows="5"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition duration-300 bg-white bg-opacity-50 px-3 py-2 text-base"
              placeholder="Describe your interview experience..."
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105 font-semibold text-base"
          >
            Submit Experience
          </button>
        </form>
      </div>
    </motion.div>
  );
}
