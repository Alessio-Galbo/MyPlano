import { useRef } from 'react';

const DISMISS_DISTANCE = 70;

// Swipe a toast sideways (touch or pen) to dismiss it. The offset goes to the CSS variable
// --toast-dx (see ToastMobile.css); `onHold(true|false)` pauses the auto-close while dragging.
export function useToastSwipe(onDismiss, onHold) {
  const ref = useRef(null);
  const start = useRef(null);

  const setOffset = (dx) => ref.current?.style.setProperty('--toast-dx', `${dx}px`);

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' || e.target.closest('button')) return;
    start.current = { x: e.clientX, dx: 0 };
    ref.current?.classList.add('toast-dragging');
    onHold(true);
  };
  const onPointerMove = (e) => {
    if (!start.current) return;
    start.current.dx = e.clientX - start.current.x;
    setOffset(start.current.dx);
  };
  const finish = () => {
    if (!start.current) return;
    const { dx } = start.current;
    start.current = null;
    ref.current?.classList.remove('toast-dragging');
    if (Math.abs(dx) >= DISMISS_DISTANCE) {
      onDismiss();
      return;
    }
    setOffset(0);
    onHold(false);
  };

  return [ref, { onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish }];
}
