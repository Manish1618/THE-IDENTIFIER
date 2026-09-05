@echo off
title THE IDENTITY - Biometric Attestation Platform
color 0B
cls

echo ===================================================================
echo                     THE IDENTITY PROTOCOL
echo         Biometric Attestation Platform - HackerHouse Goa
echo ===================================================================
echo.
echo [*] Initializing Services...
echo.

:: 1. Clean any stuck listeners on port 8000 & 5173 to prevent conflicts
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [*] Freeing port 8000 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [*] Freeing port 5173 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

:: 2. Launch FastAPI Backend
set ROOT_DIR=%~dp0
echo [*] Starting FastAPI Backend (Port 8000)...
start "THE IDENTITY - Backend API" cmd /k "cd /d "%ROOT_DIR%" && (if exist "%ROOT_DIR%.venv\Scripts\python.exe" ("%ROOT_DIR%.venv\Scripts\python.exe" -m uvicorn backend.main:app --host 0.0.0.0 --port 8000) else if exist "E:\HHGOA\FACE ID\.venv\Scripts\python.exe" ("E:\HHGOA\FACE ID\.venv\Scripts\python.exe" -m uvicorn backend.main:app --host 0.0.0.0 --port 8000) else (python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000))"

:: 3. Launch Vite Frontend
echo [*] Starting Vite Frontend UI (Port 5173)...
start "THE IDENTITY - Frontend WebUI" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev -- --host 0.0.0.0 --port 5173"

:: 4. Wait for compilation and open browser
echo [*] Launching Web Interface in Browser...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo ===================================================================
echo                THE IDENTITY PLATFORM IS RUNNING!
echo ===================================================================
echo  [+] Web App:     http://localhost:5173/
echo  [+] Backend API: http://localhost:8000/
echo  [+] API Docs:    http://localhost:8000/docs
echo.
echo  Keep the opened command windows running while using the app.
echo ===================================================================
pause
