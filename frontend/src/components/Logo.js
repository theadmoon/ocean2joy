import React from 'react';

function Logo({ variant = 'horizontal', className = '' }) {
  if (variant === 'horizontal') {
    return (
      <svg
        viewBox="0 0 300 60"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2dd4bf', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Wave + Film Strip Icon */}
        <g transform="translate(0, 10)">
          {/* Film strip perforations (left) */}
          <rect x="2" y="8" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="2" y="14" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="2" y="20" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="2" y="26" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="2" y="32" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          
          {/* Wave path */}
          <path
            d="M 8 20 Q 12 12, 16 20 T 24 20 Q 28 28, 32 20 Q 36 12, 40 20"
            fill="none"
            stroke="url(#oceanGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          
          {/* Film strip perforations (right) */}
          <rect x="43" y="8" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="43" y="14" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="43" y="20" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="43" y="26" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          <rect x="43" y="32" width="3" height="3" fill="url(#oceanGradient)" rx="0.5" />
          
          {/* Film strip frames */}
          <rect x="6" y="7" width="40" height="8" fill="none" stroke="url(#oceanGradient)" strokeWidth="1.5" opacity="0.3" rx="1" />
          <rect x="6" y="27" width="40" height="8" fill="none" stroke="url(#oceanGradient)" strokeWidth="1.5" opacity="0.3" rx="1" />
        </g>
        
        {/* Text */}
        <text
          x="60"
          y="38"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="url(#oceanGradient)"
          letterSpacing="-0.5"
        >
          Ocean2joy
        </text>
      </svg>
    );
  }

  // Vertical variant
  return (
    <svg
      viewBox="0 0 140 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="oceanGradientV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#38bdf8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#2dd4bf', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Wave + Film Strip Icon (larger, centered) */}
      <g transform="translate(20, 10)">
        {/* Film strip perforations (left) */}
        <rect x="4" y="16" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="4" y="28" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="4" y="40" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="4" y="52" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="4" y="64" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        
        {/* Wave path (larger) */}
        <path
          d="M 16 40 Q 24 24, 32 40 T 48 40 Q 56 56, 64 40 Q 72 24, 80 40"
          fill="none"
          stroke="url(#oceanGradientV)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        
        {/* Film strip perforations (right) */}
        <rect x="86" y="16" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="86" y="28" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="86" y="40" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="86" y="52" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        <rect x="86" y="64" width="6" height="6" fill="url(#oceanGradientV)" rx="1" />
        
        {/* Film strip frames */}
        <rect x="12" y="14" width="80" height="16" fill="none" stroke="url(#oceanGradientV)" strokeWidth="3" opacity="0.3" rx="2" />
        <rect x="12" y="54" width="80" height="16" fill="none" stroke="url(#oceanGradientV)" strokeWidth="3" opacity="0.3" rx="2" />
      </g>
      
      {/* Text (centered below icon) */}
      <text
        x="70"
        y="120"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="22"
        fontWeight="700"
        fill="url(#oceanGradientV)"
        textAnchor="middle"
        letterSpacing="-0.5"
      >
        Ocean2joy
      </text>
    </svg>
  );
}

export default Logo;
