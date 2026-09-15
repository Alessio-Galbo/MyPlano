import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './SuggestInput.css';

export function SuggestInput({
  value = '',
  onChange,
  options = [],
  placeholder = '',
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(String(value || '').toLowerCase())
  );
  const displayOptions = filtered.length > 0 ? filtered : options;

  return (
    <div className="suggest-input-container" ref={containerRef}>
      <div className="suggest-input-wrapper">
        <input
          type="text"
          className="form-input suggest-input-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          className="suggest-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {isOpen && displayOptions.length > 0 && (
        <div className="suggest-dropdown">
          {displayOptions.map((opt) => (
            <div
              key={opt.value}
              className={`suggest-item ${opt.value === value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span>{opt.label}</span>
              {typeof opt.count === 'number' && opt.count > 0 && (
                <span className="suggest-item-count">{opt.count}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
