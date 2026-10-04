import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '../../core/i18n';
import { PwaUpdatePrompt } from './PwaUpdatePrompt.jsx';

// Radice React separata (non dipende da App.jsx): creata solo quando c'è davvero un aggiornamento, così la
// lingua letta da I18nProvider è quella scelta in quel momento.
let root = null;
let host = null;

function unmount() {
  root?.unmount();
  host?.remove();
  root = null;
  host = null;
}

export function mountUpdatePrompt(mode, onConfirm) {
  if (!host) {
    host = document.createElement('div');
    host.id = 'pwa-update-root';
    document.body.appendChild(host);
    root = createRoot(host);
  }
  root.render(
    <I18nProvider>
      <PwaUpdatePrompt mode={mode} onConfirm={onConfirm} onDismiss={unmount} />
    </I18nProvider>,
  );
}
