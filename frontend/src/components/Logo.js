import React from 'react';

function Logo({ variant = 'horizontal', className = '', style = {} }) {
  if (variant === 'horizontal') {
    return (
      <img
        src="/logo-horizontal.png"
        alt="Ocean2joy"
        className={className || "h-12 w-auto"}
        style={{ ...style }}
      />
    );
  }

  return (
    <img
      src="/logo-vertical.png"
      alt="Ocean2joy"
      className={className || "h-32 w-auto"}
      style={{ ...style }}
    />
  );
}

export default Logo;
