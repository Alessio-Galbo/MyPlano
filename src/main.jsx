import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { I18nProvider } from './core/i18n';
import { AppProvider } from './core/state';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { runMigrations } from './core/storage/migrations';

// Upgrade stored data once, before any state reads it.
try {
  runMigrations();
} catch (error) {
  console.error('[MyPlano] migrations failed', error);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>,
);
