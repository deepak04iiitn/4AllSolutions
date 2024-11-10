import React, { useState } from 'react';
import { X, Plus, Minus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePollModal = ({ onClose }) => {

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/backend/polls', { question, options });
      onClose();
      navigate('/publicpolls');
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in duration-300">
        <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create Poll
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-purple-100 transition-colors duration-300"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Question Input */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-12 px-4 border-2 border-purple-100 rounded-xl focus:border-purple-300 focus:outline-none transition-all duration-300 bg-white/50"
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 animate-in slide-in-from-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full h-10 px-4 border-2 border-purple-100 rounded-xl focus:border-purple-300 focus:outline-none transition-all duration-300 bg-white/50"
                  />
                  {index > 1 && (
                    <button
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-300 flex-shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Option Button */}
            <button
              onClick={handleAddOption}
              className="w-full h-12 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-600 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 pt-2">
            <button
              onClick={handleSubmit}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all duration-300 font-semibold"
            >
              Create Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePollModal;