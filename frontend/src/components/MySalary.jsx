import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SalaryCard from './SalaryCard';
import { motion } from 'framer-motion';

export default function MySalary() {

  const {currentUser} = useSelector((state) => state.user);
  const [salaries, setSalaries] = useState([]);
  const [visibleSalaries, setVisibleSalaries] = useState(10);
  
  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await fetch(`/backend/user/salary/${currentUser._id}`);
      if (!response.ok) throw new Error('Failed to fetch salaries');
      const data = await response.json();
      setSalaries(data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  const handleShowMore = () => {
    setVisibleSalaries(prev => prev + 10);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Salary Structures</h1>
          <p className="mt-2 text-gray-600">View all your contributions to salary structures</p>
        </div>
        
        {/* Salary Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {salaries.slice(0, visibleSalaries).map((sal, index) => (
            <motion.div
              key={sal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SalaryCard salary={sal} />
            </motion.div>
          ))}
        </motion.div>

        {/* Show More Button */}
        {visibleSalaries < salaries.length && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleShowMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

