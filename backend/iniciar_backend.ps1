# ===================================================
#   Iniciando Backend Spring Boot - Club DPM Pro
# ===================================================

$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2025.1.3\plugins\maven\lib\maven3\bin;$env:PATH"

Write-Host "===================================================" -ForegroundColor Green
Write-Host "  Iniciando Backend Spring Boot - Club DPM Pro" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host "Java configurado: OpenJDK 21 LTS" -ForegroundColor Cyan
Write-Host "Maven configurado: Apache Maven 3.9" -ForegroundColor Cyan
Write-Host "Servidor en: http://localhost:8080/api" -ForegroundColor Yellow
Write-Host ""

mvn spring-boot:run
