// Shared setup of the dependency-free Tools/test_*.mjs runners: Vite-style extensionless imports, loader, TZ re-runs.
import { registerHooks } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Vite-style extensionless imports -> try '.js'.
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) {
      if (spec.startsWith('.') && !/\.[cm]?js$/.test(spec)) return next(`${spec}.js`, ctx);
      throw e;
    }
  },
});

// load(p): dynamic import of `p` relative to the `base` URL (e.g. new URL('../src/', import.meta.url)).
export const loaderFor = (base) => (p) => import(pathToFileURL(fileURLToPath(new URL(p, base))).href);

// Re-runs the calling script once in Rome and once in New York TZ, then exits with the combined status.
// Inside the child run (MYPLANO_TZ_CHILD set) it returns and the tests run normally.
export function runInTimezones(scriptUrl) {
  if (process.env.MYPLANO_TZ_CHILD) return;
  let failed = false;
  for (const tz of ['Europe/Rome', 'America/New_York']) {
    const r = spawnSync(process.execPath, [fileURLToPath(scriptUrl)], {
      env: { ...process.env, TZ: tz, MYPLANO_TZ_CHILD: '1' }, stdio: 'inherit',
    });
    failed = failed || r.status !== 0;
  }
  process.exit(failed ? 1 : 0);
}
