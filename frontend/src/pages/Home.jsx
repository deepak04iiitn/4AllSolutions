import React, { useState, useRef, useEffect } from 'react';
import TypeWriterEffect from 'react-typewriter-effect';
import JobTable from '../components/JobTable';
import { FloatButton } from 'antd';
import { MessageFilled, PlusOutlined, FormOutlined, UsergroupAddOutlined, CloseOutlined, SendOutlined, BarChartOutlined } from '@ant-design/icons';
import { Button } from 'flowbite-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import CreatePollModal from '../components/CreatePollModal';
import { useNavigate } from 'react-router-dom';
import TestimonialForm from '../components/TestimonialForm';
import TestimonialSection from '../components/TestimonialSection';
import { useSelector } from 'react-redux';

export default function Home() {

  const [showModal, setShowModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isCheckingPremium, setIsCheckingPremium] = useState(true);

  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const {currentUser} = useSelector((state) => state.user);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

  const formatResponse = (text) => {
    const lines = text.split('\n');
    let formattedText = '';
    let inList = false;

    lines.forEach((line, index) => {
      line = line.replace(/\*/g, ''); // Remove asterisks
      
      if (line.trim().match(/^\d+\./) || line.trim().startsWith('-') || line.trim().startsWith('•')) {
        if (!inList) {
          formattedText += '<ul class="list-disc pl-5 space-y-2">';
          inList = true;
        }
        formattedText += `<li>${line.replace(/^\d+\.|-|•/, '').trim()}</li>`;
      } else if (line.trim().length > 0) {
        if (inList) {
          formattedText += '</ul>';
          inList = false;
        }
        
        // Apply formatting
        line = line.replace(/\_\_(.+?)\_\_/g, '<u>$1</u>'); // Underline
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); // Bold
        line = line.replace(/\_(.+?)\_/g, '<em>$1</em>'); // Italic
        
        formattedText += `<p class="mb-2">${line}</p>`;
      } else if (inList) {
        formattedText += '</ul>';
        inList = false;
      } else {
        formattedText += '<br>';
      }
    });

    if (inList) {
      formattedText += '</ul>';
    }

    return formattedText.trim();
  };


  const AIanswer = async (question) => {
    setIsLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const fullPrompt = `Answer the following question about job opportunities or career advice. Use bullet points and numbered lists where appropriate to make the answer more readable:

${question}`;

    try {
      const result = await chatSession.sendMessage(fullPrompt);
      const formattedResponse = formatResponse(result.response.text());
      setMessages(prev => [...prev, { type: 'ai', content: formattedResponse }]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages(prev => [...prev, { type: 'ai', content: "I'm sorry, I couldn't generate a response. Please try again." }]);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    setInputMessage('');
    await AIanswer(inputMessage);
  };


  return (
    <div className={`bg-gray-50 min-h-screen ${showModal || showPollModal ? 'overflow-hidden' : ''}`}>
      <FloatButton.Group icon={<PlusOutlined />} trigger='click' type='primary' tooltip='Explore some unique features!'>
        <FloatButton icon={<UsergroupAddOutlined />} tooltip='Public Polls' onClick={() => navigate('/publicpolls')} />
        <FloatButton icon={<BarChartOutlined />} tooltip='My Polls' onClick={() => navigate('/mypolls')} />
        <FloatButton icon={<FormOutlined />} tooltip='Create a Poll!' onClick={() => setShowPollModal(true)} />
        <FloatButton icon={<MessageFilled />} tooltip='Ask anything...' onClick={() => setShowModal(true)} />
      </FloatButton.Group>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12 lg:py-16">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src="/assets/gif2.gif"
              className="h-40 w-40 md:h-52 md:w-52"
              alt="Welcome"
            />
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 block">
                <TypeWriterEffect
                  textStyle={{
                    fontFamily: 'Red Hat Display',
                    fontWeight: 'bold',
                    background: 'linear-gradient(to right, #00bcd4, #2196f3, #9c27b0)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    fontSize: 'inherit',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                  }}
                  startDelay={100}
                  cursorColor="black"
                  text="Welcome to TrendingJobs4All!"
                  typeSpeed={100}
                />
              </span>
              <span className="text-lg md:text-2xl font-medium bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
                Explore Opportunities that Align with Your Passion and Skillset!
              </span>
            </div>
          </div>
        </div>

        <JobTable />

        <TestimonialSection />  

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fadeInScale">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-center flex-grow bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chat with AI Assistant
            </h3>
            <button 
              onClick={() => setShowModal(false)} 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <CloseOutlined style={{ fontSize: '20px' }} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInSlide`}>
                <div 
                  className={`max-w-[85%] p-3 sm:p-4 rounded-lg shadow-md ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  }`}
                >
                  {message.type === 'ai' ? (
                    <div 
                      className="text-sm sm:text-base"
                      dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br>') }} 
                    />
                  ) : (
                    <div className="text-sm sm:text-base">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-gray-300 rounded-lg p-3 max-w-[85%] text-sm sm:text-base">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-6 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="min-w-[80px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 sm:px-6 rounded-r-full transition-all duration-300 ease-in-out flex items-center justify-center h-[38px] sm:h-[42px]"
              >
                <SendOutlined className="mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Send</span>
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPollModal && (
        <CreatePollModal onClose={() => setShowPollModal(false)} />
      )}

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }

        .animate-fadeInSlide {
          animation: fadeInSlide 0.3s ease-out;
        }

        /* Responsive design */
        @media (max-width: 640px) {
          .max-w-2xl {
            max-width: 100%;
          }
          
          input, button {
            height: 42px;
          }
        }
      `}</style>
    </div>
  );
}