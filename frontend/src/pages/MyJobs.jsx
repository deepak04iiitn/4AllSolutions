import React, { useState, useEffect } from 'react';
import { TrashIcon, BriefcaseIcon, MapPinIcon, ClockIcon, BookmarkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const formatUrlString = (company, title) => {
  const formatString = (str) => str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

  return `${formatString(company)}-${formatString(title)}`;
};

export default function MyJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await axios.get(`/backend/saved-jobs/${userId}`);
        setSavedJobs(response.data);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    if (userId) {
      fetchSavedJobs();
    }
  }, [userId]);

  const handleRemoveJob = async (jobId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(`/backend/saved-jobs/${userId}/${jobId}`);
      setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error("Error removing job:", err);
    }
  };

  const handleCardClick = (jobId, company, title) => {
    const formattedUrl = formatUrlString(company, title);
    navigate(`/fulljd/${formattedUrl}/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section without background */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <BookmarkIcon className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bookmarked Opportunities
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your curated collection of dream roles and exciting opportunities
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full">
            <span className="text-indigo-600 font-medium">{savedJobs.length} saved positions</span>
          </div>
        </div>
      </div>

      {/* Jobs Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <BookmarkIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Saved Jobs Yet</h3>
            <p className="text-gray-500">Start bookmarking jobs you're interested in to build your collection</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => handleCardClick(job.jobId, job.company, job.title)}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  {/* Top section with experience and delete button */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {job.min_exp} years
                    </span>
                    <button
                      onClick={(e) => handleRemoveJob(job._id, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                  
                  {/* Job details section */}
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 mb-3">
                      {job.title}
                    </h2>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <BriefcaseIcon size={16} className="mr-2 text-gray-400" />
                        <p>{job.company}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon size={16} className="mr-2 text-gray-400" />
                        <p>{job.location.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Apply button section - always at bottom */}
                  <div className="mt-6">
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}