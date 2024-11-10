import React, { useState } from 'react';
import { X, Banknote, Building, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function SalaryForm({ toggleModal, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    education: '',
    yearsOfExperience: '',
    priorExperience: '',
    company: '',
    position: '',
    location: '',
    salary: '',
    relocationSigningBonus: '',
    stockBonus: '',
    bonus: '',
    ctc: '',
    benefits: '',
    otherDetails: ''
  });

  const {currentUser} = useSelector((state) => state.user);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Updated required fields list to include CTC
    const requiredFields = [
      'education', 'yearsOfExperience', 'priorExperience', 'company',
      'position', 'location', 'salary', 'benefits', 'ctc'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/backend/salary/createSalary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef : currentUser._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      setSuccess('Salary information submitted successfully!');
      if (onSubmitSuccess) onSubmitSuccess();

      setTimeout(() => {
        toggleModal();
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto"
      style={{
        backgroundImage: 'url(/assets/salary.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl"></div>

      <div className="relative z-10 p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={toggleModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-emerald-800 mb-6">
            Share Salary Information
          </h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CTC Field - Moved to top of the form */}
            <div className="space-y-2">
              <label htmlFor="ctc" className="block text-sm font-medium text-gray-700">
                CTC (Cost to Company) *
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="ctc"
                  value={formData.ctc}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="Enter CTC in LPA"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                Education Level *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="education"
                  value={formData.education}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="e.g., Bachelor's in CS"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                Years of Experience *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="e.g., 5"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="Company name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="position"
                  value={formData.position}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="Job title"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="City, Country"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Base Salary *
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="salary"
                  value={formData.salary}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="Annual base salary with currency"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bonus" className="block text-sm font-medium text-gray-700">
                Annual Bonus (Optional)
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="bonus"
                  value={formData.bonus}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="Annual bonus amount with currency"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="stockBonus" className="block text-sm font-medium text-gray-700">
                Stock Bonus (Optional)
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="stockBonus"
                  value={formData.stockBonus}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="Annual stock value with currency"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="relocationSigningBonus" className="block text-sm font-medium text-gray-700">
                Signing/Relocation Bonus (Optional)
              </label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 text-emerald-500" size={20} />
                <input
                  type="text"
                  id="relocationSigningBonus"
                  value={formData.relocationSigningBonus}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
                  placeholder="One-time bonus with currency"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="priorExperience" className="block text-sm font-medium text-gray-700">
              Prior Experience *
            </label>
            <textarea
              id="priorExperience"
              value={formData.priorExperience}
              rows="2"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
              placeholder="Brief description of your previous roles"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
              Benefits *
            </label>
            <textarea
              id="benefits"
              value={formData.benefits}
              rows="2"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
              placeholder="Description of benefits package"
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="otherDetails" className="block text-sm font-medium text-gray-700">
              Other Details (Optional)
            </label>
            <textarea
              id="otherDetails"
              value={formData.otherDetails}
              rows="2"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
              placeholder="Any additional information"
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105"
          >
            Submit Salary Information
          </button>
        </form>
      </div>
    </motion.div>
  );
}