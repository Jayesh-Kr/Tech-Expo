import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Shield, Server, Lock, Database, Network, Globe, Eye } from 'lucide-react';

const comparisonData = {
  traditional: {
    title: "Web2 Monitoring Solutions",
    metrics: [
      {
        icon: Server,
        title: "Infrastructure",
        value: "Centralized",
        description: "Single point of failure, vulnerable to outages"
      },
      {
        icon: Lock,
        title: "Data Reliability",
        value: "Moderate",
        description: "Data can be manipulated or tampered with"
      },
      {
        icon: Database,
        title: "Transparency",
        value: "Limited",
        description: "Black-box monitoring with proprietary methods"
      },
      {
        icon: Clock,
        title: "Resilience",
        value: "Medium",
        description: "Dependent on provider's uptime and reliability"
      }
    ]
  },
  ai: {
    title: "Web3 Decentralized Monitoring",
    metrics: [
      {
        icon: Network,
        title: "Infrastructure",
        value: "Decentralized",
        description: "Fault-tolerant network with no single point of failure"
      },
      {
        icon: Shield,
        title: "Data Reliability",
        value: "High",
        description: "Immutable blockchain-backed monitoring records"
      },
      {
        icon: Globe,
        title: "Transparency",
        value: "Complete",
        description: "Open verification of all monitoring activities"
      },
      {
        icon: Eye,
        title: "Resilience",
        value: "Very High",
        description: "Continues even if multiple nodes go offline"
      }
    ]
  }
};

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const Comparison = () => {
  return (
    <div id="comparison" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-3">
            <span className="relative">
              <span className="absolute inset-0 bg-[linear-gradient(to_left,#4d4d4d,#848484_20%,#ffffff_50%,#848484_80%,#4d4d4d_100%)] bg-clip-text text-transparent blur-[2px] brightness-150"></span>
              <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
                Web2 vs Web3 Monitoring
              </span>
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            See how our decentralized blockchain-powered monitoring platform compares to traditional centralized solutions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[comparisonData.traditional, comparisonData.ai].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              variants={fadeInUpVariant}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-white text-center mb-8">{section.title}</h3>
              <motion.div 
                variants={containerVariant}
                className="grid grid-cols-1 gap-6"
              >
                {section.metrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    variants={fadeInUpVariant}
                    transition={{ duration: 0.3 }}
                    className="bg-[#151524]/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:bg-[#1A1A2E]/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${sectionIndex === 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-purple-500/10 border-purple-500/20'} border`}>
                        <metric.icon className={`w-6 h-6 ${sectionIndex === 0 ? 'text-blue-400' : 'text-purple-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-lg font-medium text-white">{metric.title}</h4>
                          <span className={`text-lg font-bold ${sectionIndex === 0 ? 'text-blue-400' : 'text-purple-400'}`}>
                            {metric.value}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{metric.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-300">
            Experience the future of website monitoring with our decentralized blockchain-powered platform.
          </p>
          <div className="flex justify-center mt-8">
            <div className="relative group">
              <div className="absolute -inset-[6px] rounded-full border border-purple-400/30 group-hover:border-purple-500/60 transition-colors duration-300"></div>
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-md group-hover:from-purple-500/40 group-hover:to-pink-500/40 transition-colors duration-300"></div>
              <Link to="/pricing">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/90 text-black px-8 py-3 rounded-full font-semibold hover:bg-white/80 transition-all duration-300 shadow-[0_0_15px_rgba(139,91,255,0.3)] group-hover:shadow-[0_0_25px_rgba(139,91,255,0.6)] relative backdrop-blur-sm"
                >
                  Try dPIN Today
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Comparison;
