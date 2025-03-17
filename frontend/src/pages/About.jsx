import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Globe, Activity } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Background glow effects */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] z-0"></div>
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] z-0"></div>
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10 mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">dPIN</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Revolutionizing website monitoring through decentralized infrastructure, blockchain verification, and AI-powered analytics.
          </p>
        </motion.div>
        
        {/* Mission Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 mb-20"
        >
          <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              At dPIN, we're on a mission to transform how websites are monitored. Traditional monitoring systems rely on centralized infrastructure that can be a single point of failure. We've built a decentralized platform that leverages the power of blockchain technology to provide tamper-proof monitoring reports and unmatched reliability.
            </p>
            <p className="text-gray-300">
              Our goal is to create a trustless monitoring environment where website owners can have complete confidence in their uptime metrics and performance data, validated by a network of independent nodes across the globe.
            </p>
          </div>
        </motion.div>
        
        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-10 mb-20"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Trust & Transparency",
                description: "We believe in verifiable data that cannot be manipulated. All monitoring results are recorded on blockchain for complete transparency."
              },
              {
                icon: CheckCircle,
                title: "Reliability",
                description: "Our decentralized infrastructure ensures that your websites are being monitored even if some parts of the internet are experiencing outages."
              },
              {
                icon: Globe,
                title: "Global Coverage",
                description: "With validator nodes spread across the world, we provide truly global monitoring coverage to detect regional outages."
              },
              {
                icon: Activity,
                title: "Continuous Innovation",
                description: "We're constantly improving our technology to provide cutting-edge monitoring solutions that stay ahead of evolving web technologies."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/40 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                    <value.icon className="h-5 w-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{value.title}</h3>
                </div>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative z-10 mb-20"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rohan Kumar Mohanta"
              },
              {
                name: "Jayesh Krishna"
              },
              {
                name: "Shivagi Sharma"
              }
            ].map((member, index) => (
              <div 
                key={index}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/40 transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
