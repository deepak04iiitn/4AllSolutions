import { useState, useEffect, memo } from 'react';
import { CreditCard, UserCircle, Mail, Briefcase, MessageCircle, Send } from 'lucide-react';

const Modal = memo(({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="relative">
          {children}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default function PremiumSubscription() {

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  const benefits = [
    {
      icon: UserCircle,
      text: "Filtered QA jobs according to your years of experience"
    },
    {
      icon: Mail,
      text: "Daily personalized job updates directly to your email"
    },
    {
      icon: Briefcase,
      text: "Centralized job display - no need to look elsewhere"
    },
    {
      icon: CreditCard,
      text: "Save time and effort in your job search"
    }
  ];

  useEffect(() => {
    if (showPaymentModal) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.async = true;
      script.setAttribute("data-payment_button_id", import.meta.env.VITE_RAZORPAY);

      const form = document.getElementById("razorpay-form");
      form?.appendChild(script);

      return () => {
        if (form) form.innerHTML = "";
      };
    }
  }, [showPaymentModal]);

  return (
    <div 
      className="min-h-screen p-2 sm:p-4 flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/gif.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Main Subscription Card */}
      <div className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl w-full transform transition-all duration-300 hover:scale-[1.02]">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="w-20 h-20 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
              <img 
                src='/assets/TrendingJobs4All.png' 
                className='h-full w-full object-contain' 
                alt="TrendingJobs4All Logo" 
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TrendingJobs4All
            </h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Premium Subscription</h2>
          <p className="text-base sm:text-lg text-gray-600">Join our exclusive community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-3 sm:p-4 rounded-xl shadow-md hover:cursor-pointer hover:shadow-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <benefit.icon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 flex-shrink-0" />
              <p className="text-sm sm:text-base text-gray-700">{benefit.text}</p>
            </div>
          ))}
        </div>

        {/* Telegram Links with Tooltips */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-6">
          <div className="relative group">
            <a 
              href="https://t.me/trendingjobs4all_QA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto"
            >
              <Send className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm sm:text-base">Join Channel</span>
            </a>
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              For regular updates join our official channel
            </div>
          </div>
          
          <div className="relative group">
            <a 
              href="https://t.me/trendingjobs4all_chat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors w-full sm:w-auto"
            >
              <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm sm:text-base">Chat Group</span>
            </a>
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              For any issues/support drop a message in the chat group
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 sm:p-4 rounded-xl mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">Terms and Conditions*</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span>Activation fee of ₹199/month</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span>Charge based on the duration of subscription</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span>Non refundable subscription</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span>Always eligible for a new subscription</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 sm:w-5 h-4 sm:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
              I have understood and accept the terms and conditions
            </span>
          </label>

          <button
            disabled={!acceptedTerms}
            onClick={() => setShowPaymentModal(true)}
            className={`w-full py-2 sm:py-3 px-4 rounded-xl text-white font-medium text-base sm:text-lg transition-all duration-300
              ${acceptedTerms 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5 hover:shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Proceed to Pay
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
      >
        <div className="min-h-[100px]">
          <p className="text-base sm:text-lg font-medium text-gray-900 mb-6 text-center">
            Click on Pay Now to complete your subscription
          </p>
          <form id="razorpay-form" className="text-center mt-4"></form>
        </div>
      </Modal>
    </div>
  );
}