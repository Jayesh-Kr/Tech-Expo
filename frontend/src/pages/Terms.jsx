import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: FileText,
      content: `
        <p>By accessing or using the dPIN website monitoring service (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.</p>
        <p>We may modify these terms at any time, and such modifications shall be effective immediately upon posting on the dPIN website. Your continued use of the Service following the posting of modified terms will confirm your acceptance of those changes.</p>
      `
    },
    {
      title: "Description of Service",
      icon: Shield,
      content: `
        <p>dPIN provides a decentralized website monitoring service that monitors website availability, performance, and security using a network of validator nodes operating on blockchain technology.</p>
        <p>The Service includes:</p>
        <ul>
          <li>Website uptime monitoring</li>
          <li>Performance metrics tracking</li>
          <li>Alert notifications</li>
          <li>Blockchain-verified monitoring reports</li>
          <li>Dashboard access for registered users</li>
        </ul>
      `
    },
    {
      title: "User Responsibilities",
      icon: AlertTriangle,
      content: `
        <p>When using the Service, you agree to:</p>
        <ul>
          <li>Provide accurate information when registering websites for monitoring</li>
          <li>Monitor only websites that you own or have permission to monitor</li>
          <li>Not use the Service for any illegal purpose or to violate the rights of others</li>
          <li>Maintain the security of your account credentials</li>
          <li>Not attempt to interfere with or disrupt the Service or servers connected to the Service</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>
      `
    },
    {
      title: "Intellectual Property Rights",
      icon: Scale,
      content: `
        <p>The Service and its original content, features, and functionality are owned by dPIN and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
        <p>You may not modify, reproduce, distribute, create derivative works or adaptations of, publicly display, or in any way exploit any of the content, software, or the Service in whole or in part except as expressly authorized by us.</p>
      `
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-24 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-4xl mx-auto">
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
            Terms of <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Service</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Last Updated: March 20, 2025
          </p>
        </motion.div>
        
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8 relative z-10"
        >
          <p className="text-gray-300">
            These Terms of Service ("Terms") govern your access to and use of the dPIN website monitoring service, including any applications, features, and content offered by dPIN ("we", "us", or "our").
          </p>
          <p className="text-gray-300 mt-4">
            Please read these Terms carefully before using our Service. By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
          </p>
        </motion.div>
        
        {/* Terms Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
            className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8 relative z-10"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                <section.icon className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            </div>
            <div className="text-gray-300 terms-content" dangerouslySetInnerHTML={{ __html: section.content }}></div>
          </motion.div>
        ))}
        
        {/* Additional Terms */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8 relative z-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Disclaimer of Warranties</h2>
          <p className="text-gray-300 mb-4">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. dPIN expressly disclaims all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="text-gray-300 mb-4">
            We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free. Results that may be obtained from the use of the Service are provided without warranties of any kind.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 relative z-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
          <p className="text-gray-300 mb-4">
            To the maximum extent permitted by law, in no event shall dPIN, its affiliates, directors, employees, agents, or licensors be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages, including without limitation damages for loss of profits, goodwill, use, data, or other intangible losses.
          </p>
          <h2 className="text-2xl font-bold text-white mb-4 mt-8">Changes to These Terms</h2>
          <p className="text-gray-300 mb-4">
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
          <h2 className="text-2xl font-bold text-white mb-4 mt-8">Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about these Terms, please contact us at legal@dpin.network.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
