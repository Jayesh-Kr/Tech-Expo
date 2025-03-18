import React from 'react';

/**
 * A container component that provides consistent spacing and padding for all pages
 * with proper clearance for the fixed navbar.
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen pt-28 px-4 sm:px-6 lg:px-8 pb-20 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 