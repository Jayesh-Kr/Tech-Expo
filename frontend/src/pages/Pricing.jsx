import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import PageContainer from '../components/PageContainer';

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Pricing plans
  const plans = [
    {
      name: "Free",
      description: "Perfect for individuals testing our platform",
      price: annual ? "0" : "0",
      billing: "/month",
      features: [
        { title: "1 website monitored", included: true },
        { title: "Monitoring every 15 minutes", included: true },
        { title: "Email notifications", included: true },
        { title: "3-day history", included: true },
        { title: "Basic uptime reports", included: true },
        { title: "Community support", included: true },
        { title: "Blockchain verification", included: false },
        { title: "Advanced analytics", included: false },
      ],
      callToAction: "Get Started",
      callToActionLink: "/sign-up",
      highlight: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Pro",
      description: "For small businesses and growing websites",
      price: annual ? "1" : "1.2",
      billing: annual ? " SOL/month, billed annually" : " SOL/month, billed monthly",
      features: [
        { title: "10 websites monitored", included: true },
        { title: "Monitoring every 5 minutes", included: true },
        { title: "Email, SMS & Slack notifications", included: true },
        { title: "30-day history", included: true },
        { title: "Performance metrics", included: true },
        { title: "API access", included: true },
        { title: "Blockchain verification", included: true },
        { title: "Priority support", included: true },
      ],
      callToAction: "Start 14-Day Trial",
      callToActionLink: "/sign-up?plan=pro",
      highlight: true,
      color: "from-purple-600 to-pink-600"
    },
    {
      name: "Enterprise",
      description: "For organizations with advanced monitoring needs",
      price: annual ? "2" : "2.5",
      billing: annual ? " SOL/month, billed annually" : " SOL/month, billed monthly",
      features: [
        { title: "Unlimited websites", included: true },
        { title: "Monitoring every 1 minute", included: true },
        { title: "All notification channels + API", included: true },
        { title: "12-month history", included: true },
        { title: "Advanced anomaly detection", included: true },
        { title: "Multi-region monitoring", included: true },
        { title: "Custom blockchain verification", included: true },
        { title: "Dedicated account manager", included: true },
      ],
      callToAction: "Contact Sales",
      callToActionLink: "/contact",
      highlight: false,
      color: "from-blue-600 to-indigo-600"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 px-4 sm:px-6 lg:px-8 pb-20">
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
            <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
              Plans and Pricing
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Choose the plan that fits your monitoring needs with powerful features powered by blockchain for unmatched reliability.
          </p>
          
          {/* Pricing toggle */}
          <div className="mt-8 flex items-center justify-center">
            <span className={`text-sm ${annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button 
              onClick={() => setAnnual(!annual)} 
              className="relative inline-flex h-8 w-14 mx-3 items-center rounded-full bg-black/40 border border-purple-500/30"
            >
              <span 
                className={`inline-block h-6 w-6 transform rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transition-transform ${
                  annual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? 'text-gray-400' : 'text-white'}`}>Annual</span>
            <span className="ml-2 rounded-full bg-gradient-to-r from-green-500/20 to-green-500/30 text-green-300 text-xs py-1 px-2">
              Save 16%
            </span>
          </div>
        </motion.div>
        
        {/* Pricing Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`rounded-2xl border ${
                plan.highlight 
                  ? 'border-purple-400/50 shadow-lg shadow-purple-500/20' 
                  : 'border-white/10'
              } bg-black/30 backdrop-blur-md overflow-hidden relative ${
                plan.highlight ? 'md:-mt-4 md:mb-4' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 inset-x-0 py-1 text-xs font-medium text-center text-white bg-gradient-to-r from-purple-600 to-pink-600">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 pt-8">
                <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
                <p className="text-sm text-gray-400 h-10">{plan.description}</p>
                
                <div className="mt-6 mb-8">
                  <p className="flex items-end">
                    <span className="text-4xl font-bold text-white">{plan.price} SOL</span>
                    <span className="text-sm text-gray-400 ml-2">{plan.billing}</span>
                  </p>
                </div>
                
                <Link to={plan.callToActionLink}>
                  <button 
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium flex justify-center items-center space-x-2 transition-all
                      bg-gradient-to-r ${plan.color} hover:shadow-lg hover:opacity-90`}
                  >
                    <span>{plan.callToAction}</span>
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
              
              <div className="border-t border-white/10 p-6">
                <h3 className="font-medium text-white mb-4">What's included:</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.included ? (
                        <CheckCircle size={18} className="text-green-400 mr-2 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={18} className="text-gray-500 mr-2 shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-gray-300" : "text-gray-500"}>
                        {feature.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enterprise Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-2xl p-8 relative z-10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <AlertCircle size={24} className="text-purple-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Need a custom monitoring solution?</h3>
              </div>
              <p className="text-gray-300 mt-2 max-w-2xl">
                Contact our sales team for custom pricing and features tailored to your organization's specific monitoring requirements.
              </p>
            </div>
            <Link to="/contact" className="shrink-0">
              <button className="bg-white text-gray-900 hover:bg-gray-100 py-2 px-6 rounded-lg font-medium transition-colors">
                Contact Sales
              </button>
            </Link>
          </div>
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-20 relative z-10"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                question: "How does blockchain verification work?",
                answer: "Our monitoring results are cryptographically signed and stored on a blockchain, ensuring that monitoring data cannot be tampered with or falsified. This provides an immutable audit trail of your website's performance history."
              },
              {
                question: "Can I change my plan later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll get immediate access to the new features. When you downgrade, the changes will take effect at the end of your current billing cycle."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a full refund within the first 14 days of your subscription."
              },
              {
                question: "How does multi-region monitoring work?",
                answer: "With multi-region monitoring, your websites are checked from multiple geographic locations around the world, ensuring that you're aware of regional outages or performance issues that might affect only certain parts of your user base."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-white mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;