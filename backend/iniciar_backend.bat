@echo off
title DPM Pro - Backend Spring Boot
echo ===================================================
echo   Iniciando Backend Spring Boot - Club DPM Pro
echo ===================================================

set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2025.1.3\plugins\maven\lib\maven3\bin;%PATH%"

echo Java configurado: Java 21 LTS
java -version
echo.
echo Iniciando Spring Boot en http://localhost:8080 ...
mvn spring-boot:run
pause
