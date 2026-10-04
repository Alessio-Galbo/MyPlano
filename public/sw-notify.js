// MyPlano - system notifications inside the Service Worker (imported by the Workbox sw.js, see vite.pwa.js).
// The SW cannot read localStorage: the page writes a "mirror" of the upcoming deadlines in IndexedDB
// (src/core/notifications/scheduleMirror.js) and this file only reads it, summarizes it with
// MyPlanoNotifyCore (sw-notify-core.js) and shows ONE notification. Names shared with
// src/core/notifications/notifyConstants.js: keep them in sync.
/* global MyPlanoNotifyCore */
(function () {
  var DB_NAME = 'myplano_notify';
  var STORE = 'kv';
  var SYNC_TAG = 'myplano-deadlines';
  var MSG_CHECK = 'myplano-notify-check';
  var MSG_OPEN = 'myplano-open-notifications';
  var NOTIF_TAG = 'myplano-deadlines';

  function openDb() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function run(mode, fn) {
    return openDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE, mode);
        var out = fn(tx.objectStore(STORE));
        tx.oncomplete = function () { db.close(); resolve(out && out.result); };
        tx.onerror = function () { db.close(); reject(tx.error); };
      });
    });
  }
  var get = function (key) { return run('readonly', function (s) { return s.get(key); }); };
  var put = function (key, val) { return run('readwrite', function (s) { s.put(val, key); }); };

  function granted() {
    try { return self.Notification && self.Notification.permission === 'granted'; } catch { return false; }
  }

  // Shows the summary of what was not notified yet; returns the summary (or null).
  function check() {
    if (!granted()) return Promise.resolve(null);
    var today = MyPlanoNotifyCore.localToday();
    return Promise.all([get('mirror'), get('log')]).then(function (r) {
      var log = r[1] || {};
      var sum = MyPlanoNotifyCore.summarize(r[0], log, today);
      if (!sum) return null;
      var scope = self.registration.scope;
      return self.registration.showNotification(sum.title, {
        body: sum.body,
        tag: NOTIF_TAG,
        renotify: true,
        icon: new URL('pwa-192.png', scope).href,
        badge: new URL('pwa-192.png', scope).href,
        data: { url: scope, kind: 'deadlines' },
      }).then(function () { return put('log', MyPlanoNotifyCore.markNotified(log, sum.keys, today)); })
        .then(function () { return sum; });
    }).catch(function () { return null; });
  }

  self.addEventListener('periodicsync', function (event) {
    if (event.tag === SYNC_TAG) event.waitUntil(check());
  });

  self.addEventListener('message', function (event) {
    var data = event.data || {};
    if (data.type !== MSG_CHECK) return;
    var port = event.ports && event.ports[0];
    event.waitUntil(check().then(function (sum) { if (port) port.postMessage({ shown: Boolean(sum) }); }));
  });

  // Click: bring an open MyPlano window to the front on the notification center, or open a new one.
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    var scope = self.registration.scope;
    event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      var mine = list.filter(function (c) { return c.url.indexOf(scope) === 0; });
      if (mine.length) {
        mine[0].postMessage({ type: MSG_OPEN });
        return mine[0].focus();
      }
      return self.clients.openWindow(scope + '?notifications=open');
    }));
  });
})();
