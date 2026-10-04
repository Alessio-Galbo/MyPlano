import sys
import os
import re
import json

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

it_translations = {
    'common': load_json('src/core/i18n/locales/it/common.json'),
    'documents': load_json('src/core/i18n/locales/it/documents.json'),
    'expenses': load_json('src/core/i18n/locales/it/expenses.json'),
    'budget': load_json('src/core/i18n/locales/it/budget.json'),
}

en_translations = {
    'common': load_json('src/core/i18n/locales/en/common.json'),
    'documents': load_json('src/core/i18n/locales/en/documents.json'),
    'expenses': load_json('src/core/i18n/locales/en/expenses.json'),
    'budget': load_json('src/core/i18n/locales/en/budget.json'),
}

def resolve_key(trans, key_path):
    parts = key_path.split('.')
    curr = trans
    for p in parts:
        if not isinstance(curr, dict) or p not in curr:
            return False
        curr = curr[p]
    return True

pattern = re.compile(r"(?<![a-zA-Z0-9_\.])t\(\s*['\"]([a-zA-Z0-9_\.]+)['\"]\s*\)")

missing_it = []
missing_en = []
checked_keys = set()

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.jsx', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            for match in pattern.finditer(content):
                key = match.group(1)
                checked_keys.add(key)
                if not resolve_key(it_translations, key):
                    missing_it.append((filepath, key))
                if not resolve_key(en_translations, key):
                    missing_en.append((filepath, key))

print(f"Total unique t() keys checked: {len(checked_keys)}")
if missing_it:
    print(f"MISSING IN IT ({len(missing_it)}):")
    for f, k in sorted(set(missing_it)):
        print(f"  {f} -> {k}")
if missing_en:
    print(f"MISSING IN EN ({len(missing_en)}):")
    for f, k in sorted(set(missing_en)):
        print(f"  {f} -> {k}")

if not missing_it and not missing_en:
    print("ALL KEYS RESOLVE PERFECTLY IN BOTH IT AND EN!")
else:
    sys.exit(1)
