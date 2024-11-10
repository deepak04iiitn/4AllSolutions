import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SalaryForm from '../components/SalaryForm';
import SalaryCard from '../components/SalaryCard';
import { useSelector } from 'react-redux';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import SalaryEmptyState from '../components/SalaryEmptyState';

const SalaryHeader = ({ onFilterClick, onApplyFilters, onShareClick }) => {
  return (
    <div className="w-full max-w-7xl mx-auto mb-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-1">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
        
        <div className="relative bg-white/95 rounded-[1.4rem] px-8 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">
              Salary Insights
            </h1>
            <p className="text-gray-600 mt-2">
              Share and explore salary information from fellow engineers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onFilterClick}
              className="group relative w-full sm:w-auto px-6 py-3 bg-white rounded-xl border-2 border-indigo-100 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Filter className="w-5 h-5 text-indigo-600" />
              <span className="relative text-indigo-600 font-medium">Filters</span>
            </button>

            <button
              onClick={onApplyFilters}
              className="group relative w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Search className="w-5 h-5 text-white mr-2" />
              <span className="relative text-white font-medium">Apply Filters</span>
            </button>

            <button
              onClick={onShareClick}
              className="group relative w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Plus className="w-5 h-5 text-white" />
              <span className="relative text-white font-medium">Share Salary</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, filters, onSave, onClear }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [activeTab, setActiveTab] = useState('search');

  const handleSave = () => {
    onSave(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      companySearch: '',
      positionSearch: '',
      locationSearch: '',
      experienceFilter: '',
      sortConfig: 'ctc-desc'  // Updated default sort config to use CTC
    };
    setLocalFilters(clearedFilters);
    onClear(clearedFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-500">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Refine Results</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search & Filter
          </button>
          <button
            onClick={() => setActiveTab('sort')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'sort'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sort Options
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'search' ? (
            <div className="space-y-6">
              {/* Company Search */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <div className="relative">
                  <input
                    type="text"
                    value={localFilters.companySearch}
                    onChange={(e) => setLocalFilters({ ...localFilters, companySearch: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Search by company name..."
                  />
                </div>
              </div>

              {/* Position Search */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={localFilters.positionSearch}
                  onChange={(e) => setLocalFilters({ ...localFilters, positionSearch: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Search by position..."
                />
              </div>

              {/* Location Search */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={localFilters.locationSearch}
                  onChange={(e) => setLocalFilters({ ...localFilters, locationSearch: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Search by location..."
                />
              </div>

              {/* Experience Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input
                  type="number"
                  value={localFilters.experienceFilter}
                  onChange={(e) => setLocalFilters({ ...localFilters, experienceFilter: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Enter years of experience..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Choose how you want to sort the results:</p>
              <div className="space-y-2">
                {[
                  { value: 'ctc-desc', label: 'Highest CTC First' },
                  { value: 'ctc-asc', label: 'Lowest CTC First' },
                  { value: 'likes-desc', label: 'Most Liked First' },
                  { value: 'likes-asc', label: 'Least Liked First' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLocalFilters({ ...localFilters, sortConfig: option.value })}
                    className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between ${
                      localFilters.sortConfig === option.value
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                    {localFilters.sortConfig === option.value && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SalaryStructures() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [salaries, setSalaries] = useState([]);
  const [visibleSalaries, setVisibleSalaries] = useState(10);

  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isCheckingPremium, setIsCheckingPremium] = useState(true);
  const {currentUser} = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    companySearch: '',
    positionSearch: '',
    locationSearch: '',
    experienceFilter: '',
    sortConfig: 'ctc-desc'  // Updated default sort config
  });

  const [appliedFilters, setAppliedFilters] = useState({
    companySearch: '',
    positionSearch: '',
    locationSearch: '',
    experienceFilter: '',
    sortConfig: 'ctc-desc'  // Updated default sort config
  });

  const toggleFilterModal = () => setIsFilterModalOpen(!isFilterModalOpen);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Check premium status
  useEffect(() => {

    const checkPremiumStatus = async () => {
      if (!currentUser?.email) {
        setIsPremiumUser(false);
        setIsCheckingPremium(false);
        return;
      }

      try {
        const response = await fetch('/backend/premium');
        const premiumUsers = await response.json();
        
        const userIsPremium = premiumUsers.some(user => user.email === currentUser.email);
        setIsPremiumUser(userIsPremium);
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremiumUser(false);
      } finally {
        setIsCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [currentUser]);


  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await fetch('/backend/salary/getSalary');
      if (!response.ok) {
        throw new Error('Failed to fetch salaries');
      }
      const data = await response.json();
      setSalaries(data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  const handleShowMore = () => {
    setVisibleSalaries(prev => prev + 10);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleSaveFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = (clearedFilters) => {
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
  };

  const filteredSalaries = salaries
    .filter(salary => {
      const companyMatch = salary.company.toLowerCase().includes(filters.companySearch.toLowerCase());
      const positionMatch = salary.position.toLowerCase().includes(filters.positionSearch.toLowerCase());
      const locationMatch = salary.location.toLowerCase().includes(filters.locationSearch.toLowerCase());
      const experienceMatch = !filters.experienceFilter || 
        salary.yearsOfExperience === parseInt(filters.experienceFilter);
      
      return companyMatch && positionMatch && locationMatch && experienceMatch;
    })
    .sort((a, b) => {
      const [field, order] = filters.sortConfig.split('-');
      const sortValue = order === 'asc' ? 1 : -1;
      
      if (field === 'ctc') {
        // Parse CTC values (assuming they're in LPA format)
        const ctcA = parseFloat(a.ctc);
        const ctcB = parseFloat(b.ctc);
        return (ctcA - ctcB) * sortValue;
      } else if (field === 'likes') {
        return ((a.numberOfLikes || 0) - (b.numberOfLikes || 0)) * sortValue;
      }
      return 0;
    });

  return (

    <div className="py-8">
          <div className="min-h-screen px-8 mt-6">
                <div className="max-w-7xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SalaryHeader
                      onFilterClick={toggleFilterModal}
                      onApplyFilters={handleApplyFilters}
                      onShareClick={toggleModal}
                    />
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {filteredSalaries.length > 0 ? (
                      filteredSalaries.slice(0, visibleSalaries).map((salary, index) => (
                        <motion.div
                        key={salary._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <SalaryCard salary={salary} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <SalaryEmptyState />
                      </div>
                    )}
                  </motion.div>

                  {/* Show More Button */}
                  {visibleSalaries < filteredSalaries.length && (
                    <motion.div 
                      className="flex justify-center mt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.button 
                        onClick={handleShowMore}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Show More
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Modal */}
                  <AnimatePresence>
                    {isModalOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={toggleModal}
                      >
                        <SalaryForm toggleModal={toggleModal} onSubmitSuccess={fetchSalaries} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isFilterModalOpen && (
                      <FilterModal
                        isOpen={isFilterModalOpen}
                        onClose={toggleFilterModal}
                        filters={filters}
                        onSave={handleSaveFilters}
                        onClear={handleClearFilters}
                      />
                    )}
                  </AnimatePresence>

                </div>
              </div>
        </div>
  );
}