import React from 'react';

interface FeatureLoadingIndicatorProps {
  icon: React.ReactNode;
  color?: string;
  size?: number;
}

export function FeatureLoadingIndicator({ 
  icon, 
  color = '#22c55e', // Default green color
  size = 40 
}: FeatureLoadingIndicatorProps) {
  return (
    <div 
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Spinning gradient ring */}
      <div 
        className="absolute inset-0 animate-spin"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${color} 360deg)`,
          borderRadius: '50%',
          WebkitMask: 'radial-gradient(transparent 55%, black 55%)',
          mask: 'radial-gradient(transparent 55%, black 55%)',
        }}
      />
      
      {/* Icon container */}
      <div className="relative z-10 bg-white rounded-full p-1.5">
        {icon}
      </div>
    </div>
  );
}