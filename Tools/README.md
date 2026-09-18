# Registro Strumenti & Script di Utilità (/Tools)

Questo registro documenta gli script di automazione e verifica presenti nella cartella `/Tools`.

| File | Scopo | Utilizzo |
| :--- | :--- | :--- |
| `check_line_limits.py` | Esegue la scansione di tutti i file del repository (`.py`, `.js`, `.jsx`, `.css`, `.html`) verificando che nessuno superi il limite invalicabile delle 100 righe di codice. | `python Tools/check_line_limits.py` |
| `check_i18n_keys.py` | Esegue l'audit statico di tutte le chiamate `t('...')` in JSX e JS, garantendo che ogni singola chiave esista e si risolva sia in `it` che in `en`. | `python Tools/check_i18n_keys.py` |
| `test_logic.py` | Esegue i test unitari automatizzati sulle formule del bilancio (Sinking Funds, quota mensile, moltiplicatori di frequenza) e sulla completezza speculare dei dizionari i18n (`it.json` e `en.json`). | `python Tools/test_logic.py` |
| `launch_with_qr.py` | Rileva l'indirizzo IP locale (anche sotto hotspot dati mobili), genera e stampa un QR Code ASCII su terminale per collegarsi da smartphone e avvia il server Vite in ascolto su rete locale. | `python Tools/launch_with_qr.py` |

