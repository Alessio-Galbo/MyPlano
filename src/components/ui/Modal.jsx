import React, { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '../../core/i18n';
import { useModalA11y } from './useModalA11y';
import './Modal.css';

export function Modal({ isOpen, onClose, title, subtitle, className = '', children }) {
  const { t } = useI18n();
  const titleId = useId();
  const dialogRef = useRef(null);
  useModalA11y(isOpen, onClose, dialogRef);

  if (!isOpen) return null;

  return createPortal(
    <div className={`modal-backdrop ${className ? `${className}-backdrop` : ''}`} onClick={onClose}>
      <div
        ref={dialogRef}
        className={`modal-content ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title" id={titleId}>{title}</h3>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label={t('common.a11y.closeDialog')}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
