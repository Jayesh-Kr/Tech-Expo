import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SignIn, SignUp, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Pricing from './pages/Pricing.jsx';
import Validator from './pages/Validator.jsx';
import SignupValidator from './pages/SignupValidator.jsx';
import SigninValidator from './pages/SigninValidator.jsx';
import ValidatorDashboard from './pages/ValidatorDashboard.jsx';
import Dashboard from './pages/Dashboard.jsx';
import clerkAppearance from './utils/clerkAppearance.js';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const App = () => {
  const location = useLocation();
  
  // Determine which pages should hide the navbar and footer
  const hideNavbarFooter = ['/signup', '/signin', '/sign-up', '/sign-in'].includes(location.pathname);
  
  useEffect(() => {
    // Handle smooth scrolling for anchor links
    const handleAnchorLinkClick = (e) => {
      const target = e.target;
      
      // Check if the clicked element is an anchor link with a hash
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };
    
    // Add event listener for anchor link clicks
    document.addEventListener('click', handleAnchorLinkClick);
    
    // Check for scroll targets in URL params when the route changes
    const searchParams = new URLSearchParams(location.search);
    const scrollTarget = searchParams.get('scrollTo');
    
    if (scrollTarget) {
      // Small delay to ensure the component is fully loaded
      setTimeout(() => {
        const element = document.getElementById(scrollTarget);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('click', handleAnchorLinkClick);
    };
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#0B0B1F] overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-purple-900/10 to-[#0B0B1F]" />
      
      {/* Glowing orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[140px]" />
      
      {/* Content */}
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/validator" element={<Validator />} />
        <Route path="/validators" element={<Validator />} /> {/* Redirect for plural */}
        
        {/* Add routes for new pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Enhanced Clerk sign-up route with improved alignment */}
        <Route path="/sign-up/*" element={
          <div className="flex items-center justify-center min-h-screen px-4 py-10">
            <div className="w-full max-w-md">
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 relative z-10 shadow-xl">
                <div className="mb-5 text-center">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Create your account</h2>
                  <p className="text-gray-400 text-sm">Join our platform and start monitoring websites</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-5 overflow-hidden">
                  <SignUp 
                    routing="path" 
                    path="/sign-up" 
                    signInUrl="/sign-in" 
                    appearance={clerkAppearance}
                    redirectUrl="/dashboard"
                    socialButtonsPlacement="top"
                  />
                </div>
              </div>
            </div>
          </div>
        } />
        
        {/* Enhanced Clerk sign-in route with improved alignment */}
        <Route path="/sign-in/*" element={
          <div className="flex items-center justify-center min-h-screen px-4 py-20">
            <div className="w-full max-w-md">
              <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 relative z-10 shadow-xl">
                <div className="mb-6 text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
                  <p className="text-gray-400 text-sm">Sign in to access your monitoring dashboard</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <SignIn 
                    routing="path" 
                    path="/sign-in" 
                    signUpUrl="/sign-up" 
                    appearance={clerkAppearance}
                    redirectUrl="/dashboard"
                    socialButtonsPlacement="top"
                  />
                </div>
              </div>
            </div>
          </div>
        } />
        
        {/* Legacy routes with improved overflow handling */}
        <Route path="/signup" element={
          <div className="flex items-center justify-center min-h-screen px-4 py-10">
            <div className="w-full max-w-md">
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 relative z-10 shadow-xl">
                <div className="mb-5 text-center">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Create your account</h2>
                  <p className="text-gray-400 text-sm">Join our platform and start monitoring websites</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 overflow-hidden">
                  <SignUp 
                    routing="path" 
                    path="/sign-up" 
                    signInUrl="/sign-in" 
                    appearance={clerkAppearance}
                    redirectUrl="/dashboard"
                    socialButtonsPlacement="top"
                  />
                </div>
              </div>
            </div>
          </div>
        } />
        
        <Route path="/signin" element={
          <div className="flex items-center justify-center min-h-screen px-4 py-10">
            <div className="w-full max-w-md">
              <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 relative z-10 shadow-xl">
                <div className="mb-5 text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
                  <p className="text-gray-400 text-sm">Sign in to access your monitoring dashboard</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <SignIn 
                    routing="path" 
                    path="/sign-in" 
                    signUpUrl="/sign-up" 
                    appearance={clerkAppearance}
                    redirectUrl="/dashboard"
                    socialButtonsPlacement="top"
                  />
                </div>
              </div>
            </div>
          </div>
        } />
        
        {/* Protected validator routes */}
        <Route path="/signup-validator" element={<SignupValidator />} />
        <Route path="/signin-validator" element={<SigninValidator />} />
        <Route path="/validator-dashboard" element={<ValidatorDashboard />} />
        
        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl="/dashboard" />
              </SignedOut>
            </>
          }
        />
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default App;