import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [interviewExperiences, setInterviewExperiences] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [resumeTemplates, setResumeTemplates] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState('');
  const [currentUser, setCurrentUser] = useState({ isUserAdmin: true }); 
  const [isUpdating, setIsUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const ITEMS_PER_PAGE = 8;
  const roles = ["Guest", "Recruiter", "Job Seeker"];

  useEffect(() => {
    if (currentUser.isUserAdmin) {
      setPage(1);
      switch (activeTab) {
        case 'users':
          fetchUsers();
          break;
        case 'comments':
          fetchComments();
          break;
        case 'interviewExperiences':
          fetchInterviewExperiences();
          break;
        case 'referrals':
          fetchReferrals();
          break;
        case 'salaries':
          fetchSalaries();
          break;
        case 'resumeTemplates':
          fetchResumeTemplates();
          break;
      }
    }
  }, [currentUser.isUserAdmin, activeTab]);


  const fetchResumeTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/backend/resumeTemplates/getResume?startIndex=${(page - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      
      if (res.ok) {
        if (page === 1) {
          setResumeTemplates(data);
        } else {
          setResumeTemplates(prev => [...prev, ...data]);
        }
        setShowMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/backend/user/getusers?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      if (res.ok) {
        if (page === 1) {
          setUsers(data.users);
        } else {
          setUsers(prev => [...prev, ...data.users]);
        }
        setShowMore(data.users.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/backend/comment/getComments?startIndex=${(page - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}&sort=desc`);
      const data = await res.json();
      
      if (res.ok) {
        if (page === 1) {
          setComments(data.comments);
        } else {
          setComments(prev => [...prev, ...data.comments]);
        }
        setShowMore(data.comments.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewExperiences = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/backend/interviews/getInterviewExp?startIndex=${(page - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      
      if (res.ok) {
        if (page === 1) {
          setInterviewExperiences(data);
        } else {
          setInterviewExperiences(prev => [...prev, ...data]);
        }
        setShowMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/backend/referrals/getReferral?startIndex=${(page - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      
      if (res.ok) {
        if (page === 1) {
          setReferrals(data);
        } else {
          setReferrals(prev => [...prev, ...data]);
        }
        setShowMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/backend/salary/getSalary?startIndex=${(page - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      
      if (res.ok) {
        if (page === 1) {
          setSalaries(data);
        } else {
          setSalaries(prev => [...prev, ...data]);
        }
        setShowMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setPage(prev => prev + 1);
    switch (activeTab) {
      case 'users':
        fetchUsers();
        break;
      case 'comments':
        fetchComments();
        break;
      case 'interviewExperiences':
        fetchInterviewExperiences();
        break;
      case 'referrals':
        fetchReferrals();
        break;
      case 'salaries':
        fetchSalaries();
        break;
      case 'resumeTemplates':
        fetchResumeTemplates();
        break;
    }
  };

  const handleDelete = async () => {
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'users':
          endpoint = `/backend/user/delete/${itemToDelete}`;
          break;
        case 'comments':
          endpoint = `/backend/comment/deleteComment/${itemToDelete}`;
          break;
        case 'interviewExperiences':
          endpoint = `/backend/interviews/delete/${itemToDelete}`;
          break;
        case 'referrals':
          endpoint = `/backend/referrals/delete/${itemToDelete}`;
          break;
        case 'salaries':
          endpoint = `/backend/salary/delete/${itemToDelete}`;
          break;
        case 'resumeTemplates':
          endpoint = `/backend/resumeTemplates/delete/${itemToDelete}`;
          break;
      }
        
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (res.ok) {
        switch (activeTab) {
          case 'users':
            setUsers((prev) => prev.filter((user) => user._id !== itemToDelete));
            break;
          case 'comments':
            setComments((prev) => prev.filter((comment) => comment._id !== itemToDelete));
            break;
          case 'interviewExperiences':
            setInterviewExperiences((prev) => prev.filter((exp) => exp._id !== itemToDelete));
            break;
          case 'referrals':
            setReferrals((prev) => prev.filter((referral) => referral._id !== itemToDelete));
            break;
          case 'salaries':
            setSalaries((prev) => prev.filter((salary) => salary._id !== itemToDelete));
            break;
          case 'resumeTemplates':
            setResumeTemplates((prev) => prev.filter((template) => template._id !== itemToDelete));
            break;
        }
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const TabButton = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
        activeTab === tab
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const UsersTable = () => (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          {[
            'Date created',
            'User image',
            'Username',
            'Email',
            'Role',
            'Status',
            'Last Visit',
            'Admin',
            'Actions'
          ].map((header) => (
            <th key={header} className="px-6 py-5 text-left">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {header}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {users.map((user, index) => (
          <tr
            key={user._id}
            className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-blue-400 dark:ring-blue-500">
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {user.username}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
            </td>
            <td className="px-6 py-4">
              <select
                value={user.role}
                onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                disabled={isUpdating || user.isUserAdmin}
                className="text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none transition-all duration-200 disabled:opacity-50"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-6 py-4">
              <StatusIndicator status={user.status} />
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {formatLastVisit(user.lastVisit)}
              </span>
            </td>
            <td className="px-6 py-4">
              {user.isUserAdmin ? (
                <div className="flex items-center">
                  <FaCheck className="text-emerald-500 text-lg" />
                  <span className="ml-2 text-sm text-emerald-500">Admin</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <FaTimes className="text-gray-400 text-lg" />
                  <span className="ml-2 text-sm text-gray-400">User</span>
                </div>
              )}
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setItemToDelete(user._id);
                }}
                disabled={user.isUserAdmin}
                className="flex items-center px-3 py-1 rounded-full text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-red-500"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const CommentsTable = () => (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          {[
            'Date updated',
            'Comment content',
            'Number of likes',
            'Job Id',
            'User Id',
            'Actions'
          ].map((header) => (
            <th key={header} className="px-6 py-5 text-left">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {header}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {comments.map((comment, index) => (
          <tr
            key={comment._id}
            className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(comment.updatedAt).toLocaleDateString()}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {comment.content}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {comment.numberOfLikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {comment.jobId}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {comment.userId}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setItemToDelete(comment._id);
                }}
                className="flex items-center px-3 py-1 rounded-full text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const ResumeTemplatesTable = () => (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          {[
            'Company',
            'Position',
            'Years of Experience',
            'Likes',
            'Dislikes',
            'Actions'
          ].map((header) => (
            <th key={header} className="px-6 py-5 text-left">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {header}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {resumeTemplates.map((template, index) => (
          <tr
            key={template._id}
            className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <td className="px-6 py-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {template.company}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {template.position}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {template.yearsOfExperience} years
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-green-600 flex items-center">
                <FaCheck className="mr-2" />
                {template.numberOfLikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-red-600 flex items-center">
                <FaTimes className="mr-2" />
                {template.numberOfDislikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setItemToDelete(template._id);
                }}
                className="flex items-center px-3 py-1 rounded-full text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );


  const SalariesTable = () => (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          {[
            'Company',
            'Position',
            'Location',
            'Salary',
            'CTC',
            'Experience',
            'Likes',
            'Dislikes',
            'Actions'
          ].map((header) => (
            <th key={header} className="px-6 py-5 text-left">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {header}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {salaries.map((salary, index) => (
          <tr
            key={salary._id}
            className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <td className="px-6 py-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {salary.company}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {salary.position}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {salary.location}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {salary.salary}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {salary.ctc}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {salary.yearsOfExperience} years
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-green-600 flex items-center">
                <FaCheck className="mr-2" />
                {salary.numberOfLikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-red-600 flex items-center">
                <FaTimes className="mr-2" />
                {salary.numberOfDislikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setItemToDelete(salary._id);
                }}
                className="flex items-center px-3 py-1 rounded-full text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const InterviewExperiencesTable = () => (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          {[
            'Company',
            'Position',
            'Verdict',
            'Number of Likes',
            'Number of Dislikes',
            'Actions'
          ].map((header) => (
            <th key={header} className="px-6 py-5 text-left">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {header}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {interviewExperiences.map((experience, index) => (
          <tr
            key={experience._id}
            className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {experience.company}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {experience.position}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className={`text-sm font-medium ${
                experience.verdict === 'selected' 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {experience.verdict}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {experience.numberOfLikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {experience.numberOfDislikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setItemToDelete(experience._id);
                }}
                className="flex items-center px-3 py-1 rounded-full text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const ReferralsTable = () => (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          {[
            'Full Name',
            'Company',
            'Positions',
            'Contact',
            'Likes',
            'Dislikes',
            'LinkedIn',
            'Actions'
          ].map((header) => (
            <th key={header} className="px-6 py-5 text-left">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                {header}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
        {referrals.map((referral, index) => (
          <tr
            key={referral._id}
            className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {referral.fullName}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {referral.company}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {referral.positions.map(p => p.position).join(', ')}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {referral.contact}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-green-600 flex items-center">
                <FaCheck className="mr-2" />
                {referral.numberOfLikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-red-600 flex items-center">
                <FaTimes className="mr-2" />
                {referral.numberOfDislikes}
              </span>
            </td>
            <td className="px-6 py-4">
              <a 
                href={referral.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {referral.linkedin !== 'Not Provided' ? 'View Profile' : 'Not Provided'}
              </a>
            </td>
            <td className="px-6 py-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setItemToDelete(referral._id);
                }}
                className="flex items-center px-3 py-1 rounded-full text-sm text-red-500 hover:text-white hover:bg-red-500 transition-all duration-300"
              >
                <FaTrash className="mr-2" />
                <span>Delete</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const StatusIndicator = ({ status }) => {
    const isActive = status === 'Active';
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isActive && (
            <>
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            </>
          )}
        </div>
        <span className={`text-sm font-medium ${isActive ? 'text-green-500' : 'text-gray-500'}`}>
          {status}
        </span>
      </div>
    );
  };

  const formatLastVisit = (date) => {
    const now = new Date();
    const lastVisit = new Date(date);
    const diffTime = Math.abs(now - lastVisit);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return lastVisit.toLocaleDateString();
    }
  };


  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6 flex justify-center space-x-4">
        <TabButton tab="users" label="Users" />
        <TabButton tab="comments" label="Comments" />
        <TabButton tab="interviewExperiences" label="Interview Experiences" />
        <TabButton tab="referrals" label="Referrals" />
        <TabButton tab="salaries" label="Salary Structures" />
        <TabButton tab="resumeTemplates" label="Resume Templates" />
      </div>

      {currentUser.isUserAdmin && (
        activeTab === 'users' ? users.length > 0 :
        activeTab === 'comments' ? comments.length > 0 :
        activeTab === 'interviewExperiences' ? interviewExperiences.length > 0 :
        activeTab === 'salaries' ? salaries.length > 0 :
        activeTab === 'resumeTemplates' ? resumeTemplates.length > 0 :
        referrals.length > 0
      ) ? (
        <div className="animate-fade-in">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              {activeTab === 'users' ? <UsersTable /> : 
               activeTab === 'comments' ? <CommentsTable /> : 
               activeTab === 'interviewExperiences' ? <InterviewExperiencesTable /> : 
               activeTab === 'salaries' ? <SalariesTable /> :
               activeTab === 'resumeTemplates' ? <ResumeTemplatesTable /> :
               <ReferralsTable />}
            </div>
          </div>

          {showMore && (
            <button
              onClick={handleShowMore}
              disabled={loading}
              className="mt-6 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Loading...'
              ) : (
                `Load More ${activeTab === 'users' ? 'Users' : 
                             activeTab === 'comments' ? 'Comments' : 
                             activeTab === 'interviewExperiences' ? 'Interview Experiences' : 
                             activeTab === 'salaries' ? 'Salary Structures' :
                             activeTab === 'resumeTemplates' ? 'Resume Templates' :
                             'Referrals'}`
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <span className="text-xl font-medium">No {activeTab} found</span>
          <p className="mt-2 text-sm">Start by adding some {activeTab} to your system</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full m-4 p-6 shadow-2xl transform transition-all animate-modal-slide-in">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FaExclamationTriangle className="text-2xl text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Delete {activeTab === 'users' ? 'User' : 
                          activeTab === 'comments' ? 'Comment' : 
                          activeTab === 'interviewExperiences' ? 'Interview Experience' : 
                          activeTab === 'salaries' ? 'Salary Structure' :
                          activeTab === 'resumeTemplates' ? 'Resume Template' :
                          'Referral'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone. Are you sure?
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes modal-slide-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-1rem);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        tr {
          animation: slide-in 0.5s ease-out forwards;
        }
        
        .animate-modal-slide-in {
          animation: modal-slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;