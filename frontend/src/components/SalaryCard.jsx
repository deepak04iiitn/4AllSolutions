import React, { useState } from 'react';
import { ChevronDown, X, Building, MapPin, Briefcase, Banknote, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SalaryCommentSection from './SalaryCommentSection';

export default function SalaryCard({ salary }) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [likes, setLikes] = useState(salary?.numberOfLikes || 0);
  const [dislikes, setDislikes] = useState(salary?.numberOfDislikes || 0);

  if (!salary) {
    return <div>Loading...</div>;
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/backend/salary/likeSalary/${salary._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to like salary');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error liking salary:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`/backend/salary/dislikeSalary/${salary._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to dislike salary');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error disliking salary:', error);
    }
  };

  const InteractionRow = ({ isModal = false }) => (
    <motion.div
      className={`p-4 flex justify-between items-center border-t border-indigo-200 ${
        isModal ? 'bg-gray-100' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center space-x-4">
        <motion.button
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          onClick={handleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsUp className="mr-1" size={18} />
          {likes}
        </motion.button>
        <motion.button
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          onClick={handleDislike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsDown className="mr-1" size={18} />
          {dislikes}
        </motion.button>
      </div>
      <motion.button
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
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
        className="w-full sm:w-[340px] md:w-[384px] lg:w-96 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg shadow-lg overflow-hidden flex flex-col h-[280px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="p-4 sm:p-6 flex-grow">
          <motion.h3 
            className="text-lg sm:text-xl font-bold text-indigo-800 mb-2 line-clamp-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {salary.position}
          </motion.h3>
          <motion.div 
            className="flex flex-col gap-2 text-sm text-gray-600 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-indigo-100 px-2 py-1 rounded-full flex items-center w-full overflow-hidden">
              <Building size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{salary.company}</span>
            </span>
            <span className="bg-purple-100 px-2 py-1 rounded-full flex items-center w-full overflow-hidden">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{salary.location}</span>
            </span>
          </motion.div>
          <motion.div 
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="bg-indigo-100 px-2 py-1 rounded-full flex items-center w-full overflow-hidden">
              <Banknote size={14} className="mr-1 flex-shrink-0 text-indigo-500" />
              <span className="truncate">CTC: {salary.ctc} LPA</span>
            </span>
          </motion.div>
        </div>

        <div className="px-4 sm:px-6 pb-4 mt-auto border-t border-indigo-200 pt-4 bg-white bg-opacity-50">
          <div className="grid grid-cols-3 items-center">
            <div className="flex items-center space-x-2">
              <motion.button
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                onClick={handleLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp className="mr-1" size={18} />
                {likes}
              </motion.button>
              <motion.button
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                onClick={handleDislike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsDown className="mr-1" size={18} />
                {dislikes}
              </motion.button>
            </div>
            <div className="flex justify-center">
              <motion.button 
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCommentModalOpen(true)}
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">Comments</span>
              </motion.button>
            </div>
            <div className="flex justify-end">
              <motion.button
                className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
              >
                Details <ChevronDown className="ml-1" size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

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
              <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {salary.position} at {salary.company}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full flex items-center">
                    <MapPin size={14} className="mr-1" /> {salary.location}
                  </span>
                  <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full flex items-center">
                    <Briefcase size={14} className="mr-1" /> {salary.yearsOfExperience} years experience
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Education</td>
                      <td className="py-3 px-2 sm:px-4">{salary.education}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Years of Experience</td>
                      <td className="py-3 px-2 sm:px-4">{salary.yearsOfExperience} years</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Prior Experience</td>
                      <td className="py-3 px-2 sm:px-4">{salary.priorExperience}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Company</td>
                      <td className="py-3 px-2 sm:px-4">{salary.company}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Title/Level</td>
                      <td className="py-3 px-2 sm:px-4">{salary.position}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Location</td>
                      <td className="py-3 px-2 sm:px-4">{salary.location}</td>
                    </tr>
                    <tr className="border-b bg-indigo-50">
                      <td className="py-3 px-2 sm:px-4 font-semibold">CTC (Cost to Company)</td>
                      <td className="py-3 px-2 sm:px-4 font-semibold text-indigo-600">{salary.ctc} LPA</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Base Salary</td>
                      <td className="py-3 px-2 sm:px-4">{salary.salary}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Relocation/Signing Bonus</td>
                      <td className="py-3 px-2 sm:px-4">{salary.relocationSigningBonus || 'N/A'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Stock Bonus</td>
                      <td className="py-3 px-2 sm:px-4">{salary.stockBonus || 'N/A'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Annual Bonus</td>
                      <td className="py-3 px-2 sm:px-4">{salary.bonus || 'N/A'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Benefits</td>
                      <td className="py-3 px-2 sm:px-4">{salary.benefits}</td>
                    </tr>
                    {salary.otherDetails && (
                      <tr>
                        <td className="py-3 px-2 sm:px-4 font-semibold bg-gray-50">Other Details</td>
                        <td className="py-3 px-2 sm:px-4">{salary.otherDetails}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <InteractionRow isModal={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCommentModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md p-4 md:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommentModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[90vh] flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Discussion</h3>
                  <p className="text-indigo-200 text-sm mt-1">Share your thoughts about this salary</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCommentModalOpen(false)}
                  className="text-white hover:text-indigo-200 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 custom-scrollbar">
                  <SalaryCommentSection salId={salary._id} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #818cf8 #e0e7ff;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e0e7ff;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #818cf8;
          border-radius: 4px;
          border: 2px solid #e0e7ff;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6366f1;
        }
      `}</style>
    </>
  );
}