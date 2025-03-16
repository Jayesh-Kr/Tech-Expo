import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ChevronLeft } from 'lucide-react';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate authentication
      setTimeout(() => {
        console.log('Login with:', formData.email);
        // Redirect to homepage after login
        navigate('/');
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setError('An authentication error occurred. Please try again.');
      console.error('Signin error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 sm:px-6 lg:px-8 flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-auto">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] z-0"></div>
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] z-0"></div>
        
        <Link to="/" className="text-white/80 hover:text-white flex items-center gap-2 mb-8 relative z-10">
          <ChevronLeft size={18} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-white/10 relative z-10 shadow-xl">
          <div className="flex items-center gap-3 mb-8 pb-5 border-b border-white/10">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <LogIn className="text-blue-400 w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold text-white">Sign In</h1>
          </div>

          <div className="mb-8">
            <p className="text-gray-300">
              Welcome back! Sign in to access your account and monitoring dashboard.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/10 mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-6">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Password</label>
                <input 
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-300 text-sm">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm">
                  Forgot password?
                </Link>
              </div>
              
              <div className="pt-6">
                <motion.button
                  whileHover={{ backgroundColor: "#4273fb" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`
                    w-full 
                    ${isSubmitting ? 'bg-[#3868F9]/70' : 'bg-[#3868F9]'} 
                    text-white font-medium py-4 rounded-lg 
                    transition-colors duration-300 
                    flex items-center justify-center 
                    relative overflow-hidden
                    group border border-blue-500/40
                  `}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <span className="flex items-center">
                      Sign In
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </motion.button>
              </div>
              
              <div className="text-center text-gray-400 text-sm mt-6">
                Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">Sign Up</Link>
              </div>
            </form>
          </div>
          
          <div className="text-center text-sm text-gray-400 pt-2">
            <p>
              Need to join as a validator instead? <Link to="/signin-validator" className="text-purple-400 hover:text-purple-300">Validator Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
