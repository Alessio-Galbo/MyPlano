import sys
import socket
import subprocess
import os

try:
    import qrcode
except ImportError:
    qrcode = None

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return '127.0.0.1'

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

    if qrcode:
        print("\n  Inquadra il QR Code con lo smartphone (stesso hotspot):")
        qr = qrcode.QRCode(border=1)
        qr.add_data(network_url)
        qr.make(fit=True)
        qr.print_ascii(invert=True)
    else:
        print("\n  (Modulo qrcode non disponibile, apri il link smartphone)")

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
