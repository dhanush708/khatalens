#!/usr/bin/env python3
"""
KhataLens Master Runner (run.py)
Single command to launch the full application (Frontend + Backend + AI Pipelines).

Usage:
  python run.py          # Runs single-port full-stack server at http://localhost:8000
  python run.py --dev    # Runs FastAPI (port 8000) and Vite hot-reload (port 5173)
"""

import argparse
import os
import subprocess
import sys
import time
import webbrowser
from pathlib import Path

# Safe encoding for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT_DIR / "frontend"
FRONTEND_DIST = FRONTEND_DIR / "dist"

GREEN = "\033[92m"
AMBER = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


def print_banner():
    banner = f"""{CYAN}{BOLD}
    ===============================================================
       _  ___          _        _                     
      | |/ / |        | |      | |                    
      | ' /| |__   __ _| |_ __ _| |     ___ _ __  ___ 
      |  < | '_ \\ / _` | __/ _` | |    / _ \\ '_ \\/ __|
      | . \\| | | | (_| | || (_| | |___|  __/ | | \\__ \\
      |_|\\_\\_| |_|\\__,_|\\__\\__,_|______\\___|_| |_|___/
                         KhataLens (Khata Lens)
      AI-Powered Handwritten Ledger Digitization for Bharat
    ==============================================================={RESET}
    """
    print(banner)


def check_python_dependencies():
    print(f"[{CYAN}INFO{RESET}] Checking Python dependencies...")
    required = ["fastapi", "uvicorn", "pydantic", "boto3", "PIL"]
    missing = []
    for pkg in required:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)

    if missing:
        print(f"[{AMBER}WARN{RESET}] Missing packages: {', '.join(missing)}. Installing from backend/requirements.txt...")
        cmd = [sys.executable, "-m", "pip", "install", "-r", str(ROOT_DIR / "backend" / "requirements.txt")]
        subprocess.check_call(cmd)
    print(f"[{GREEN}OK{RESET}] All Python dependencies verified.")


def check_aws_status():
    print(f"[{CYAN}INFO{RESET}] Probing AWS credentials & Amazon Bedrock availability...")
    try:
        import boto3
        session = boto3.Session()
        creds = session.get_credentials()
        if creds and creds.access_key:
            print(f"[{GREEN}OK{RESET}] AWS Credentials detected! Live Bedrock Converse API vision mode active.")
            return True
    except Exception:
        pass
    print(f"[{AMBER}NOTE{RESET}] AWS credentials not configured. Running in Demo Mode with 5 synthetic datasets.")
    return False


def build_frontend_if_needed():
    if not FRONTEND_DIST.exists():
        print(f"[{AMBER}INFO{RESET}] Frontend build not found at {FRONTEND_DIST}. Building now...")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        # Check if node_modules exists
        if not (FRONTEND_DIR / "node_modules").exists():
            print(f"[{CYAN}INFO{RESET}] Installing frontend dependencies (npm install)...")
            subprocess.check_call([npm_cmd, "install"], cwd=str(FRONTEND_DIR), shell=(sys.platform == "win32"))
        print(f"[{CYAN}INFO{RESET}] Compiling React + Tailwind bundle (npm run build)...")
        subprocess.check_call([npm_cmd, "run", "build"], cwd=str(FRONTEND_DIR), shell=(sys.platform == "win32"))
        print(f"[{GREEN}OK{RESET}] Frontend production build ready.")
    else:
        print(f"[{GREEN}OK{RESET}] Found production frontend build in {FRONTEND_DIST}.")


def run_full_stack(port=8000):
    """Runs FastAPI serving both backend API and frontend static assets on a single port."""
    import uvicorn
    url = f"http://localhost:{port}"

    print(f"\n{BOLD}---------------------------------------------------------------{RESET}")
    print(f"🚀 {GREEN}{BOLD}KhataLens is LIVE!{RESET}")
    print(f"   Access Web Application at: {CYAN}{BOLD}{url}{RESET}")
    print(f"   Backend API & Swagger Docs: {CYAN}{url}/docs{RESET}")
    print(f"   Press {AMBER}Ctrl + C{RESET} to stop the server.")
    print(f"{BOLD}---------------------------------------------------------------{RESET}\n")

    # Open browser automatically after a short delay
    def open_browser():
        time.sleep(1.2)
        try:
            webbrowser.open(url)
        except Exception:
            pass

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run("backend.local_server:app", host="0.0.0.0", port=port, log_level="info")


def run_dev_mode():
    """Runs backend and frontend independently with hot reloading."""
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    print(f"[{CYAN}DEV MODE{RESET}] Starting FastAPI backend on port 8000 and Vite dev server on port 5173...")

    # Start FastAPI backend process
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.local_server:app", "--port", "8000", "--reload"],
        cwd=str(ROOT_DIR)
    )

    # Start Vite frontend process
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR),
        shell=(sys.platform == "win32")
    )

    url = "http://localhost:5173"
    print(f"\n{BOLD}---------------------------------------------------------------{RESET}")
    print(f"🚀 {GREEN}{BOLD}KhataLens Dev Server LIVE!{RESET}")
    print(f"   Vite Frontend (Hot-Reload): {CYAN}{BOLD}{url}{RESET}")
    print(f"   Backend API Gateway:        {CYAN}http://localhost:8000{RESET}")
    print(f"   Press {AMBER}Ctrl + C{RESET} to exit dev mode.")
    print(f"{BOLD}---------------------------------------------------------------{RESET}\n")

    time.sleep(1.5)
    webbrowser.open(url)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down dev servers...")
        backend_proc.terminate()
        frontend_proc.terminate()


def main():
    parser = argparse.ArgumentParser(description="KhataLens Unified Runner")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind server (default: 8000)")
    parser.add_argument("--dev", action="store_true", help="Launch separate Vite dev server on port 5173")
    args = parser.parse_args()

    print_banner()
    check_python_dependencies()
    check_aws_status()

    if args.dev:
        run_dev_mode()
    else:
        build_frontend_if_needed()
        run_full_stack(args.port)


if __name__ == "__main__":
    main()
