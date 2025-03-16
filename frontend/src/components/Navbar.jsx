import React, { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false); // Simple state for demo purposes

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/#' + sectionId);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-black/30 backdrop-blur-md py-4 rounded-full shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition duration-300 w-[90%] max-w-6xl border border-white/[0.08]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={()=>navigate("/")}>
            <Logo />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              How it Works
            </button>
            <Link to="/pricing" className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              Pricing
            </Link>
            {isSignedIn ? (
              <Link to="/dashboard" className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
                Dashboard
              </Link>
            ) : (
              <Link to="/validator" className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
                Become a Validator
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-white/90 text-sm">
                  User
                </span>
                <button 
                  onClick={handleSignOut}
                  className="bg-gray-800/80 text-white/90 px-4 py-1.5 rounded-full hover:bg-gray-700/80 transition duration-200 text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/signup" 
                className="bg-[#3868F9] text-white px-5 py-1.5 rounded-full hover:bg-[#897IFF] transition duration-200 hover:shadow-lg text-sm"
              >
                Sign Up
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white/90">
              {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-black/80 backdrop-blur-xl rounded-xl border border-white/[0.08] p-4 absolute top-full left-0 right-0 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  scrollToSection('features');
                  setIsOpen(false);
                }} 
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm text-left"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  scrollToSection('how-it-works');
                  setIsOpen(false);
                }} 
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm text-left"
              >
                How it Works
              </button>
              <Link 
                to="/pricing" 
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
              >
                Pricing
              </Link>
              
              {isSignedIn ? (
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/validator" 
                  onClick={() => setIsOpen(false)}
                  className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
                >
                  Become a Validator
                </Link>
              )}
              
              <div className="pt-2 border-t border-white/10 flex flex-col space-y-2">
                {isSignedIn ? (
                  <button 
                    onClick={() => {
                      setIsSignedIn(false);
                      setIsOpen(false);
                      navigate('/');
                    }}
                    className="bg-gray-800/80 text-white/90 px-4 py-1.5 rounded-full hover:bg-gray-700/80 transition duration-200 text-sm"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="bg-[#3868F9] text-white px-5 py-1.5 rounded-full hover:bg-[#897IFF] transition duration-200 hover:shadow-lg text-sm text-center"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;