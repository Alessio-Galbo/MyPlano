// System (OS) notifications without a server: see notifyLifecycle.js and public/sw-notify.js.
export { startSystemNotifications } from './notifyLifecycle';
export { syncMirror, isSystemNotifyEnabled } from './scheduleMirror';
export { requestNotifyCheck, showTestNotification } from './swBridge';
export { updatePeriodicSync, isPeriodicSyncActive, isPeriodicSyncSupported } from './periodicSync';
export { isNotificationSupported, getPermission, describeCapability, isIOS, isInstalledApp } from './environment';
export { PREF_NAME, PREF_EVENT } from './notifyConstants';
