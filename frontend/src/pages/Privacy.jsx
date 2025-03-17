import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: Eye,
      content: `
        <p>We collect several types of information from and about users of our Services, including:</p>
        <ul>
          <li>Personal data: name, email address, and contact information when you register for an account</li>
          <li>Website URLs that you submit for monitoring</li>
          <li>Usage data: information about how you access and use our Services</li>
          <li>Device information: IP address, browser type, operating system</li>
        </ul>
      `
    },
    {
      title: "How We Use Your Information",
      icon: FileText,
      content: `
        <p>We use the information we collect to:</p>
        <ul>
          <li>Set up and maintain your account and provide the Services you request</li>
          <li>Monitor the websites you register</li>
          <li>Send alerts and notifications about your websites' status</li>
          <li>Improve our Services and develop new features</li>
          <li>Communicate with you about your account and our Services</li>
          <li>Protect the security and integrity of our platform</li>
        </ul>
      `
    },
    {
      title: "Data Security",
      icon: Lock,
      content: `
        <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
        <ul>
          <li>End-to-end encryption for all sensitive data</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Advanced authentication mechanisms</li>
          <li>Blockchain-based verification for data integrity</li>
          <li>Regular backups and disaster recovery procedures</li>
        </ul>
        <p>While we use commercially reasonable efforts to protect your data, no method of transmission over the internet or electronic storage is 100% secure.</p>
      `
    },
    {
      title: "Data Sharing and Disclosure",
      icon: Shield,
      content: `
        <p>We may share your information with:</p>
        <ul>
          <li>Our validator network, which consists of decentralized nodes that perform website monitoring (only website URLs, not personal data)</li>
          <li>Third-party service providers that help us operate our business</li>
          <li>Legal authorities when required by law</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
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
            Privacy <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Policy</span>
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
            This Privacy Policy describes how dPIN ("we", "us", or "our") collects, uses, and discloses your information when you use our website monitoring service (the "Service"). 
            We are committed to protecting your privacy and the security of your data.
          </p>
          <p className="text-gray-300 mt-4">
            By using the Service, you agree to the collection and use of information in accordance with this policy. This Privacy Policy applies to all users of our Service, 
            including website owners who register their sites for monitoring and validators who participate in our decentralized monitoring network.
          </p>
        </motion.div>
        
        {/* Policy Sections */}
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
            <div className="text-gray-300 policy-content" dangerouslySetInnerHTML={{ __html: section.content }}></div>
          </motion.div>
        ))}
        
        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-8 relative z-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
          <p className="text-gray-300 mb-4">
            Depending on your location, you may have certain rights regarding your personal data, including:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>The right to access your personal data</li>
            <li>The right to rectify inaccurate personal data</li>
            <li>The right to delete your personal data</li>
            <li>The right to restrict processing of your personal data</li>
            <li>The right to data portability</li>
            <li>The right to object to processing of your personal data</li>
          </ul>
          <p className="text-gray-300 mt-4">
            To exercise any of these rights, please contact us at privacy@dpin.network.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 p-8 relative z-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
          <p className="text-gray-300 mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p className="text-gray-300 mb-4">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
          <h2 className="text-2xl font-bold text-white mb-4 mt-8">Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at privacy@dpin.network.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
