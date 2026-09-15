import React from 'react';
import './Toggle.css';

export function Toggle({
  checked,
  onChange,
  label = null,
  disabled = false,
  id = null,
}) {
  const inputId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <label htmlFor={inputId} className="toggle-wrapper">
      <input
        type="checkbox"
        id={inputId}
        className="toggle-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}
