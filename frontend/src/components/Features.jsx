import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, CartesianGrid, YAxis } from 'recharts';
import { ArrowUpRight, BarChart3, PieChart, TrendingUp, BellRing, Zap, Clock, Smile } from 'lucide-react';

const chartData = [
  { time: '1 min', latency: 100 },
  { time: '2 min', latency: 80 },
  { time: '3 min', latency: 250 },
  { time: '4 min', latency: 200 },
  { time: '5 min', latency: 180 },
  { time: '6 min', latency: 300 },
  { time: '7 min', latency: 250 },
  { time: '8 min', latency: 280 },
  { time: '9 min', latency: 200 },
  { time: '10 min', latency: 150 },
];

const pipelineData = [
  { id: '01', name: 'Database Performance', progress: 98.8, color: '#FFB547' },
  { id: '02', name: 'Successful Transactions', progress: 95, color: '#3DD2B4' },
  { id: '03', name: 'Monitoring Accuracy', progress: 96.5, color: '#F06292' },
];

const ProgressBar = ({ progress, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-gray-800/50 rounded-full h-2" ref={progressRef}>
      <div
        className="h-2 rounded-full transition-all duration-[1500ms] ease-out"
        style={{ 
          width: isVisible ? `${progress}%` : '0%',
          backgroundColor: color,
        }}
      />
    </div>
  );
};

const CircleProgress = ({ progress }) => {
  const [isVisible, setIsVisible] = useState(false);
  const circleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (circleRef.current) {
      observer.observe(circleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-28 h-28" ref={circleRef}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1F2937"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3868F9"
          strokeWidth="8"
          strokeDasharray={`${isVisible ? progress * 2.83 : 0} ${100 * 2.83}`}
          style={{ transition: 'all 1.5s ease-out' }}
          className="transition-all ease-out"
        />
      </svg>
    </div>
  );
};

const GradientChart = () => (
  <ResponsiveContainer width="100%" height={150}>
    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3868F9" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#3868F9" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid 
        strokeDasharray="0"
        stroke="rgba(255,255,255,0.1)"
        horizontal={true}
        vertical={true}
      />
      <XAxis
        dataKey="time"
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#9CA3AF', fontSize: 12 }}
        interval={0}
        padding={{ left: 1, right: 0 }}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: '#9CA3AF', fontSize: 12 }}
        label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: '#9CA3AF', dy: 50 }}
      />
      <Line
        type="monotone"
        dataKey="latency"
        stroke="#3868F9"
        strokeWidth={2}
        dot={false}
        fill="url(#colorGradient)"
      />
    </LineChart>
  </ResponsiveContainer>
);

const AnimatedNumber = ({ value, suffix = '', decimals = 0, startFrom }) => {
  const [displayValue, setDisplayValue] = useState(startFrom ?? 0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500;
    const steps = 100;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const startValue = startFrom ?? 0;
    const valueRange = value - startValue;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (valueRange * easedProgress);
      const factor = Math.pow(10, decimals);
      setDisplayValue(Math.round(currentValue * factor) / factor);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isVisible, decimals, startFrom]);

  return (
    <span ref={counterRef}>
      {displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, startFrom, percentage }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/[0.08]"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-white/90 font-medium">{title}</h3>
        <div className="p-2 bg-[#3868F9]/10 rounded-lg">
          <Icon className="w-5 h-5 text-[#3868F9]" />
        </div>
      </div>
      <div className="flex items-end gap-2 mb-1">
        <span className="text-2xl font-bold text-white">
          <AnimatedNumber 
            value={parseFloat(value)} 
            suffix={value.includes('/') ? `/${value.split('/')[1]}` : value.includes('%') ? '%' : ''} 
            decimals={value.includes('/') || value.includes('%') ? 0 : 1}
            startFrom={startFrom}
          />
        </span>
        <span className="text-green-400 flex items-center text-sm mb-1">
          <ArrowUpRight className="w-4 h-4" />
          {percentage}%
        </span>
      </div>
      <p className="text-white/60 text-sm">{subtitle}</p>
    </motion.div>
  );
};

const Features = () => {
  return (
    <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="inline-flex flex-col sm:flex-row items-center justify-center">
              <span className="relative bg-[linear-gradient(to_left,#6b6b6b,#848484_20%,#ffffff_50%,#848484_80%,#6b6b6b_100%)] bg-clip-text text-transparent animate-shine-fast">
                Enterprise Monitoring Made Simple
              </span>
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            dPIN provides all the tools you need to monitor, analyze, and improve your website's performance.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Performance Analysis Card */}
            <div className="w-full md:w-[30%] bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/[0.08]">
              <div>
                <h2 className="text-lg font-semibold text-white">Service Status</h2>
                <p className="text-white/70 text-sm mt-1">
                  Real-time monitoring metrics
                </p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-white/60 text-sm">Service Uptime</div>
                </div>
                <CircleProgress progress={99.9} />
              </div>
            </div>

            {/* Trend Chart Card */}
            <div className="w-full md:w-[70%] bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/[0.08]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-white">Response Time</h2>
                  <p className="text-white/70 text-sm">
                    Average response times across your websites
                  </p>
                </div>
              </div>
              <GradientChart />
            </div>
          </div>

          {/* Component Stats Section */}
          <div className="mt-4 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/[0.08]">
            <h2 className="text-lg font-semibold text-white mb-2">Service Health</h2>
            <p className="text-white/70 mb-6 text-sm">
              Key performance indicators for your monitored services.
            </p>
            <div className="space-y-6">
              {pipelineData.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="text-white/60 font-medium min-w-[32px]">{item.id}</div>
                  <div className="text-white font-medium min-w-[180px]">{item.name}</div>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1">
                      <ProgressBar progress={item.progress} color={item.color} />
                    </div>
                    <div className="text-white/90 px-3 py-1 bg-white/[0.08] rounded-md text-sm min-w-[60px] text-center">
                      {item.progress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <StatCard
              title="Average Response Time"
              value="288ms"
              subtitle="Across all monitored endpoints"
              icon={Clock}
              percentage={12}
            />
            <StatCard
              title="Alerts Sent"
              value="2,345"
              subtitle="This month via email, SMS & Slack"
              icon={BellRing}
              percentage={18}
            />
            <StatCard
              title="User Satisfaction"
              value="91%"
              subtitle="Positive feedback from users"
              icon={Smile}
              percentage={63}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;