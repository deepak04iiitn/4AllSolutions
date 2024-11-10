import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookmarkIcon, FlagIcon, MapPin, Briefcase, Clock, BarChart3 } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import { useSelector } from 'react-redux';

export default function FullJd() {
  const { id, url } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?._id;

  useEffect(() => {
    axios.get(`/backend/naukri/${url}/${id}`)
      .then((response) => {
        const jobData = response.data;
        setJob(jobData);
        checkIfJobIsSaved(jobData._id);
      })
      .catch((error) => console.error("Error fetching job data:", error));
  }, [id, url]);

  const checkIfJobIsSaved = async (jobId) => {
    try {
      const { data } = await axios.get(`/backend/saved-jobs/${userId}`);
      const saved = data.some(savedJob => savedJob.jobId === jobId);
      setIsSaved(saved);
    } catch (err) {
      console.error("Error checking saved jobs:", err);
    }
  };

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        await axios.delete(`/backend/saved-jobs/${userId}/${job._id}`);
        setIsSaved(false);
      } else {
        const jobData = {
          jobId: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          min_exp: job.min_exp,
          full_jd: job.full_jd,
          apply_link: job.apply_link,
          time: job.time
        };
  
        await axios.post(`/backend/saved-jobs/${userId}`, jobData);
        setIsSaved(true);
        navigate("/my-jobs");
      }
    } catch (err) {
      console.error("Error saving job:", err);
      console.error("Error details:", err.response ? err.response.data : err.message);
    }
  };

  const handleReportJob = () => {
    alert('Job has been reported.');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatJobDescription = (description) => {
    if (!description) return "";
    return description.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="mt-12 mb-20 px-4 lg:px-20">
      {job ? (
        <div className="bg-gradient-to-br from-blue-100 via-purple-300 to-indigo-400 p-10 rounded-xl shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-slideIn">
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-extrabold text-indigo-900 mb-4 animate-fadeInUp tracking-wide">
              {job.title}
            </h2>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveJob}
                className={`p-2 rounded-full shadow-lg ${isSaved ? 'bg-yellow-400' : 'bg-gray-300'} hover:bg-yellow-500 transition-colors duration-300 ease-out transform hover:scale-110`}
                title={isSaved ? "Unsave Job" : "Save Job"}
              >
                <BookmarkIcon size={26} color={isSaved ? 'white' : 'black'} />
              </button>

              <button
                onClick={handleReportJob}
                className="p-2 rounded-full bg-gray-300 hover:bg-red-600 transition-all duration-300 ease-out transform hover:scale-110"
                title="Report this job"
              >
                <FlagIcon size={26} color="black" />
              </button>
            </div>
          </div>

          {/* Job Info in a responsive grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-lg text-gray-800 font-medium">
            <div className="flex items-center space-x-2">
              <Briefcase className="text-purple-700" />
              <p><span className="text-purple-700 font-bold">Company:</span> {job.company}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="text-purple-700" />
              <p><span className="text-purple-700 font-bold">Location:</span> {job.location.join(", ")}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="text-purple-700" /> 
              <p><span className="text-purple-700 font-bold">Experience:</span> {job.min_exp} years</p>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="text-purple-700" />
              <p><span className="text-purple-700 font-bold">Posted on:</span> {formatDate(job.time)}</p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mt-6 text-lg text-gray-800 font-medium">
            <span className="text-purple-700 font-bold">Job Description: </span>
            <div className="ml-10 mt-4 space-y-2 leading-relaxed">
              {formatJobDescription(job.full_jd)}
            </div>
          </div>

          {/* Apply Button */}
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-2xl"
          >
            Apply Here
          </a>

          {/* Comment Section */}
          <div className="flex flex-col mt-20">
            <h1 className="text-blue-900 font-bold text-3xl mb-6">Comment Section</h1>
            <CommentSection jobId={job._id} />
          </div>
        </div>
      ) : (
        <p className="text-center text-indigo-800 text-lg font-medium animate-bounce">
          Loading job details...
        </p>
      )}
    </div>
  );
}
