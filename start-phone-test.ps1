# Run THIS in your own PowerShell window (not inside Cursor).
# Keeps Expo out of CI mode so Expo Go links work on your phone.

Set-Location $PSScriptRoot

# CI mode breaks Expo Go tunnel connections (HTTP 500 errors).
Remove-Item Env:CI -ErrorAction SilentlyContinue
$env:CI = $null
$env:EXPO_NO_TELEMETRY = '1'

# Allow phone on same Wi-Fi to reach Metro (safe for local dev).
$ruleName = 'Expo Metro 8081'
if (-not (Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue)) {
  New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -LocalPort 8081 -Protocol TCP -Action Allow | Out-Null
  Write-Host "Added firewall rule for port 8081" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Memory Upgrades - Phone Test Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install/update Expo Go on your phone (required for SDK 55)" -ForegroundColor Yellow
Write-Host "2. When you see 'Tunnel ready', copy the exp:// URL below" -ForegroundColor Yellow
Write-Host "3. Expo Go -> Enter URL manually -> paste -> Connect" -ForegroundColor Yellow
Write-Host ""
Write-Host "Keep this window OPEN while testing." -ForegroundColor Yellow
Write-Host ""

npx expo start --tunnel --port 8081