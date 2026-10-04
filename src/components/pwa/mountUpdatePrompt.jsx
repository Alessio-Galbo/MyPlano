import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '../../core/i18n';
import { PwaUpdatePrompt } from './PwaUpdatePrompt.jsx';
import { PwaUpdatedToast } from './PwaUpdatedToast.jsx';

// Radice React separata (non dipende da App.jsx): creata solo quando serve davvero, così la lingua letta da
// I18nProvider è quella scelta in quel momento.
let root = null;
let host = null;

function unmount() {
  root?.unmount();
  host?.remove();
  root = null;
  host = null;
}

function render(node) {
  if (!host) {
    host = document.createElement('div');
    host.id = 'pwa-update-root';
    document.body.appendChild(host);
    root = createRoot(host);
  }
  root.render(<I18nProvider>{node}</I18nProvider>);
}

export function mountUpdatePrompt(mode, onConfirm) {
  render(<PwaUpdatePrompt mode={mode} onConfirm={onConfirm} onDismiss={unmount} />);
}

export function mountUpdatedToast() {
  render(<PwaUpdatedToast onDone={unmount} />);
}
