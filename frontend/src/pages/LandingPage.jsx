import React from 'react'
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import Comparison from '../components/Comparison.jsx';
import Reviews from '../components/Reviews.jsx';
import MoreFeatures from '../components/MoreFeatures.jsx';
import Supercharge from '../components/Supercharge.jsx';


const LandingPage = () => {
  return (
    <>
        <Hero />
        <Features />
        <HowItWorks />
        <Comparison />
        <Reviews />
        <MoreFeatures />
        <Supercharge />
    </>
  )
}

export default LandingPage