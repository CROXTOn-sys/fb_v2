# Update pnpm lockfile script for Windows

Write-Host "🔄 Updating pnpm lockfile..." -ForegroundColor Yellow

try {
    # Check if pnpm is installed
    $pnpmVersion = pnpm --version 2>$null
    if ($pnpmVersion) {
        Write-Host "✅ pnpm is installed (version $pnpmVersion)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ pnpm not found, installing..." -ForegroundColor Yellow
        npm install -g pnpm
    }

    # Remove existing lockfile
    $lockfilePath = Join-Path $PSScriptRoot "..\pnpm-lock.yaml"
    if (Test-Path $lockfilePath) {
        Remove-Item $lockfilePath -Force
        Write-Host "🗑️ Removed old pnpm-lock.yaml" -ForegroundColor Green
    }

    # Install dependencies with pnpm
    Write-Host "📥 Installing dependencies with pnpm..." -ForegroundColor Yellow
    Set-Location (Join-Path $PSScriptRoot "..")
    pnpm install

    Write-Host "✅ pnpm lockfile updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Commit the updated pnpm-lock.yaml file" -ForegroundColor Cyan
    Write-Host "2. Push to your repository" -ForegroundColor Cyan
    Write-Host "3. Deploy to Vercel again" -ForegroundColor Cyan

} catch {
    Write-Error "❌ Error updating pnpm lockfile: $_"
    exit 1
}