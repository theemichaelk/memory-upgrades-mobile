# Creates a GitHub repo and pushes memory-upgrades-mobile.
# Prerequisite: run `gh auth login` first.

$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"

if (-not (Test-Path $gh)) {
  Write-Error "GitHub CLI not found. Install from https://cli.github.com/"
}

Set-Location (Split-Path $PSScriptRoot -Parent)

& $gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Not logged in to GitHub. Run:" -ForegroundColor Yellow
  Write-Host "  & '$gh' auth login --web --git-protocol https" -ForegroundColor Cyan
  exit 1
}

$repoName = "memory-upgrades-mobile"
$existing = & $gh repo view "theemichaelk/$repoName" --json name -q .name 2>$null

if ($existing) {
  Write-Host "Repo already exists. Adding remote and pushing..." -ForegroundColor Cyan
  git remote remove origin 2>$null
  git remote add origin "https://github.com/theemichaelk/$repoName.git"
} else {
  Write-Host "Creating public repo: $repoName" -ForegroundColor Cyan
  & $gh repo create $repoName --public --source=. --remote=origin --description "Official Memory Upgrades mobile app for memoryupgrades.org"
}

if ($null -eq (git branch --list main)) {
  git branch -M main
}

git push -u origin main
Write-Host ""
Write-Host "Done! Repo URL:" -ForegroundColor Green
Write-Host "  https://github.com/theemichaelk/$repoName" -ForegroundColor Cyan