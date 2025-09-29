# Facebook Downloader Development Script
Set-Location $PSScriptRoot

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "  Facebook Downloader Development Server  " -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Directory: $(Get-Location)" -ForegroundColor Gray

# Display menu options
Write-Host "`nSelect an option:" -ForegroundColor Yellow
Write-Host "1. Start development server (pnpm dev)" -ForegroundColor White
Write-Host "2. Update pnpm lockfile" -ForegroundColor White
Write-Host "3. Install dependencies" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`nStarting development server..." -ForegroundColor Green
        if (Test-Path "package.json") {
            pnpm dev
        } else {
            Write-Host "package.json not found!" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host "`nUpdating pnpm lockfile..." -ForegroundColor Green
        if (Test-Path "pnpm-lock.yaml") {
            Remove-Item "pnpm-lock.yaml" -Force
            Write-Host "Removed old pnpm-lock.yaml" -ForegroundColor Yellow
        }
        pnpm install
        Write-Host "Lockfile updated successfully!" -ForegroundColor Green
    }
    "3" {
        Write-Host "`nInstalling dependencies..." -ForegroundColor Green
        pnpm install
        Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    }
    "4" {
        Write-Host "`nGoodbye!" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host "`nInvalid choice. Exiting..." -ForegroundColor Red
        exit
    }
}