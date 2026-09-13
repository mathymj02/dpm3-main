@echo off
title DPM Pro - Iniciar Plataforma Completa
echo ===================================================
echo   INICIANDO PLATAFORMA DPM PRO (BACKEND + FRONTEND)
echo ===================================================
echo.

set "PROJECT_DIR=%~dp0"

echo [1/2] Levantando Backend (Spring Boot en puerto 8080)...
start "DPM Pro - Backend (Spring Boot 8080)" cmd /k "cd /d %PROJECT_DIR%backend && iniciar_backend.bat"

echo Esperando 6 segundos para inicializacion de la API...
timeout /t 6 /nobreak >nul

echo.
echo [2/2] Levantando Frontend (React en puerto 5173)...
start "DPM Pro - Frontend (React 5173)" cmd /k "cd /d %PROJECT_DIR%frontend && npm run dev"

echo.
echo Abriendo aplicacion en el navegador...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo ===================================================
echo   TODO LISTO! Tus dos servidores estan activos:
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:8080/api
echo ===================================================
pause
