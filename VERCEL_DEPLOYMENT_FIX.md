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

First, remove any conflicting lock files:
```bash
# Remove npm lock file if it exists
rm package-lock.json

# Remove yarn lock file if it exists
rm yarn.lock
```

### 2. Update the pnpm Lockfile

Regenerate the pnpm lockfile to match your current dependencies:

```bash
# Remove existing lockfile
rm pnpm-lock.yaml

# Install dependencies (this will generate a new lockfile)
pnpm install
```

### 3. Commit and Deploy

Commit the updated lockfile and deploy again:

```bash
git add pnpm-lock.yaml
git commit -m "Update pnpm lockfile for Vercel deployment"
git push origin main
```

## Vercel Configuration

This project includes a `vercel.json` file that ensures proper deployment settings using the modern Vercel configuration format:

```json
{
  "framework": "nextjs",
  "installCommand": "pnpm install",
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
```

This format avoids the warning about unused build settings that occurs when using the older `builds` property.

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