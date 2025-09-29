# Environment Configuration Guide

This guide explains how to properly configure environment variables for deployment to Vercel and Render.

## Environment Variables Overview

The application uses environment variables to configure backend URLs and other settings for different environments.

## Vercel Environment Variables

Set these variables in your Vercel project settings:

### Required Variables:
```
NODE_ENV=production
RENDER_BACKEND_URL=https://your-render-app-name.onrender.com
```

### Optional Variables:
```
BACKEND_URL=https://your-custom-backend-url.com  # Alternative to RENDER_BACKEND_URL
```

## Render Environment Variables

Set these variables in your Render project settings:

### Required Variables:
```
NODE_ENV=production
PORT=10000
```

## Development Environment

For local development, you can create a `.env.local` file in the root directory:

```
NODE_ENV=development
RENDER_BACKEND_URL=http://localhost:5003
BACKEND_URL=http://localhost:5003
```

## How Environment Variables Work

1. **API Routes**: The Next.js API routes in `/app/api/` use environment variables to determine the backend URL:
   - `process.env.RENDER_BACKEND_URL` (highest priority)
   - `process.env.BACKEND_URL` (fallback)
   - `http://localhost:5003` (development default)

2. **Next.js Rewrites**: The [next.config.mjs](file:///c:/Users/rafi%20shaik/OneDrive/Desktop/new-front/next.config.mjs) uses environment variables for proxying:
   - In production: Uses `RENDER_BACKEND_URL` or falls back to a placeholder
   - In development: Uses `http://localhost:5003`

## Setting Environment Variables

### Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the required variables

### Render Dashboard:
1. Go to your service settings
2. Navigate to "Environment Variables"
3. Add the required variables

### Local Development:
1. Create a `.env.local` file in the project root
2. Add your environment variables

## Troubleshooting

### Common Issues:

1. **ECONNREFUSED Errors**:
   - Ensure the backend URL is correctly set in environment variables
   - Verify the backend is running and accessible
   - Check that the PORT environment variable is set correctly on Render

2. **Dynamic Server Usage Errors**:
   - All API routes now use `export const dynamic = 'force-dynamic'`
   - Routes properly handle URL parsing without causing static rendering issues

3. **Proxy Issues**:
   - Verify that rewrites in [next.config.mjs](file:///c:/Users/rafi%20shaik/OneDrive/Desktop/new-front/next.config.mjs) match your backend endpoints
   - Ensure environment variables are correctly set

### Testing Environment Configuration:

Run the health check script to verify configuration:
```bash
npm run health-check
```

## Best Practices

1. **Use Environment Variables**: Never hardcode URLs in the source code
2. **Consistent Naming**: Use the same environment variable names across platforms
3. **Fallback Values**: Always provide sensible fallbacks for development
4. **Security**: Don't expose sensitive information in environment variables