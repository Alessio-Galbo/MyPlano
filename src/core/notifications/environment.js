// What this device can do with system notifications (used by the settings card and periodicSync.js).
export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function isIOS() {
  const ua = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export function isInstalledApp() {
  if (navigator.standalone === true) return true; // iOS home screen
  return ['standalone', 'fullscreen', 'window-controls-overlay', 'minimal-ui']
    .some((mode) => window.matchMedia?.(`(display-mode: ${mode})`).matches);
}

export function getPermission() {
  return isNotificationSupported() ? Notification.permission : 'unsupported';
}

// Platform line shown in the card: which kind of notifications this device gets.
// 'background' | 'installForBackground' | 'iosAddToHome' | 'iosOpenOnly' | 'openOnly' | 'bellOnly'
export function describeCapability({ periodicActive, periodicSupported }) {
  if (isIOS()) {
    if (!isInstalledApp()) return 'iosAddToHome';
    return isNotificationSupported() ? 'iosOpenOnly' : 'bellOnly';
  }
  if (!isNotificationSupported()) return 'bellOnly';
  if (periodicActive) return 'background';
  if (periodicSupported && !isInstalledApp()) return 'installForBackground';
  return 'openOnly';
}
