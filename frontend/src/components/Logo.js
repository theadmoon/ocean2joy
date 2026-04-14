import React from 'react';

function Logo({ variant = 'horizontal', className = '', style = {} }) {
  if (variant === 'horizontal') {
    return (
      <img
        src="/logo-horizontal-clean.png"
        alt="Ocean2joy"
        className={className || "h-10 w-auto"}
        style={{ imageRendering: 'crisp-edges', ...style }}
      />
    );
  }

  return (
    <img
      src="/logo-vertical-clean.png"
      alt="Ocean2joy"
      className={className || "h-32 w-auto"}
      style={{ imageRendering: 'crisp-edges', ...style }}
    />
  );
}

export default Logo;
