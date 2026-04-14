import React from 'react';

function Logo({ variant = 'horizontal', className = '', style = {} }) {
  const defaultStyle = {
    imageRendering: 'crisp-edges',
    ...style
  };

  if (variant === 'horizontal') {
    return (
      <img
        src="/logo-horizontal.png"
        alt="Ocean2joy"
        className={className || "h-12 w-auto"}
        style={defaultStyle}
      />
    );
  }

  // Vertical variant
  return (
    <img
      src="/logo-vertical.png"
      alt="Ocean2joy"
      className={className || "h-20 w-auto"}
      style={defaultStyle}
    />
  );
}

export default Logo;
