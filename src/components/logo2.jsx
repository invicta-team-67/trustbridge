import React from 'react';

const Logo = ({ size = "w-12 h-12" }) => {
  return (
    <div className={`relative flex items-center justify-center ${size}`}>
      <img 
        src="/landing-images/logo-bg2.svg" 
        alt="TrustBridge" 
        className="absolute inset-0 w-full h-full object-contain"
      />

      <span 
        className="relative z-10 font-extrabold text-white select-none"
        style={{ 
          fontSize: '75%',
          marginTop: '30%',
        }}
      >
        T
      </span>

    </div>
  );
};

export default Logo;