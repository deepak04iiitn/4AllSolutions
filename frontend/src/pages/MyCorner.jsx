import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Users,
  DollarSign,
  FileEdit,
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import MyInterviews from '../components/MyInterviews';
import MyReferrals from '../components/MyReferrals';
import MySalary from '../components/MySalary';
import MyResumeTemplates from '../components/MyResumeTemplates';

export default function MyCorner() {
  const { currentUser } = useSelector((state) => state.user);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('interview');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'interview', icon: FileText, label: 'Interview Exp.' },
    { id: 'referral', icon: Users, label: 'Referrals' },
    { id: 'salary', icon: DollarSign, label: 'Salary Structures' },
    { id: 'resume', icon: FileEdit, label: 'Resume Templates' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleMenuItemClick = (itemId) => {
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const getActiveComponent = () => {
    switch (activeItem) {
      case 'interview':
        return <MyInterviews />;
      case 'referral':
        return <MyReferrals />;
      case 'salary':
        return <MySalary />;
      case 'resume':
        return <MyResumeTemplates />;
      default:
        return <div className="p-8">Select a menu item</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Header Bar */}
      <div className="fixed top-20 left-0 right-0 h-16 bg-white shadow-md z-30 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="flex items-center justify-center h-full">
          <span className="font-semibold text-lg text-gray-800">MyCorner</span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative h-screen bg-white shadow-xl transition-all duration-300 ease-in-out z-50
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex-shrink-0 pt-16 md:pt-0`}
      >
        {/* Toggle Button - Only visible on desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-blue-600 p-1.5 rounded-full text-white hover:bg-blue-700 transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <X size={16} />}
        </button>

        {/* Header - Only visible on desktop */}
        <div className="p-4 flex items-center space-x-4 hidden md:flex">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Menu className="text-white" size={24} />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg text-gray-800">MyCorner</span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="mt-8 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={`w-full flex items-center py-3 px-4 rounded-lg mb-2 transition-all duration-200
                ${activeItem === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <item.icon size={20} />
              {!isCollapsed && (
                <span className="ml-4 font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'}`}>
            <div className="relative w-10 h-10">
              <img 
                src={currentUser.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800">{currentUser.username}</h4>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50 w-full pt-16 md:pt-0">
        {getActiveComponent()}
      </div>
    </div>
  );
}