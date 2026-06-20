# Run this in PowerShell to keep the dev server alive for phone testing.
# Do not close this window while using Expo Go.

Set-Location $PSScriptRoot
Remove-Item Env:CI -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Starting Memory Upgrades mobile dev server (tunnel mode)..." -ForegroundColor Cyan
Write-Host "Keep this window open while testing on your phone." -ForegroundColor Yellow
Write-Host ""

npx expo start --tunnel --port 8081