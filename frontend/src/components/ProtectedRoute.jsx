import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, redirectTo = '/signin-validator' }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate auth check
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setIsSignedIn(false);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(checkAuth);
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin mr-2 h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        <span className="text-white text-lg">Loading...</span>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return <Navigate to={redirectTo} />;
  }
  
  return children;
};

export default ProtectedRoute;
