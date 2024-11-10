import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ChevronDown, X, MessageCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InterviewCommentSection from './InterviewCommentSection';

export default function InterviewCard({ experience }) {
  const [likes, setLikes] = useState(experience?.numberOfLikes || 0);
  const [dislikes, setDislikes] = useState(experience?.numberOfDislikes || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  if (!experience) {
    return <div>Loading...</div>;
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/backend/interviews/likeExperience/${experience._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to like experience');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error liking experience:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`/backend/interviews/dislikeExperience/${experience._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to dislike experience');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error disliking experience:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    try {
      const response = await fetch(`/backend/interviews/addComment/${experience._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });
      
      if (!response.ok) throw new Error('Failed to submit comment');
      
      setComment('');
      setIsCommentModalOpen(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const formatExperience = (text) => {
    return text?.split(/(?<=\.|\:)/).map((item, index) => (
      <p key={index} className="mb-6">
        {item.trim()}
      </p>
    )) || [];
  };

  const CommentButton = () => (
    <motion.button
      type="button"
      className="flex items-center justify-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 md:px-4 rounded-full shadow-lg transition-colors group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsCommentModalOpen(true)}
    >
      <MessageCircle size={18} className="group-hover:animate-pulse" />
      <span className="hidden md:inline text-sm font-medium">Comments</span>
    </motion.button>
  );

  const InteractionRow = ({ isModal = false }) => (
    <motion.div
      className={`p-4 flex items-center justify-between border-t border-indigo-200 ${
        isModal ? 'bg-gray-100' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Left section - Like/Dislike buttons */}
      <div className="flex-1 flex items-center space-x-4">
        <motion.button
          type="button"
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          onClick={handleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsUp className="mr-1" size={18} />
          <span className="min-w-[1ch]">{likes}</span>
        </motion.button>
        <motion.button
          type="button"
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          onClick={handleDislike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThumbsDown className="mr-1" size={18} />
          <span className="min-w-[1ch]">{dislikes}</span>
        </motion.button>
      </div>
  
      {/* Middle section - Comment button */}
      <div className="flex-1 flex justify-center">
        <motion.button
          type="button"
          className="flex items-center justify-center space-x-2 text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 md:px-4 rounded-full shadow-lg transition-colors group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCommentModalOpen(true)}
        >
          <MessageCircle size={18} className="group-hover:animate-pulse" />
          <span className="hidden md:inline text-sm font-medium">Comments</span>
        </motion.button>
      </div>
  
      {/* Right section - Rating stars */}
      <div className="flex-1 flex items-center justify-end">
        {[...Array(5)].map((_, index) => (
          <motion.span
            key={index}
            className={`text-lg md:text-2xl ${
              index < (experience.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            ★
          </motion.span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg shadow-lg overflow-hidden h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="p-4 md:p-6">
          <motion.h3
            className="text-lg md:text-xl font-bold text-indigo-800 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {experience.company || 'Unknown Company'} - {experience.position || 'Unknown Position'}
          </motion.h3>
          <motion.div
            className="flex flex-wrap gap-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-indigo-100 px-2 py-1 rounded-full">YOE: {experience.yoe || 'N/A'}</span>
            <span className={`px-2 py-1 rounded-full ${
              experience.verdict === 'selected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {experience.verdict ? (
                experience.verdict.charAt(0).toUpperCase() + experience.verdict.slice(1)
              ) : (
                'N/A'
              )}
            </span>
          </motion.div>
        </div>
        
        <div className="px-4 md:px-6 pb-4 flex-grow">
          <motion.p
            className="text-gray-700 line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {experience.experience || 'No experience details available.'}
          </motion.p>
          <motion.button
            className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
          >
            Read more <ChevronDown className="ml-1" size={16} />
          </motion.button>
        </div>

        <InteractionRow />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden m-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {experience.company || 'Unknown Company'} - {experience.position || 'Unknown Position'}
                </h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">
                    YOE: {experience.yoe || 'N/A'}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    experience.verdict === 'selected' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {experience.verdict ? (
                      experience.verdict.charAt(0).toUpperCase() + experience.verdict.slice(1)
                    ) : (
                      'N/A'
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto">
                <motion.div
                  className="text-gray-700"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                >
                  {formatExperience(experience.experience)}
                </motion.div>
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
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[90vh] flex flex-col"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Discussion</h3>
                  <p className="text-indigo-200 text-sm mt-1">Share your thoughts and experiences</p>
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
                  <InterviewCommentSection expId={experience._id} />
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