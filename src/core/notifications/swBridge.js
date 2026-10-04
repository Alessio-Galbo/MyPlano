// Page <-> Service Worker: ask the SW to check and notify (same code as the background check), test
// notification, "open the notification center" requests coming from a notification click.
import { MSG_CHECK, MSG_OPEN, OPEN_PARAM } from './notifyConstants';

const READY_TIMEOUT_MS = 10000;

function readyRegistration() {
  if (!('serviceWorker' in navigator)) return Promise.resolve(null);
  const timeout = new Promise((resolve) => { setTimeout(() => resolve(null), READY_TIMEOUT_MS); });
  return Promise.race([navigator.serviceWorker.ready, timeout]).catch(() => null);
}

// Resolves { shown } (false without a Service Worker: dev server, unsupported browser).
export async function requestNotifyCheck() {
  const reg = await readyRegistration();
  if (!reg?.active) return { shown: false };
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve({ shown: false }), READY_TIMEOUT_MS);
    channel.port1.onmessage = (e) => { clearTimeout(timer); resolve(e.data || { shown: false }); };
    reg.active.postMessage({ type: MSG_CHECK }, [channel.port2]);
  });
}

export async function showTestNotification(title, body) {
  const reg = await readyRegistration();
  const options = { body, tag: 'myplano-test', icon: new URL('pwa-192.png', document.baseURI).href };
  if (reg) return reg.showNotification(title, { ...options, data: { url: reg.scope } });
  return new Notification(title, options); // no SW (dev server): desktop browsers only
}

// Calls `open` when a notification was clicked (message from the SW or ?notifications=open on a new window).
export function listenOpenRequests(open) {
  const url = new URL(window.location.href);
  if (url.searchParams.get(OPEN_PARAM) === 'open') {
    url.searchParams.delete(OPEN_PARAM);
    window.history.replaceState(window.history.state, '', url.href);
    open();
  }
  navigator.serviceWorker?.addEventListener('message', (e) => {
    if (e.data?.type === MSG_OPEN) open();
  });
}
