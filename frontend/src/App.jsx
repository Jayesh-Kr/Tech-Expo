import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';

const App = () => {
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
    
    // Clean up event listener
    return () => {
      document.removeEventListener('click', handleAnchorLinkClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#0B0B1F] overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-purple-900/10 to-[#0B0B1F]" />
      
      {/* Glowing orbs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[140px]" />
      
      {/* Content */}
      <Navbar />
      <Routes>
        <Route path="/" element={
          <LandingPage/>
        } />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
