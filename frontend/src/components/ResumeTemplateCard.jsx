import React, { useState } from 'react';
import { Download, Building2, Briefcase, Clock, XCircle, ThumbsUp, ThumbsDown, MessageCircle, X } from 'lucide-react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeCommentSection from './ResumeCommentSection.jsx';

export default function ResumeTemplateCard({ template }) {

  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [likes, setLikes] = useState(template?.numberOfLikes || 0);
  const [dislikes, setDislikes] = useState(template?.numberOfDislikes || 0);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    
    try {
      let downloadURL = template.resume;
      
      if (!template.resume.startsWith('http')) {
        const storage = getStorage(app);
        const resumeRef = ref(storage, template.resume);
        downloadURL = await getDownloadURL(resumeRef);
      }

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadURL;
      a.target = '_blank';
      a.download = `${template.company}-${template.position}-resume.pdf`;
      
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
      }, 100);

    } catch (error) {
      console.error('Error downloading resume:', error);
      setError('Failed to download resume. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/backend/resumeTemplates/likeResume/${template._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to like template');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error liking template:', error);
    }
  };

  const handleDislike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(`/backend/resumeTemplates/dislikeResume/${template._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to dislike template');
      const data = await response.json();
      setLikes(data.likes);
      setDislikes(data.dislikes);
    } catch (error) {
      console.error('Error disliking template:', error);
    }
  };

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-in-out
          ${isHovered ? 'transform scale-102' : 'transform scale-100'}
          bg-gradient-to-br from-blue-100 to-green-100
          shadow-lg hover:shadow-xl h-full flex flex-col`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-6 flex-grow">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fadeIn flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-500 animate-pulse" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div className={`transition-transform duration-300 ${isHovered ? 'transform scale-105' : ''}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-blue-800">
                  {template.company}
                </h3>
              </div>

              <div className="space-y-3 ml-2">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="text-green-600" size={20} />
                  </div>
                  <p className="font-medium">{template.position}</p>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="text-blue-600" size={20} />
                  </div>
                  <span className="bg-blue-100 px-2 py-1 rounded-full text-sm">
                    {template.yearsOfExperience} years of experience
                  </span>
                </div>
              </div>
            </div>

            <button
              className={`w-full flex items-center justify-center space-x-3 py-3 px-6 rounded-lg
                transition-all duration-300 ease-in-out transform
                ${downloading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-200 hover:to-blue-300'
                }
                text-white font-semibold shadow-md hover:shadow-lg
                ${isHovered ? 'scale-105' : 'scale-100'}`}
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download 
                size={20} 
                className={`transition-transform duration-300
                  ${downloading ? 'animate-bounce' : 'group-hover:animate-pulse'}`}
              />
              <span>
                {downloading ? 'Downloading...' : 'Download Resume'}
              </span>
            </button>
          </div>
        </div>

        <div className="p-4 flex justify-between items-center border-t border-blue-200">
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
        </div>
      </div>

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
                  <p className="text-blue-200 text-sm mt-1">Share your thoughts about this resume template</p>
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
                    <ResumeCommentSection resId={template._id} />
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