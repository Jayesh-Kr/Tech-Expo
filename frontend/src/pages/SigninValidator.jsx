import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network, ChevronLeft } from 'lucide-react';
import axios from 'axios';

const SigninValidator = () => {
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
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/validator-signin",{
        email : formData.email,
        password : formData.password,
      })
      console.log(res);
      console.log(res.data.token);
      localStorage.setItem("token",res.data.token);
      setIsSubmitting(false);
      navigate('/validator-dashboard');
    } catch (err) {
      setError('An authentication error occurred. Please try again.');
      console.error('Signin error:', err);
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
            <h1 className="text-3xl font-bold text-white">Validator Sign In</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-xl text-white mb-4">Access Your Validator Dashboard</h2>
            <p className="text-gray-300">
              Sign in to access your validator controls, view your rewards, and monitor your network participation status.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
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
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Forgot password?
                </a>
              </div>
              
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-[#3868F9]/70' : 'bg-[#3868F9] hover:bg-[#897IFF]'} text-white font-medium py-3 rounded-lg transition duration-300 flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : 'Sign In'}
                </motion.button>
              </div>
              
              <div className="text-center text-gray-400 text-sm mt-4">
                Don't have an account? <Link to="/signup-validator" className="text-purple-400 hover:text-purple-300">Sign Up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninValidator;
