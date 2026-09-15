@echo off
chcp 65001 >nul
title MyPlano - Server Locale & Accesso Mobile

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

python Tools\launch_with_qr.py

if %ERRORLEVEL% NEQ 0 if %ERRORLEVEL% NEQ 130 (
    echo.
    echo Impossibile avviare automaticamente tramite Python.
    echo Avvio standard tramite npm:
    npm run dev -- --host 0.0.0.0 --port 5173
    pause
)
