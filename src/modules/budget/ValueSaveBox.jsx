import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import './ValueSaveBox.css';

export function ValueSaveBox({
  icon,
  label,
  value = 0,
  onSave,
  placeholder,
  footer,
}) {
  const formatVal = (v) => (v != null && v !== '' ? Number(v).toFixed(2) : '');
  const [val, setVal] = useState(formatVal(value));
  const [isFocused, setIsFocused] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setVal(formatVal(value));
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    const num = parseFloat(val) || 0;
    const formatted = num.toFixed(2);
    setVal(formatted);
    if (num !== Number(value)) {
      onSave(num);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2200);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value) setVal(String(value));
  };

  return (
    <div className="income-input-box">
      <div className="income-box-top">
        <div className="income-box-label-group">
          <div className="income-icon-pill">{icon}</div>
          <span className="income-box-label">{label}</span>
        </div>
        <span className={`auto-save-indicator ${isSaved ? 'visible' : ''}`}>
          <Check size={16} />
        </span>
      </div>

      <div className="income-field-container">
        <span className="income-currency-prefix">€</span>
        <input
          type="number"
          step="0.01"
          min="0"
          className="income-number-input"
          value={val}
          placeholder={placeholder || '0.00'}
          onChange={(e) => setVal(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {footer && <div className="income-box-footer">{footer}</div>}
    </div>
  );
}
