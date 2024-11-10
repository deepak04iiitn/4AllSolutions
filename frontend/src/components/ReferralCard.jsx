import React, { useState } from 'react';
import { ChevronDown, X, ThumbsUp, ThumbsDown, MessageCircle, Send , Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReferralCommentSection from './referralCommentSection';

export default function ReferralCard({ referral }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [likes, setLikes] = useState(referral?.numberOfLikes || 0);
  const [dislikes, setDislikes] = useState(referral?.numberOfDislikes || 0);
  const [comment, setComment] = useState('');

  if (!referral) {
    return <div>Loading...</div>;
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/backend/referrals/likeReferral/${referral._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to like referral');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error liking referral:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`/backend/referrals/dislikeReferral/${referral._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to dislike referral');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error disliking referral:', error);
    }
  };

  const handleLinkedInClick = (linkedinUrl) => {
    if (linkedinUrl && linkedinUrl !== 'Not Provided') {
      // Add https:// if not present
      const url = linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`;
      window.open(url, '_blank');
    }
  };


  const InteractionRow = ({ isModal = false }) => (
    <motion.div
      className={`p-4 flex justify-between items-center border-t border-blue-200 ${
        isModal ? 'bg-gray-100' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <motion.button
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          onClick={handleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsUp className="mr-1" size={18} />
          {likes}
        </motion.button>
        <motion.button
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          onClick={handleDislike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsDown className="mr-1" size={18} />
          {dislikes}
        </motion.button>
      </div>
      <motion.button
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCommentModalOpen(true)}
      >
        <MessageCircle size={18} />
        <span>Comments</span>
      </motion.button>
    </motion.div>
  );

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg shadow-lg overflow-hidden h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Main card content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <motion.h3
              className="text-xl font-bold text-blue-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {referral.company}
            </motion.h3>
            
            {referral.linkedin !== 'Not Provided' && (
              <motion.div
                className="relative group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  className="p-2 rounded-full hover:bg-blue-100 transition-colors relative"
                  onClick={() => handleLinkedInClick(referral.linkedin)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin size={20} className="text-blue-600" />
                  <span className="absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                    Connect with referrer
                  </span>
                </motion.button>
              </motion.div>
            )}
          </div>

          <motion.div
            className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-blue-100 px-2 py-1 rounded-full">
              {referral.positions.length} {referral.positions.length === 1 ? 'Position' : 'Positions'}
            </span>
            <span className="bg-green-100 px-2 py-1 rounded-full">
              Referral by: {referral.fullName}
            </span>
          </motion.div>

          <motion.div
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-purple-100 px-2 py-1 rounded-full">
              Contact: {referral.contact}
            </span>
          </motion.div>
        </div>

        <div className="px-6 pb-4 flex-grow">
          <motion.button
            className="text-blue-600 hover:text-blue-800 flex items-center"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
          >
            View details <ChevronDown className="ml-1" size={16} />
          </motion.button>
        </div>
        <InteractionRow />
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-green-600 relative">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {referral.company}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
                    Referral by: {referral.fullName}
                  </span>
                  <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
                    Contact: {referral.contact}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-gray-800">Available Positions</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {referral.positions.map((pos, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {pos.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {pos.jobid || 'Not found'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 text-center">
                    <p className="text-gray-700 font-medium">
                      Share your CV and details at: <span className="text-blue-600">{referral.contact}</span> 
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button 
                      className="inline-flex items-center justify-center gap-3 px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group"
                      onClick={() => handleLinkedInClick(referral.linkedin)}
                    >
                      <Linkedin 
                        size={20} 
                        className="transition-transform duration-300 group-hover:scale-110" 
                      />
                      <span className="font-semibold">Connect on LinkedIn</span>
                    </button>
                  </div>

                  <div className="mt-6 text-center border-t pt-6">
                    <p className="text-gray-600 italic font-serif text-lg">
                      "Your next big opportunity awaits! Best of luck with your application!"
                    </p>
                  </div>
                  
                </div>
              </div>
              <InteractionRow isModal={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {isCommentModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[90vh] flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-t-2xl relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Discussion</h3>
                  <p className="text-blue-200 text-sm mt-1">Share your thoughts and experiences</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCommentModalOpen(false)}
                  className="text-white hover:text-blue-200 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 custom-scrollbar">
                  <ReferralCommentSection refId={referral._id} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #60a5fa #e0f2fe;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e0f2fe;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #60a5fa;
          border-radius: 4px;
          border: 2px solid #e0f2fe;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #3b82f6;
        }
      `}</style>
    </>
  );
}