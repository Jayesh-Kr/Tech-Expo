import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network, ChevronLeft, Check } from 'lucide-react';

const SignupValidator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
    if (!formData.email || !formData.password || !formData.name) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate signup process
      setTimeout(() => {
        console.log('Signup with:', formData.email, formData.name);
        setSuccess(true);
        
        // Redirect to dashboard after signup
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
      console.error('Signup error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] z-0"></div>
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] z-0"></div>
        
        <Link to="/validator" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 relative z-10">
          <ChevronLeft size={20} />
          <span>Back to Validator Info</span>
        </Link>

        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <Network className="text-purple-400 w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Become a Validator</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-xl text-white mb-4">Join the dPIN Network</h2>
            <p className="text-gray-300">
              By becoming a validator, you'll participate in our decentralized network and
              help ensure the reliability and transparency of our monitoring services.
            </p>
          </div>

          {success ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-500/20 rounded-full p-1">
                  <Check className="text-green-400 w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-white">Registration Successful!</h3>
              </div>
              <p className="text-gray-300">
                Thank you for signing up as a validator. We're redirecting you back to the validator page...
              </p>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <h3 className="text-white text-lg font-medium mb-4">Create Your Validator Account</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" 
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" 
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Password</label>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" 
                    placeholder="••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">Confirm Password</label>
                  <input 
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white" 
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="pt-2">
                  <motion.button
                    whileHover={{ backgroundColor: "#9333ea" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className={`
                      w-full 
                      ${isSubmitting ? 'bg-purple-600/70' : 'bg-purple-600'} 
                      text-white font-medium py-4 rounded-lg 
                      transition-colors duration-300 
                      flex items-center justify-center 
                      relative overflow-hidden
                      group border border-purple-500/40
                    `}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></span>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <span className="flex items-center">
                        Become a Validator
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </motion.button>
                </div>
                
                <div className="text-center text-gray-400 text-sm mt-4">
                  Already have an account? <Link to="/signin-validator" className="text-purple-400 hover:text-purple-300">Sign In</Link>
                </div>
              </form>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>
              By signing up, you agree to our <Link to="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link> and <Link to="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupValidator;
