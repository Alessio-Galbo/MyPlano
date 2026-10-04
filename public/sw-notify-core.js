// MyPlano - pure core of the system notifications (no DOM, no IndexedDB): shared by the Service Worker
// (importScripts in vite.pwa.js) and by the node test Tools/test_system_notifications.mjs (vm).
// Mirror = list of upcoming occurrences already computed by the page (src/core/notifications/buildMirror.js)
// with texts already translated. Log = { "<occurrenceId>#<stage>": "<day notified>" }.
// Stages: "soon" (inside the notice window), "today", "overdue": each one is notified once, so an
// occurrence produces at most one notification per day and at most three in total.
(function (root) {
  var DAY = 86400000;
  var LOG_KEEP_DAYS = 60;
  var OVERDUE_DAYS = 60;
  var MAX_LINES = 4;

  function utc(iso) {
    var p = String(iso).split('-');
    return Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }
  function diffDays(from, to) { return Math.round((utc(to) - utc(from)) / DAY); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function localToday(now) {
    var d = now || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function fill(tpl, vars) {
    return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? String(vars[k]) : m; });
  }

  function stageOf(diff, soonDays) {
    if (diff < -OVERDUE_DAYS) return null;
    if (diff < 0) return 'overdue';
    if (diff === 0) return 'today';
    return diff <= soonDays ? 'soon' : null;
  }

  function lineOf(item, texts) {
    var vars = { title: item.title, days: Math.abs(item.diff) };
    if (item.stage === 'today') return fill(texts.today, vars);
    if (item.stage === 'overdue') return fill(texts.overdue, vars);
    return fill(item.diff === 1 ? texts.tomorrow : texts.soon, vars);
  }

  // Returns { title, body, keys } for the occurrences not notified yet in their current stage, or null.
  function summarize(mirror, log, today) {
    if (!mirror || !mirror.enabled || mirror.muted || !Array.isArray(mirror.items)) return null;
    var seen = log || {};
    var fresh = [];
    mirror.items.forEach(function (it) {
      if (!it || !it.id || !it.date) return;
      var diff = diffDays(today, it.date);
      var stage = stageOf(diff, Number(it.soon) || 0);
      var key = it.id + '#' + stage;
      if (stage && !seen[key]) fresh.push({ id: it.id, title: it.title, date: it.date, diff: diff, stage: stage, key: key });
    });
    if (!fresh.length) return null;
    fresh.sort(function (a, b) { return a.date === b.date ? String(a.title).localeCompare(String(b.title)) : (a.date < b.date ? -1 : 1); });
    var texts = mirror.texts || {};
    var lines = fresh.slice(0, MAX_LINES).map(function (it) { return lineOf(it, texts); });
    if (fresh.length > MAX_LINES) lines.push(fill(texts.more, { count: fresh.length - MAX_LINES }));
    var title = fresh.length === 1 ? fill(texts.titleOne, {}) : fill(texts.titleMany, { count: fresh.length });
    return { title: title, body: lines.join(texts.sep || ', '), keys: fresh.map(function (it) { return it.key; }) };
  }

  // New log: previous entries younger than 60 days + the keys just notified today.
  function markNotified(log, keys, today) {
    var out = {};
    Object.keys(log || {}).forEach(function (k) {
      if (diffDays(log[k], today) <= LOG_KEEP_DAYS) out[k] = log[k];
    });
    (keys || []).forEach(function (k) { out[k] = today; });
    return out;
  }

  root.MyPlanoNotifyCore = { summarize: summarize, markNotified: markNotified, localToday: localToday, diffDays: diffDays };
})(typeof self !== 'undefined' ? self : globalThis);
