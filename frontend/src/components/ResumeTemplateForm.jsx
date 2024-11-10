import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js';
import { useSelector } from 'react-redux';

export default function ResumeTemplateForm({ toggleModal, onSubmitSuccess }) {

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    yearsOfExperience: '',
  });
  
  const {currentUser} = useSelector((state) => state.user);
  const [resume, setResume] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleModalClick = (e) => {
    // Only close if clicking the outer background
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  const handleChange = (e) => {

    e.stopPropagation(); // Prevent event from bubbling up

    const value = e.target.id === 'yearsOfExperience' 
      ? parseFloat(e.target.value) 
      : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleDragOver = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileChange = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const uploadResumeToFirebase = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + file.name;
    const storageRef = ref(storage, 'resumes/' + fileName);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {

    e.stopPropagation();
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Updated validation logic
      if (!formData.company || !formData.position || 
          typeof formData.yearsOfExperience !== 'number' || 
          formData.yearsOfExperience < 0 || !resume) {
        throw new Error('All fields are required and years of experience must be 0 or greater');
      }

      // Upload resume to Firebase
      const downloadURL = await uploadResumeToFirebase(resume);

      // Prepare data for MongoDB
      const templateData = {
        company: formData.company,
        position: formData.position,
        yearsOfExperience: formData.yearsOfExperience,
        resume: downloadURL,
      };

      // Send data to backend
      const response = await fetch('/backend/resumeTemplates/uploadResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          ...templateData,
          userRef : currentUser._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit template');
      }

      // Handle success
      setSuccess('Template submitted successfully!');
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      // Reset form
      setFormData({
        company: '',
        position: '',
        yearsOfExperience: '',
      });
      setResume(null);
      setUploadProgress(0);

      // Close modal after delay
      setTimeout(() => {
        toggleModal();
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
        onClick={handleModalClick}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col h-[90vh] transform transition-all duration-500 ease-out hover:shadow-3xl overflow-hidden"
        onClick={e => e.stopPropagation()} 
      >
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{
            backgroundImage: 'url("/assets/ResumeTemplate.jpg")', 
          }}
        />
        
        {/* Overlay Layer */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-6 sm:p-8 border-b border-gray-100/50">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-300 transform hover:rotate-90"
            >
              <X size={24} />
            </button>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                Share Your Resume Template
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base text-center">
                Help others by sharing your successful resume format
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 md:p-8 space-y-6 custom-scrollbar">
            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-shake">
                <div className="flex items-center space-x-2">
                  <X size={20} className="text-red-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg animate-slideIn">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{success}</span>
                </div>
              </div>
            )}

            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="group">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur group-hover:border-blue-400 text-sm sm:text-base"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="group">
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur group-hover:border-blue-400 text-sm sm:text-base"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Enter position"
                  />
                </div>

                <div className="group">
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="yearsOfExperience"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur group-hover:border-blue-400 text-sm sm:text-base"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="Enter years of experience"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div
                className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 md:p-8 text-center transition-all duration-300 transform hover:scale-[1.01] ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/80 scale-105' 
                    : 'border-gray-300 hover:border-blue-400 bg-white/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {resume ? (
                  <div className="flex items-center justify-center space-x-3 bg-blue-50/80 p-3 sm:p-4 rounded-xl">
                    <FileText className="text-blue-500 hidden sm:block" size={24} />
                    <span className="text-gray-700 font-medium text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                      {resume.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setResume(null)}
                      className="text-red-500 hover:text-red-700 transform hover:scale-110 transition-all duration-300 flex-shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <Upload className="mx-auto text-blue-500 animate-bounce" size={28} />
                    <div className="text-gray-600">
                      <p className="font-medium text-sm sm:text-base">Drop your resume here or</p>
                      <label
                        htmlFor="resume"
                        className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-300"
                      >
                        Browse
                      </label>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">Supports PDF files only</p>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">{uploadProgress}% uploaded</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-100/50">
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`w-full py-2.5 sm:py-3 px-6 rounded-xl text-white font-medium transition-all duration-500 text-sm sm:text-base
                ${isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] hover:shadow-lg'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Template'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
}