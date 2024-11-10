import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function ReferralForm({ toggleModal }) {

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    contact: '',
    linkedin: '',
    positions: [{ position: '', jobid: '' }]
  });

  const {currentUser} = useSelector((state) => state.user);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [numOpenings, setNumOpenings] = useState('1');

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'numOpenings') {
      setNumOpenings(value); // Allow empty value
      if (value !== '') {
        const num = Math.max(parseInt(value) || 0, 0);
        setFormData(prev => ({
          ...prev,
          positions: Array(num).fill(0).map((_, i) => 
            prev.positions[i] || { position: '', jobid: '' }
          )
        }));
      }
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handlePositionChange = (index, field, value) => {
    const newPositions = [...formData.positions];
    newPositions[index] = { ...newPositions[index], [field]: value };
    setFormData({ ...formData, positions: newPositions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!formData.fullName || !formData.company || !formData.contact) {
      setError('Name, company, and contact are required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.positions.some(p => p.position)) {
      setError('At least one position is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/backend/referrals/createReferral', {
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

      setSuccess('Referral submitted successfully!');
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
    <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
        style={{
          backgroundImage: 'url("/assets/referral.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl" />

        <div className="relative z-10 p-6 max-h-[90vh] overflow-y-auto">
          <button
            onClick={toggleModal}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <X size={24} />
          </button>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Share Your Referral
            </h2>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}

            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact *
                </label>
                <input
                  type="text"
                  id="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200"
                />
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  Linkedin profile (Optional)
                </label>
                <input
                  type="text"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200"
                />
              </div>

              <div>
                <label htmlFor="numOpenings" className="block text-sm font-medium text-gray-700">
                  Number of Positions *
                </label>
                <input
                  type="number"
                  id="numOpenings"
                  min="0"
                  placeholder="Enter number of positions"
                  value={numOpenings}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Positions</h3>
                {formData.positions.map((pos, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg bg-white bg-opacity-50">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Position Name *
                      </label>
                      <input
                        type="text"
                        value={pos.position}
                        onChange={(e) => handlePositionChange(index, 'position', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Job ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={pos.jobid}
                        onChange={(e) => handlePositionChange(index, 'jobid', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-200"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md transition duration-300 relative overflow-hidden
                ${isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gray-800 hover:bg-gray-700'} 
                text-white focus:outline-none focus:ring-2 focus:ring-gray-500`}
            >
              <motion.div
                initial={false}
                animate={{
                  x: isSubmitting ? '100%' : '-100%'
                }}
                transition={{
                  repeat: isSubmitting ? Infinity : 0,
                  duration: 1
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
                style={{ opacity: 0.2 }}
              />
              {isSubmitting ? 'Submitting...' : 'Submit Referral'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}