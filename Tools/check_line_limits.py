import os
import sys

TARGET_EXTENSIONS = {'.py', '.js', '.jsx', '.css', '.html'}
EXCLUDED_DIRS = {'node_modules', '.git', 'dist', 'build'}
LINE_LIMIT = 100

def check_files(root_dir):
    violations = []
    total_checked = 0

    for root, dirs, files in os.walk(root_dir):
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        for f in files:
            ext = os.path.splitext(f)[1]
            if ext in TARGET_EXTENSIONS:
                file_path = os.path.join(root, f)
                total_checked += 1
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as fp:
                        lines = fp.readlines()
                        count = len(lines)
                        if count > LINE_LIMIT:
                            violations.append((file_path, count))
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    print(f"Total files checked: {total_checked}")
    if violations:
        print(f"Found {len(violations)} files exceeding {LINE_LIMIT} lines:")
        for path, count in violations:
            print(f"  - {path}: {count} lines")
        return False
    else:
        print(f"All {total_checked} files are strictly <= {LINE_LIMIT} lines! PASSED.")
        return True

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else '.'
    success = check_files(target)
    sys.exit(0 if success else 1)
