"""Controllo autonomo del limite di righe, usato da check_line_limits.py quando AI-hub non c'è
(es. GitHub Actions). Legge le stesse regole da `.linelimits` (limit, warn, include).
Exit: 0 tutto in regola, 1 almeno un file oltre il limite.
"""

import fnmatch
import os
import sys

EXCLUDED_DIRS = {"node_modules", ".git", "dist", "build", "vendor", "dev-dist"}
EXCLUDED_FILES = ["*.min.*", "package-lock.json", "yarn.lock", "pnpm-lock.yaml"]


def read_config(root):
    cfg = {"limit": 100, "warn": 90, "include": ["*.py", "*.js", "*.jsx", "*.css", "*.html"]}
    path = os.path.join(root, ".linelimits")
    if not os.path.isfile(path):
        return cfg
    with open(path, encoding="utf-8") as fh:
        for raw in fh:
            line = raw.split("#", 1)[0].strip()
            if "=" not in line:
                continue
            key, value = (part.strip() for part in line.split("=", 1))
            if key in ("limit", "warn"):
                cfg[key] = int(value)
            elif key == "include":
                cfg["include"] = value.split()
    return cfg


def scan(root, cfg):
    over, warned, total = [], [], 0
    for folder, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for name in files:
            if not any(fnmatch.fnmatch(name, p) for p in cfg["include"]):
                continue
            if any(fnmatch.fnmatch(name, p) for p in EXCLUDED_FILES):
                continue
            path = os.path.join(folder, name)
            with open(path, encoding="utf-8", errors="ignore") as fh:
                count = sum(1 for _ in fh)
            total += 1
            rel = os.path.relpath(path, root)
            if count > cfg["limit"]:
                over.append((rel, count))
            elif count >= cfg["warn"]:
                warned.append((rel, count))
    return total, over, warned


def main(root):
    cfg = read_config(root)
    total, over, warned = scan(root, cfg)
    for rel, count in over:
        print(f"  OLTRE {cfg['limit']}: {rel} ({count} righe)")
    print(f"{total} file controllati: {len(over)} oltre {cfg['limit']} righe, "
          f"{len(warned)} in avviso (>= {cfg['warn']}).")
    return 1 if over else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else os.getcwd()))
