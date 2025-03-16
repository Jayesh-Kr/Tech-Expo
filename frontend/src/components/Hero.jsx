import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Shield, Activity, ArrowRight } from 'lucide-react';

export default function Hero() {
  const [gridItems, setGridItems] = useState(0);

  useEffect(() => {
    const calculateGrid = () => {
      const vh = Math.ceil(window.innerHeight / 40);
      const vw = Math.ceil(window.innerWidth / 40);
      setGridItems(vh * vw);
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);

  const FeatureBadge = ({ icon: Icon, text }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
    >
      <Icon size={16} className="text-purple-400" />
      <span className="text-sm text-white">{text}</span>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-r from-[#0A0F1F] via-[#1A103C] to-[#240A45] relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] auto-rows-[40px] opacity-30">
          {Array.from({ length: gridItems }).map((_, i) => (
            <div
              key={i}
              className="border-[0.5px] border-gray-500/20"
              style={{ aspectRatio: '1/1' }}
            />
          ))}
        </div>
      </div>
      
      {/* Gradient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main purple glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[120px]" />
        
        {/* Secondary blue glow */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-700/20 rounded-full blur-[100px]" />
        
        {/* Accent pink glow */}
        <div className="absolute top-20 left-20 w-[200px] h-[200px] bg-pink-600/10 rounded-full blur-[80px]" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/60 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: Math.random() * 0.5 + 0.3 
            }}
            animate={{ 
              y: [null, Math.random() * 100 + "%", Math.random() * 100 + "%"],
              x: [null, Math.random() * 100 + "%", Math.random() * 100 + "%"],
              opacity: [null, Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.3]
            }}
            transition={{ 
              duration: 15 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="flex flex-col items-center">
          {/* Spotlight badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-purple-500/30 m-8"
          >
            <span className="text-sm text-white/90 font-medium">
              <span className="text-purple-400 font-semibold">New:</span> Blockchain-Powered Monitoring Beta Launch
            </span>
          </motion.div>
          
          {/* Main headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-center leading-tight"
          >
            <span className="relative inline-block">
              <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg"></span>
              <span className="relative">Next-Gen</span>
            </span>{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 text-transparent bg-clip-text">
              Decentralized
            </span>
            <br />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-purple-300 to-white text-transparent bg-clip-text"
            >
              Website Monitoring Platform
            </motion.span>
          </motion.h1>
          
          {/* Tagline */}
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 text-center max-w-3xl"
          >
            Ensure uptime, performance, and security with a trustless, 
            blockchain-powered monitoring network that can't be compromised.
          </motion.h2>
          
          {/* Feature badges */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <FeatureBadge icon={Globe} text="Decentralized Infrastructure" />
            <FeatureBadge icon={Shield} text="Tamper-Proof Reports" />
            <FeatureBadge icon={Activity} text="Real-Time Alerts" />
          </motion.div>
          
          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
              <Link to="/signup">
                <button className="relative bg-black px-8 py-4 rounded-full font-semibold text-white hover:text-white/90 transition-all duration-300">
                  <span className="flex items-center gap-2">
                    Start Monitoring <ArrowRight size={18} />
                  </span>
                </button>
              </Link>
            </div>
            <Link to="/network" className="text-white/90 hover:text-purple-300 transition-colors duration-200 flex items-center gap-1 py-2 pl-6">
              <span>Explore Our Network</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
          
          {/* Stats counters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16"
          >
            {[
              { value: "99.99%", label: "Uptime Guarantee" },
              { value: "1,240+", label: "Monitoring Nodes" },
              { value: "45s", label: "Avg. Alert Time" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}