import React from 'react';

// Import the logo
import logoPath from '@assets/WhatsApp Image 2025-04-11 at 16.30.17_f7638dc9.jpg';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  // Determine size classes
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
  };

  // Use the imported logo image
  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <img
        src={logoPath}
        alt="Blinkeach Logo"
        className="h-full object-contain"
      />
    </div>
  );
};

// SVG version as fallback or alternative
export const LogoSvg: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-10',
    large: 'h-12',
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#F7C331" />
        
        {/* "be" logo mark */}
        <path d="M70 50C70 47 72 45 75 45H95C98 45 100 47 100 50V80C100 83 98 85 95 85H70V50Z" fill="#E53935" />
        <path d="M70 85H95C98 85 100 87 100 90V120C100 123 98 125 95 125H70V85Z" fill="#E53935" />
        <path d="M100 70C115 70 130 85 130 100C130 115 115 130 100 130C85 130 70 115 70 100C70 85 85 70 100 70Z" fill="#1F51A9" />
        <path d="M100 80C110 80 120 90 120 100C120 110 110 120 100 120V80Z" fill="#F7C331" />
        
        {/* Text "blinkeach" */}
        <text x="30" y="165" fontSize="24" fontWeight="bold" fontFamily="Arial, sans-serif">
          <tspan fill="#E53935">blink</tspan><tspan fill="#1F51A9">each</tspan>
        </text>
      </svg>
    </div>
  );
};

export default Logo;
