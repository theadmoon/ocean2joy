import React from 'react';

function Logo({ variant = 'horizontal', className = '', style = {} }) {
  if (variant === 'horizontal') {
    return (
      <img
        src="/logo-horizontal.png"
        alt="Ocean2joy"
        className={className}
        style={style}
      />
    );
  }

  // Vertical variant
  return (
    <img
      src="/logo-vertical.png"
      alt="Ocean2joy"
      className={className}
      style={style}
    />
  );
}

export default Logo;
