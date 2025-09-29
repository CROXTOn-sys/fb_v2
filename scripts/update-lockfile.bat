@echo off
echo 🔄 Updating pnpm lockfile...

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% == 0 (
    for /f "tokens=*" %%i in ('pnpm --version') do set pnpm_version=%%i
    echo ✅ pnpm is installed (version %pnpm_version%)
) else (
    echo ⚠️ pnpm not found, installing...
    npm install -g pnpm
)

REM Remove existing lockfile
cd ..
if exist pnpm-lock.yaml (
    del pnpm-lock.yaml
    echo 🗑️ Removed old pnpm-lock.yaml
)

REM Install dependencies with pnpm
echo 📥 Installing dependencies with pnpm...
pnpm install

if %errorlevel% == 0 (
    echo ✅ pnpm lockfile updated successfully!
    echo.
    echo 📝 Next steps:
    echo 1. Commit the updated pnpm-lock.yaml file
    echo 2. Push to your repository
    echo 3. Deploy to Vercel again
) else (
    echo ❌ Error updating pnpm lockfile
    exit /b 1
)

pause