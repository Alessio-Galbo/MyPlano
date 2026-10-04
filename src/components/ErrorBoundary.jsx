import { Component } from 'react';
import { translations } from '../core/i18n/translations';
import { UI_KEYS, isMyPlanoKey } from '../core/storage/storageKeys';
import { readRaw } from '../core/storage/safeStorage';
import './ErrorBoundary.css';

// Works outside the I18nProvider (it may be the part that crashed).
function t(path) {
  const lang = translations[readRaw(UI_KEYS.LANGUAGE)] ? readRaw(UI_KEYS.LANGUAGE) : 'it';
  const pick = (root) => path.split('.').reduce((node, k) => (node == null ? node : node[k]), root);
  return pick(translations[lang]) ?? pick(translations.it) ?? path;
}

// Every myplano_* key as stored (raw strings, nothing parsed or changed).
function downloadRawData() {
  const dump = {};
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (isMyPlanoKey(key)) dump[key] = localStorage.getItem(key);
    }
  } catch (error) {
    dump._error = String(error);
  }
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `myplano-raw-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[MyPlano] UI crash', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="error-boundary" role="alert">
        <div className="error-boundary__card">
          <h1 className="error-boundary__title">{t('common.errorBoundary.title')}</h1>
          <p className="error-boundary__text">{t('common.errorBoundary.message')}</p>
          <p className="error-boundary__text">{t('common.errorBoundary.dataSafe')}</p>
          <pre className="error-boundary__detail">{String(error?.message || error)}</pre>
          <div className="error-boundary__actions">
            <button type="button" className="error-boundary__btn" onClick={downloadRawData}>
              {t('common.errorBoundary.download')}
            </button>
            <button type="button" className="error-boundary__btn error-boundary__btn--primary"
              onClick={() => window.location.reload()}>
              {t('common.errorBoundary.reload')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}
