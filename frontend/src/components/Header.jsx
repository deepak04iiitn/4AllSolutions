import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  User, 
  BookOpen, 
  BriefcaseIcon, 
  TrendingUp, 
  LogOut, 
  Home, 
  Info,
  Menu,
  X,
  Puzzle
} from 'lucide-react';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const mobileMenuRef = useRef(null);
  const profileRef = useRef(null);
  const featuresRef = useRef(null);


  // Modified mobile menu handlers
  const openMobileMenu = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (featuresRef.current && !featuresRef.current.contains(event.target)) {
        setIsFeaturesOpen(false);
      }
    };

    // Add click event listener to handle outside clicks
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset'; // Ensure scroll is restored on unmount
    };
  }, []);


  const toggleProfile = (e) => {
    e.stopPropagation();
    // Only toggle profile dropdown if not in mobile view
    if (windowWidth >= 768) {
      setIsProfileOpen(!isProfileOpen);
    }
  };

  // Fixed handleProfileNavigation function
  const handleProfileNavigation = (path) => {
    setIsProfileOpen(false);
    closeMobileMenu(); // Close mobile menu when navigating
    navigate(path);
  };

  // Fixed handleSignout function
  const handleSignout = async () => {
    try {
      setIsProfileOpen(false); // Close the dropdown immediately
      closeMobileMenu(); // Close mobile menu when signing out
      const res = await fetch('/backend/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleFeatureNavigation = (path) => {
    setIsFeaturesOpen(false);
    navigate(path);
  };


  const MenuItems = ({ isMobile = false }) => (
    <>
      <Link to="/">
        <div className={`flex items-center space-x-1 ${isMobile ? 'text-gray-800 py-3 px-4 hover:bg-gray-100' : 'text-gray-200 hover:text-cyan-400'} transition-colors`}>
          <Home size={18} />
          <span>Home</span>
        </div>
      </Link>
      
      <Link to="/about">
        <div className={`flex items-center space-x-1 ${isMobile ? 'text-gray-800 py-3 px-4 hover:bg-gray-100' : 'text-gray-200 hover:text-cyan-400'} transition-colors`}>
          <Info size={18} />
          <span>About Us</span>
        </div>
      </Link>
      
      <Link to="/my-jobs">
        <div className={`flex items-center space-x-1 ${isMobile ? 'text-gray-800 py-3 px-4 hover:bg-gray-100' : 'text-gray-200 hover:text-cyan-400'} transition-colors`}>
          <BriefcaseIcon size={18} />
          <span>My Jobs</span>
        </div>
      </Link>
      
      <Link to="/trends">
        <div className={`flex items-center space-x-1 ${isMobile ? 'text-gray-800 py-3 px-4 hover:bg-gray-100' : 'text-gray-200 hover:text-cyan-400'} transition-colors`}>
          <TrendingUp size={18} />
          <span>Trends</span>
        </div>
      </Link>
    </>
  );

  // Update ProfileDropdown component to handle mobile views
  const ProfileDropdown = () => (
    <AnimatePresence>
      {isProfileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-50"
          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
        >
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.profilePicture}
                alt="user"
                className="w-12 h-12 rounded-full border-2 border-blue-300"
              />
              <div>
                <p className="text-lg font-semibold text-blue-800">
                  @{currentUser.username}
                </p>
                <p className="text-sm text-purple-600">{currentUser.email}</p>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <motion.div
              whileHover={{ x: 8 }}
              onClick={() => handleProfileNavigation('/profile')}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <User size={18} />
              <span>Profile</span>
            </motion.div>
            
            <motion.div
              whileHover={{ x: 8 }}
              onClick={() => handleProfileNavigation('/myCorner')}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <BookOpen size={18} />
              <span>My Corner</span>
            </motion.div>
            
            <motion.div
              whileHover={{ x: 8 }}
              onClick={handleSignout}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r from-red-500 to-pink-500 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );


  const FeaturesDropdown = () => (
    <AnimatePresence>
      {isFeaturesOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-50"
        >
          <div className="p-2">
            <motion.div
              whileHover={{ x: 8 }}
              onClick={() => handleFeatureNavigation('/interviewExp')}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <User size={18} />
              <span>Interview Experiences</span>
            </motion.div>
            
            <motion.div
              whileHover={{ x: 8 }}
              onClick={() => handleFeatureNavigation('/referrals')}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <BriefcaseIcon size={18} />
              <span>Referrals</span>
            </motion.div>
            
            <motion.div
              whileHover={{ x: 8 }}
              onClick={() => handleFeatureNavigation('/salaryStructures')}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <TrendingUp size={18} />
              <span>Salary Structures</span>
            </motion.div>
            
            <motion.div
              whileHover={{ x: 8 }}
              onClick={() => handleFeatureNavigation('/resumeTemplates')}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <BookOpen size={18} />
              <span>Resume Templates</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  

  const handleMobileNavigation = (e, path) => {
    e.preventDefault();
    closeMobileMenu();
    navigate(path);
  };


  const MobileProfileSection = () => (
    currentUser && (
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="w-10 h-10 rounded-full border-2 border-blue-300"
          />
          <div>
            <p className="font-semibold">@{currentUser.username}</p>
            <p className="text-sm text-gray-600">{currentUser.email}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleProfileNavigation('/profile')}
            className="w-full py-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg"
          >
            <User size={18} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => handleProfileNavigation('/myCorner')}
            className="w-full py-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg"
          >
            <BookOpen size={18} />
            <span>My Corner</span>
          </button>
          <button
            onClick={handleSignout}
            className="w-full py-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    )
  );


  // Modified mobile menu
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-2xl z-50 flex flex-col"
            ref={mobileMenuRef}
          >
            <div className="p-4 bg-gradient-to-r from-blue-800 to-purple-800">
              <div className="flex justify-between items-center">
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  className="flex items-center"
                >
                  <img
                    src="/assets/TrendingJobs4All.png"
                    alt="Career Connect"
                    className="h-12 w-12"
                  />
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="text-white p-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="py-2">
                {/* Navigation Items */}
                {['/', '/about', '/my-jobs', '/trends'].map((path, index) => {
                  const icons = [<Home />, <Info />, <BriefcaseIcon />, <TrendingUp />];
                  const labels = ['Home', 'About Us', 'My Jobs', 'Trends'];
                  
                  return (
                    <div
                      key={path}
                      onClick={() => {
                        closeMobileMenu();
                        navigate(path);
                      }}
                      className="flex items-center space-x-1 text-gray-800 py-3 px-4 hover:bg-gray-100 cursor-pointer"
                    >
                      {React.cloneElement(icons[index], { size: 18 })}
                      <span>{labels[index]}</span>
                    </div>
                  );
                })}

                {/* Features Section */}
                <div className="border-t border-gray-200 mt-2">
                  <div className="px-4 py-3 text-sm font-semibold text-gray-600 flex items-center">
                    <Puzzle size={16} className="mr-2" />
                    Features
                  </div>
                  {[
                    { path: '/interviewExp', icon: <User size={18} />, label: 'Interview Experiences' },
                    { path: '/referrals', icon: <BriefcaseIcon size={18} />, label: 'Referrals' },
                    { path: '/salaryStructures', icon: <TrendingUp size={18} />, label: 'Salary Structures' },
                    { path: '/resumeTemplates', icon: <BookOpen size={18} />, label: 'Resume Templates' }
                  ].map(({ path, icon, label }) => (
                    <div
                      key={path}
                      onClick={() => {
                        closeMobileMenu();
                        navigate(path);
                      }}
                      className="flex items-center space-x-3 py-3 px-4 text-gray-800 hover:bg-gray-100 cursor-pointer"
                    >
                      {icon}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <MobileProfileSection />

          </motion.div>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMobileMenu}
          />
        </>
      )}
    </AnimatePresence>
  );


  return (
    <nav className="relative py-4 bg-gradient-to-r from-blue-800 to-purple-800 border-b-4 border-purple-500 shadow-lg">
      <div className="max-w-full mx-2">
        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between w-full">
          <button
            onClick={openMobileMenu}
            className="text-white p-1"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/assets/TrendingJobs4All.png"
              alt="Career Connect"
              className="h-16 w-16 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            />
          </Link>

          {currentUser ? (
            // Modified mobile profile section - just the image, no dropdown
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.1 }}
                src={currentUser.profilePicture}
                alt="user"
                className="w-10 h-10 rounded-full border-2 border-blue-300 shadow-lg"
                onClick={() => handleProfileNavigation('/profile')}
              />
            </div>
          ) : (
            <Link to="/sign-in">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                Sign In
              </motion.button>
            </Link>
          )}
        </div>

        {/* Desktop View - Keep existing desktop view code unchanged */}
        <div className="hidden md:flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/TrendingJobs4All.png"
              alt="Career Connect"
              className="h-16 w-16 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            />
          </Link>

          <div className="flex items-center space-x-6">
            <MenuItems />
            
            <div className="relative" ref={featuresRef}>
              <button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center space-x-1 text-gray-200 hover:text-cyan-400 transition-colors"
              >
                <Puzzle size={18} className="mr-1" />
                <span>Features</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform duration-200 ${
                    isFeaturesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <FeaturesDropdown />
            </div>
          </div>

          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="relative"
              >
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={currentUser.profilePicture}
                  alt="user"
                  className="w-10 h-10 rounded-full border-2 border-blue-300 shadow-lg"
                />
                <motion.div
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5"
                >
                  <ChevronDown size={14} className="text-white" />
                </motion.div>
              </button>
              <ProfileDropdown />
            </div>
          ) : (
            <Link to="/sign-in">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign In
              </motion.button>
            </Link>
          )}
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
}