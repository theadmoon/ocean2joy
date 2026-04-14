import React from 'react';

function Logo({ variant = 'horizontal', className = '', style = {} }) {
  const defaultStyle = {
    objectFit: 'contain',
    display: 'block',
    ...style
  };

  if (variant === 'horizontal') {
    return (
      <img
        src="/logo-horizontal.svg"
        alt="Ocean2joy"
        className={className || "h-12 w-auto"}
        style={defaultStyle}
      />
    );
  }

  return (
    <img
      src="/logo-vertical.svg"
      alt="Ocean2joy"
      className={className || "max-h-32 w-auto"}
      style={defaultStyle}
    />
  );
}

export default Logo;
