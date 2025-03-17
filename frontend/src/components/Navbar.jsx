import React, { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";
import Logo from './Logo.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

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

  const handleDashboardClick = (e) => {
    if (!isSignedIn) {
      e.preventDefault();
      // Show the Clerk sign-in modal when user tries to access dashboard without login
      navigate('/sign-in', { state: { redirectUrl: '/dashboard' } });
    }
  };

  const handleFeaturesClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    
    // If already on homepage, just scroll to features section
    if (location.pathname === '/') {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to homepage with a flag to scroll to features
      navigate('/?scrollTo=features');
    }
  };

  return (
    <nav className="bg-black/30 backdrop-blur-md py-4 rounded-full shadow-lg fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition duration-300 w-[90%] max-w-6xl border border-white/[0.08]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <Logo />
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={handleFeaturesClick} className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              Features
            </button>
            <Link to="/pricing" className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              Pricing
            </Link>
            <Link to="/validator" className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm">
              Become a Validator
            </Link>
            <Link 
              to="/dashboard" 
              onClick={handleDashboardClick}
              className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
            >
              Dashboard
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8"
                  }
                }}
              />
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button className="text-white/90 hover:text-white transition duration-200 text-sm">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-[#3868F9] text-white px-5 py-1.5 rounded-full hover:bg-[#897IFF] transition duration-200 hover:shadow-lg text-sm">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
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
                onClick={(e) => {
                  handleFeaturesClick(e);
                  setIsOpen(false);
                }} 
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm text-left"
              >
                Features
              </button>
              <Link 
                to="/pricing" 
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
              >
                Pricing
              </Link>
              <Link 
                to="/validator" 
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
              >
                Become a Validator
              </Link>
              
              <Link 
                to="/dashboard" 
                onClick={(e) => {
                  setIsOpen(false);
                  handleDashboardClick(e);
                }}
                className="text-white/90 hover:text-[#E36FFF] transition duration-200 text-sm"
              >
                Dashboard
              </Link>
              
              <div className="pt-2 border-t border-white/10 flex flex-col space-y-2">
                {isSignedIn ? (
                  <div className="flex items-center">
                    <UserButton afterSignOutUrl="/" />
                    <span className="ml-2 text-white/90 text-sm">Your Account</span>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <SignInButton mode="modal">
                      <button className="text-white/90 hover:text-white bg-black/30 px-4 py-1.5 rounded-full transition duration-200 text-sm w-full text-center">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-[#3868F9] text-white px-5 py-1.5 rounded-full hover:bg-[#897IFF] transition duration-200 hover:shadow-lg text-sm w-full text-center">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
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