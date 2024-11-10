import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InterviewCard from '../components/InterviewCard';
import { useSelector } from 'react-redux';

export default function MyInterviews() {

  const {currentUser} = useSelector((state) => state.user);
  const [experiences, setExperiences] = useState([]);
  const [visibleExperiences, setVisibleExperiences] = useState(10);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {

    try {
      const response = await fetch(`/backend/user/interviews/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }
      const data = await response.json();
      setExperiences(data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }
  };

  const handleShowMore = () => {
    setVisibleExperiences(prev => prev + 10);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Interview Experiences</h1>
          <p className="mt-2 text-gray-600">View all your contributions to interview experiences</p>
        </div>

        {/* Experiences Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {experiences.slice(0, visibleExperiences).map((exp, index) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <InterviewCard experience={exp} />
            </motion.div>
          ))}
        </motion.div>

        {/* Show More Button */}
        {visibleExperiences < experiences.length && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleShowMore}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-medium shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}