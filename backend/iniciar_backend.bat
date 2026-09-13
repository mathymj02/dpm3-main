@echo off
title DPM Pro - Backend Spring Boot
echo ===================================================
echo   Iniciando Backend Spring Boot - Club DPM Pro
echo ===================================================

set "JAVA_HOME=C:\Users\matim\.jdks\openjdk-24.0.1"
set "PATH=%JAVA_HOME%\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2025.1.3\plugins\maven\lib\maven3\bin;%PATH%"

echo Java configurado:
java -version
echo.
echo Iniciando Spring Boot...
"C:\Program Files\JetBrains\IntelliJ IDEA 2025.1.3\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
pause
