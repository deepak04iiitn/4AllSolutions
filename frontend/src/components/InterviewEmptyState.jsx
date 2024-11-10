import React from 'react';
import { FileSearch } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-3xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-indigo-100/50">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <FileSearch className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3">
            No Experiences Shared Yet
          </h3>
          <p className="text-gray-600 text-center max-w-md mx-auto">
            Be the first to share your interview experience and help others in their journey. Your insights could make a difference!
          </p>
          <div className="mt-8 text-center">
            <button 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-xl transition-all duration-300 gap-2"
            >
              Share Your Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
