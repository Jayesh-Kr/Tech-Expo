import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Reviews data
const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'DevOps Engineer',
    content: 'dPIN has completely transformed our monitoring strategy. The decentralized approach gives us confidence that our monitoring data is tamper-proof and always available, even during major outages.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/34.jpg',
    company: 'Cipher Technologies'
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'CTO',
    content: 'The blockchain-backed immutability of monitoring records has been a game-changer for our compliance reporting. We can now prove beyond doubt that our systems meet our SLA requirements.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    company: 'CloudNative Solutions'
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    position: 'Site Reliability Engineer',
    content: 'We were skeptical about Web3 monitoring at first, but dPIN\'s decentralized network has consistently detected outages before our traditional monitoring tools even notice them.',
    rating: 4,
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    company: 'TechFlow Systems'
  },
  {
    id: 4,
    name: 'David Nakamoto',
    position: 'Blockchain Developer',
    content: 'As someone already invested in Web3 technologies, integrating dPIN was effortless. Their API documentation is excellent and the uptime improvements have been substantial.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    company: 'Decentralized Ventures'
  },
  {
    id: 5,
    name: 'Priya Sharma',
    position: 'Infrastructure Lead',
    content: 'We detected and resolved a regional outage 4 minutes faster with dPIN than our legacy monitoring system. The global node distribution provides visibility we never had before.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/64.jpg',
    company: 'GrowFast Startup'
  }
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B1F]/0 via-[#0B0B1F] to-[#0B0B1F]/0 pointer-events-none"></div>
      
      {/* Purple glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            Trusted by Web3 Pioneers
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join hundreds of innovative teams who've upgraded to our decentralized monitoring platform.
          </p>
        </motion.div>

        <div className="relative px-4">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="min-w-full px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-8"
                  >
                    <div className="md:w-1/3">
                      <div className="mb-4 relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/50">
                        <img
                          src={review.image}
                          alt={`${review.name}'s portrait`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target;
                            target.src = 'https://placehold.co/48';
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{review.name}</h3>
                      <p className="text-gray-400 mb-2">{review.position}</p>
                      <p className="text-purple-400 text-sm">{review.company}</p>
                      <div className="flex items-center mt-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="text-5xl text-purple-500/30 font-serif mb-4">"</div>
                      <blockquote className="text-xl text-gray-300 italic mb-6">
                        {review.content}
                      </blockquote>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm z-10 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm z-10 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 mx-1 rounded-full ${
                currentIndex === index ? "bg-purple-500" : "bg-gray-700"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
