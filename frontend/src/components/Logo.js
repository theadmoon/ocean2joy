import React from 'react';

function Logo({ variant = 'horizontal', className = '', style = {} }) {
  if (variant === 'horizontal') {
    return (
      <img
        src="/logo-horizontal-transparent.png"
        alt="Ocean2joy"
        className={className || "h-12 w-auto"}
        style={style}
      />
    );
  }

  // Vertical variant
  return (
    <img
      src="/logo-vertical-transparent.png"
      alt="Ocean2joy"
      className={className || "h-20 w-auto"}
      style={style}
    />
  );
}

export default Logo;
