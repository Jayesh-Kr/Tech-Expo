import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="relative h-6 w-6 flex items-center justify-center">
        <img 
          src="/transparent-logo.png" 
          alt="dPIN Logo" 
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-white font-bold text-xl">PIN</span>
    </div>
  );
};

export default Logo;
