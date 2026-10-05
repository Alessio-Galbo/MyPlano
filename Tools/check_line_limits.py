"""Controllo del limite di righe per file: richiama lo strumento unico di AI-hub.

Uso: python Tools/check_line_limits.py [CARTELLA ...]   (default: tutto il progetto)
Regole del progetto (limite, avviso, estensioni, esclusioni) nel file `.linelimits` alla radice.
Hub: variabile d'ambiente AI_HUB_PATH (se manca: D:\\Git Repositories\\AI-hub).
Exit: 0 tutto in regola, 1 almeno un file oltre il limite.
Senza AI-hub usa Tools/line_limits_fallback.py (stesse regole, nessuna dipendenza).
Altre opzioni passate allo strumento: --json, --quiet, --limit N, --warn N.
"""

import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HUB = os.environ.get("AI_HUB_PATH") or r"D:\Git Repositories\AI-hub"
TOOL = os.path.join(HUB, "tools", "check_line_limits.py")

if __name__ == "__main__":
    if not os.path.isfile(TOOL):
        # Senza AI-hub (es. GitHub Actions): controllo autonomo con le stesse regole di `.linelimits`.
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from line_limits_fallback import main
        sys.exit(main(ROOT))
    sys.exit(subprocess.call([sys.executable, TOOL, "--root", ROOT, *sys.argv[1:]]))
