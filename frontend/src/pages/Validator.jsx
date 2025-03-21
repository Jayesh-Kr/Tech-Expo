import React, { useState, useEffect } from 'react';
import { Network, Shield, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Validator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 relative">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px]"></div>
          
          {/* Hero Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-[linear-gradient(to_left,#4d4d4d,#848484_20%,#ffffff_50%,#848484_80%,#4d4d4d_100%)] bg-clip-text text-transparent blur-[2px] brightness-150"></span>
              <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
                Become a dPIN Validator
              </span>
            </span>
          </h1>
          
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-10 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-2/5 bg-gradient-to-l from-purple-600/10 to-transparent"></div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">What is dPIN?</h2>
            
            <p className="text-gray-300 mb-6 max-w-3xl">
              <span className="text-purple-400 font-semibold">dPIN</span> (Decentralized Physical Infrastructure Network) is a revolutionary approach to website monitoring that leverages blockchain technology to create a trustless, distributed network of validators.
            </p>
            
            <p className="text-gray-300 mb-8 max-w-3xl">
              Unlike traditional monitoring services that rely on centralized servers, dPIN distributes monitoring responsibilities across a global network of independent validators, ensuring unparalleled reliability, transparency, and resistance to manipulation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <Network className="w-8 h-8 text-purple-400 mb-2" />
                <h3 className="text-lg font-medium text-white mb-1">Decentralized</h3>
                <p className="text-gray-400 text-sm">No central points of failure or control</p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <Shield className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="text-lg font-medium text-white mb-1">Tamper-Proof</h3>
                <p className="text-gray-400 text-sm">Immutable records secured by blockchain</p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <Cpu className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="text-lg font-medium text-white mb-1">Transparent</h3>
                <p className="text-gray-400 text-sm">Open verification of all monitoring results</p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <Globe className="w-8 h-8 text-pink-400 mb-2" />
                <h3 className="text-lg font-medium text-white mb-1">Global</h3>
                <p className="text-gray-400 text-sm">Monitoring nodes spread across the world</p>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-[linear-gradient(to_left,#4d4d4d,#848484_20%,#ffffff_50%,#848484_80%,#4d4d4d_100%)] bg-clip-text text-transparent blur-[2px] brightness-150"></span>
            <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
              Join Our Validator Network
            </span>
          </span>
        </h2>
        
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 mb-10 border border-white/10">
          <p className="text-gray-300 mb-6">
            Help secure our network and earn rewards by becoming a validator. Validators play a crucial role in our ecosystem by validating transactions and maintaining the integrity of the blockchain.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/30 p-5 rounded-xl border border-white/5">
              <h3 className="text-xl font-medium text-white mb-3">Requirements</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Reliable internet connection</li>
                <li>• Moderate computer specifications</li>
                <li>• Basic understanding of blockchain</li>
                <li>• Willingness to participate in the network</li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-5 rounded-xl border border-white/5">
              <h3 className="text-xl font-medium text-white mb-3">Benefits</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Earn rewards for network participation</li>
                <li>• Participate in governance decisions</li>
                <li>• Access to exclusive validator community</li>
                <li>• Priority technical support</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Link to="/signup-validator">
              <button className="bg-[#3868F9] hover:bg-[#897IFF] text-white font-medium py-3 px-8 rounded-full transition duration-300">
                Apply to Become a Validator
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Validator;
