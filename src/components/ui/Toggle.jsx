import React from 'react';
import './Toggle.css';

export function Toggle({
  checked = false,
  onChange,
  label = null,
  disabled = false,
  id = null,
}) {
  return (
    <label className={`toggle-wrapper ${disabled ? 'toggle-disabled' : ''}`}>
      <input
        type="checkbox"
        id={id || undefined}
        className="toggle-input"
        checked={Boolean(checked)}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}
