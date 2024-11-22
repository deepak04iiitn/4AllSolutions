import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
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
      setPage(1); // Reset page when tab changes
      if (activeTab === 'users') {
        fetchUsers();
      } else {
        fetchComments();
      }
    }
  }, [currentUser.isUserAdmin, activeTab]);

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
        
        // You can store these statistics in state if needed
        const { totalComments, lastMonthComments, stats } = data;
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    setPage(prev => prev + 1);
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchComments();
    }
  };

  const handleDelete = async () => {
    try {
      const endpoint = activeTab === 'users' 
        ? `/backend/user/delete/${itemToDelete}`
        : `/backend/comment/deleteComment/${itemToDelete}`;
        
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (res.ok) {
        if (activeTab === 'users') {
          setUsers((prev) => prev.filter((user) => user._id !== itemToDelete));
        } else {
          setComments((prev) => prev.filter((comment) => comment._id !== itemToDelete));
        }
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(comments);

  const handleRoleUpdate = async (userId, newRole) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/backend/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
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
      </div>

      {currentUser.isUserAdmin && (activeTab === 'users' ? users.length > 0 : comments.length > 0) ? (
        <div className="animate-fade-in">
          <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              {activeTab === 'users' ? <UsersTable /> : <CommentsTable />}
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
                `Load More ${activeTab === 'users' ? 'Users' : 'Comments'}`
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

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full m-4 p-6 shadow-2xl transform transition-all animate-modal-slide-in">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FaExclamationTriangle className="text-2xl text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Delete User
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