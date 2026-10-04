import { useEffect, useRef } from 'react';

// Shared stack of open modals: only the top one reacts to Escape and traps Tab.
const stack = [];
let nextId = 0;
let savedOverflow = '';

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusable = (root) => Array.from(root.querySelectorAll(FOCUSABLE))
  .filter((el) => el.offsetParent !== null || el === document.activeElement);

export function useModalA11y(isOpen, onClose, dialogRef) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    nextId += 1;
    const id = nextId;
    if (stack.length === 0) savedOverflow = document.body.style.overflow;
    stack.push(id);
    const trigger = document.activeElement;
    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    const body = dialog?.querySelector('.modal-body');
    const first = !coarse && body ? getFocusable(body)[0] : null;
    (first || dialog)?.focus({ preventScroll: true });

    const handleKeyDown = (e) => {
      if (stack[stack.length - 1] !== id || !dialog) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = getFocusable(dialog);
      if (items.length === 0) { e.preventDefault(); dialog.focus(); return; }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active)) { e.preventDefault(); firstEl.focus(); }
      else if (e.shiftKey && (active === firstEl || active === dialog)) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && active === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const idx = stack.indexOf(id);
      if (idx !== -1) stack.splice(idx, 1);
      if (stack.length === 0) document.body.style.overflow = savedOverflow;
      if (trigger && trigger.isConnected && typeof trigger.focus === 'function') {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [isOpen, dialogRef]);
}
