# ===================================================
#   Iniciando Backend Spring Boot - Club DPM Pro
# ===================================================

$env:JAVA_HOME = "C:\Users\matim\.jdks\openjdk-24.0.1"
$env:PATH = "$env:JAVA_HOME\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2025.1.3\plugins\maven\lib\maven3\bin;$env:PATH"

Write-Host "===================================================" -ForegroundColor Green
Write-Host "  Iniciando Backend Spring Boot - Club DPM Pro" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Java configurado: OpenJDK 24" -ForegroundColor Cyan
Write-Host "Maven configurado: Apache Maven 3.9" -ForegroundColor Cyan
Write-Host ""

& "C:\Program Files\JetBrains\IntelliJ IDEA 2025.1.3\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
