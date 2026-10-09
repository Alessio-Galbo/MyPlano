import sys
import socket
import subprocess
import os

# IP LAN + QR: strumento condiviso AI-hub (tools/lan_qr.py), cartella da AI_HUB_PATH
sys.path.append(os.path.join(os.environ.get('AI_HUB_PATH') or r'D:\Git Repositories\AI-hub', 'tools'))
try:
    from lan_qr import lan_ip, qr_text  # noqa: E402
except ImportError:  # AI-hub assente (progetto clonato altrove): IP della rotta verso internet, niente QR
    def lan_ip():
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            try:
                s.connect(('8.8.8.8', 80))
                return s.getsockname()[0]
            except OSError:
                return '127.0.0.1'

    def qr_text(url):
        raise ImportError('AI-hub non trovato')

def get_local_ip():
    return lan_ip()

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    local_ip = get_local_ip()
    port = 5173
    network_url = f"http://{local_ip}:{port}"
    local_url = f"http://localhost:{port}"

    print("\n" + "=" * 54)
    print("        🚀 MyPlano - Server Locale & Mobile")
    print("=" * 54)
    print(f"  💻 PC Locale:    {local_url}")
    print(f"  📱 Smartphone:   {network_url}")
    print("=" * 54)

    try:
        qr = qr_text(network_url)
    except ImportError:
        qr = None
    if qr:
        print("\n  Inquadra il QR Code con lo smartphone (stesso hotspot):")
        print(qr, end="")
    else:
        print("\n  (QR non disponibile: serve AI-hub e il modulo qrcode; apri il link smartphone)")

    print("=" * 54)
    print("  Avvio del server Vite in corso...\n")

    node_dir = os.path.expandvars(r"%LOCALAPPDATA%\Programs\nodejs")
    if os.path.exists(node_dir) and node_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] = f"{node_dir};" + os.environ.get("PATH", "")

    subprocess.run(
        ["npm.cmd", "run", "dev", "--", "--host", "0.0.0.0", "--port", str(port)],
        shell=True
    )

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Chiusura server MyPlano...")
        sys.exit(0)
