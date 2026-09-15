import React from 'react';
import './Badge.css';

export function Badge({
  children,
  variant = 'neutral',
  icon = null,
  className = '',
}) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
