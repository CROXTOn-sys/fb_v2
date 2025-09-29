# Navigate to the project directory and start development server
Set-Location "C:\Users\dell\OneDrive\calli5 LP\OneDrive\Desktop\fb last\fb-downloader"
Write-Host "Starting Facebook Downloader development server..." -ForegroundColor Green
Write-Host "Directory: $(Get-Location)" -ForegroundColor Cyan

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "package.json found" -ForegroundColor Green
    Write-Host "Starting pnpm dev..." -ForegroundColor Yellow
    pnpm dev
} else {
    Write-Host "package.json not found in current directory" -ForegroundColor Red
    Write-Host "Current directory contents:" -ForegroundColor Yellow
    Get-ChildItem
}