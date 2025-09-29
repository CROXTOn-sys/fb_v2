# Vercel Deployment Fix for pnpm Lockfile Issues

This document explains how to resolve the common Vercel deployment errors related to pnpm lockfile mismatches:

```
Error: Command "pnpm install" exited with 1
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

## Understanding the Problem

Vercel uses pnpm by default when it detects a `pnpm-lock.yaml` file in your project. The error occurs when:

1. Your `pnpm-lock.yaml` file doesn't match your `package.json` dependencies
2. You have conflicting lock files (like `package-lock.json` for npm)
3. The lockfile was generated with a different version of pnpm

## Solution Steps

### 1. Remove Conflicting Lock Files

First, remove any conflicting lock files from both frontend and backend:
```bash
# Remove npm lock files if they exist
rm package-lock.json
rm backend/package-lock.json

# Remove yarn lock file if it exists
rm yarn.lock
```

### 2. Update the pnpm Lockfile

Regenerate the pnpm lockfile to match your current dependencies:

```bash
# Update dependencies (this will update the lockfile if needed)
pnpm install
```

### 3. Minimal Vercel Configuration

Use a minimal vercel.json configuration that only specifies the framework:

```json
{
  "framework": "nextjs"
}
```

This approach avoids any warnings about unused build settings while ensuring Vercel properly recognizes and builds your Next.js application.

### 4. Commit and Deploy

Commit the updated files and deploy again:

```bash
git add pnpm-lock.yaml vercel.json
git commit -m "Fix Vercel deployment issues"
git push origin main
```

## Vercel Configuration

The minimal vercel.json configuration:

```json
{
  "framework": "nextjs"
}
```

This configuration:
- Allows Vercel to use its default settings for Next.js projects
- Prevents warnings about unused build settings
- Still ensures proper detection and building of your Next.js application

## Automated Solutions

This project includes scripts to automate the lockfile update process:

### For Windows Users:

```bash
# Using PowerShell
.\scripts\update-lockfile.ps1

# Using Command Prompt
.\scripts\update-lockfile.bat
```

### For Mac/Linux Users:

```bash
# Make script executable
chmod +x ./scripts/update-lockfile.js

# Run the script
npm run update-lockfile
```

## Prevention Tips

1. **Use one package manager consistently**: Stick to either npm, yarn, or pnpm
2. **Don't commit conflicting lock files**: Only commit the lock file for your chosen package manager
3. **Update lockfiles regularly**: Run `pnpm install` after adding new dependencies
4. **Use the same pnpm version**: Team members should use the same pnpm version

## Troubleshooting

If you continue to have issues:

1. Check that your `package.json` doesn't have any syntax errors
2. Ensure all dependencies are correctly specified
3. Clear pnpm cache: `pnpm store prune`
4. Reinstall dependencies from scratch

For more information, refer to the [pnpm documentation on lockfiles](https://pnpm.io/pnpm-lock_yaml) and [Vercel's configuration documentation](https://vercel.com/docs/projects/project-configuration).