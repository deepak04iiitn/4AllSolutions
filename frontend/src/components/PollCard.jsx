import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const PollCard = ({ poll, onDelete }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  const [votedPoll, setVotedPoll] = useState(poll);

  if (!votedPoll || !votedPoll.question || !Array.isArray(votedPoll.options) || votedPoll.options.length === 0) {
    return null;
  }

  const handleVote = async () => {
    if (selectedOption === null) return;
    setIsVoting(true);
    setError(null);
    try {
      const response = await axios.post(`/backend/polls/${votedPoll._id}/vote`, { option: selectedOption });
      setVotedPoll(response.data);
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  const calculateVoteStats = () => {
    const totalVotes = votedPoll.votes.length;
    return votedPoll.options.map((option, index) => {
      const optionVotes = votedPoll.votes.filter(vote => vote.option === index).length;
      const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
      return {
        votes: optionVotes,
        percentage: percentage.toFixed(1)
      };
    });
  };

  const voteStats = calculateVoteStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-orange-100 rounded-full -ml-12 -mb-12 opacity-50" />
          
          <div className="relative h-full flex flex-col">
            <h5 className="text-2xl font-bold text-gray-800 mb-6">
              {votedPoll.question}
            </h5>
            
            <div className="flex-1 overflow-hidden flex flex-col">
              <div 
                className={`space-y-4 flex-1 ${
                  votedPoll.options.length > 2 ? 'overflow-y-auto pr-2' : ''
                }`}
                style={{ height: '240px' }} // Fixed height for options container
              >
                {votedPoll.options.map((option, index) => (
                  <motion.div
                    key={index}
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label 
                      className="block cursor-pointer"
                      htmlFor={`option-${votedPoll._id}-${index}`}
                    >
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedOption === index 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            selectedOption === index ? 'border-blue-500' : 'border-gray-300'
                          }`}>
                            {selectedOption === index && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 bg-blue-500 rounded-full"
                              />
                            )}
                          </div>
                          <span className="text-gray-700 font-medium">{option}</span>
                        </div>
                        
                        <div className="relative">
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${voteStats[index].percentage}%` }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="font-semibold text-blue-600">
                              {voteStats[index].percentage}%
                            </span>
                            <span className="text-gray-500">
                              {voteStats[index].votes} votes
                            </span>
                          </div>
                        </div>
                      </div>
                      <input
                        type="radio"
                        id={`option-${votedPoll._id}-${index}`}
                        name={`poll-${votedPoll._id}`}
                        value={index}
                        checked={selectedOption === index}
                        onChange={() => setSelectedOption(index)}
                        className="hidden"
                      />
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleVote}
                  disabled={isVoting || selectedOption === null}
                  className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${
                    isVoting || selectedOption === null
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-0.5'
                  }`}
                >
                  {isVoting ? 'Voting...' : 'Submit Vote'}
                </button>
                
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="px-6 py-3 rounded-full font-semibold text-red-500 border-2 border-red-500 hover:bg-red-50 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Delete
                  </button>
                )}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 mt-4 text-sm"
                >
                  {error}
                </motion.p>
              )}
              
              <p className="text-gray-400 text-sm mt-4">
                Total votes: {votedPoll.votes.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PollCard;