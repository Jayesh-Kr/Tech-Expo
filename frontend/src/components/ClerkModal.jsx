import React, { useEffect, useState } from 'react';
import { SignIn } from "@clerk/clerk-react";
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clerkAppearance from '../utils/clerkAppearance.js';

const ClerkModal = () => {
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const handleShowSignIn = () => {
      setShowModal(true);
    };
    
    document.addEventListener('clerk-show-sign-in', handleShowSignIn);
    
    return () => {
      document.removeEventListener('clerk-show-sign-in', handleShowSignIn);
    };
  }, []);
  
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <motion.div 
            className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-sm mx-4 relative"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
          >
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-1"
              onClick={() => setShowModal(false)}
            >
              <X size={16} />
            </button>
            
            <div className="mb-5 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-5 overflow-hidden">
              <SignIn 
                routing="path" 
                path="/sign-in" 
                signUpUrl="/sign-up" 
                appearance={clerkAppearance}
                redirectUrl="/dashboard"
                afterSignInUrl="/dashboard"
                socialButtonsPlacement="top"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClerkModal;
