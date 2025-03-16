import React from 'react';
import { Activity, Globe, SearchCode, AlertCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      staggerChildren: 0.2
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const HowItWorks = () => {
  return (
    <motion.div
      id="how-it-works"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="pt-8 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-3">
            <span className="relative">
              <span className="absolute inset-0 bg-[linear-gradient(to_left,#4d4d4d,#848484_20%,#ffffff_50%,#848484_80%,#4d4d4d_100%)] bg-clip-text text-transparent blur-[2px] brightness-150"></span>
              <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
                How dPIN Works
              </span>
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Get started in minutes with our cloud-based monitoring solution. No software to install, no hardware to maintain. Just simple, reliable website monitoring powered by our advanced infrastructure.
          </p>
        </motion.div>
        
        <div className="space-y-8">
          {/* First Row */}
          <motion.div
            variants={rowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
          >
            {[
              {
                icon: Globe,
                title: "1. Add Your Websites",
                description: "Simply input your website URLs through our dashboard or API. Set up checks for specific pages, API endpoints, or entire sites."
              },
              {
                icon: Activity,
                title: "2. Set Monitoring Parameters",
                description: "Configure check frequency, alert thresholds, and notification preferences based on your business needs."
              },
              {
                icon: SearchCode,
                title: "3. Get Insights & Analytics",
                description: "Access comprehensive dashboards with uptime statistics, response times, and performance metrics in real-time."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="bg-[#151524] p-6 rounded-2xl hover:bg-[#1A1A2E] transition-all duration-300 border border-gray-800">
                  <div className="w-14 h-14 rounded-full bg-[#2D2D3D] flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-purple-500" size={28} />
                  </div>
                  <h3 className="text-white text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second Row */}
          <motion.div
            variants={rowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-7 gap-6 text-center mt-6"
          >
            {[
              {
                icon: AlertCircle,
                title: "4. Receive Smart Alerts",
                description: "Get instant notifications through your preferred channels (email, SMS, Slack, webhooks) when issues arise, with intelligent diagnostic information.",
                colSpan: "md:col-span-3"
              },
              {
                icon: Shield,
                title: "5. Resolve & Improve",
                description: "Use our detailed reports and suggestions to troubleshoot issues and continuously optimize your website's performance and reliability.",
                colSpan: "md:col-span-4"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.02 }}
                className={`relative group ${item.colSpan}`}
              >
                <div className="bg-[#151524] p-6 rounded-2xl hover:bg-[#1A1A2E] transition-all duration-300 border border-gray-800">
                  <div className="w-14 h-14 rounded-full bg-[#2D2D3D] flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-purple-500" size={28} />
                  </div>
                  <h3 className="text-white text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;