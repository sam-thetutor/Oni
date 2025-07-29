import React from 'react';

interface CircuitBoardBackgroundProps {
  opacity?: number;
  className?: string;
}

export const CircuitBoardBackground: React.FC<CircuitBoardBackgroundProps> = ({ 
  opacity = 10, 
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ opacity: opacity / 100 }}>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(90deg, #00ff00 1px, transparent 1px),
          linear-gradient(0deg, #00ff00 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>
    </div>
  );
}; 