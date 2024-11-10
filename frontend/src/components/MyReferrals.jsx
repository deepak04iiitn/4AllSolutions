import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReferralCard from '../components/ReferralCard';
import { useSelector } from 'react-redux';

export default function MyReferrals() {

  const {currentUser} = useSelector((state) => state.user);
  const [referrals, setReferrals] = useState([]);
  const [visibleReferrals, setVisibleReferrals] = useState(10);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await fetch(`/backend/user/referrals/${currentUser._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }
      const data = await response.json();
      setReferrals(data);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const handleShowMore = () => {
    setVisibleReferrals(prev => prev + 10);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Referrals</h1>
          <p className="mt-2 text-gray-600">View all your contributions to referrals</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {referrals.slice(0, visibleReferrals).map((ref, index) => (
            <motion.div
              key={ref._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ReferralCard referral={ref} />
            </motion.div>
          ))}
        </motion.div>

        {visibleReferrals < referrals.length && (
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              onClick={handleShowMore} 
              className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Show More
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}