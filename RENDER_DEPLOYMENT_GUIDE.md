# Render Deployment Guide

This guide explains how to deploy the Facebook Downloader application to Render.

## Backend Deployment

### 1. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `facebook-downloader-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Instance Type: `Free` (or choose a paid tier for better performance)

### 2. Environment Variables

Set the following environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
```

### 3. Update Frontend Configuration

After deploying the backend, you'll get a Render URL like:
`https://facebook-downloader-backend-xyz1.onrender.com`

Update the [next.config.mjs](file:///c:/Users/rafi%20shaik/OneDrive/Desktop/new-front/next.config.mjs) file with your actual Render backend URL:

```javascript
async rewrites() {
  // Use Render backend URL in production, localhost in development
  const backendUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-actual-render-app-name.onrender.com'  // Replace with your actual Render app name
    : 'http://localhost:5003';
  
  return [
    {
      source: '/api/:path*',
      destination: `${backendUrl}/api/:path*`,
    },
    {
      source: '/download-story',
      destination: `${backendUrl}/download-story`,
    },
  ]
}
```

## Common Issues and Solutions

### 1. Port Configuration
Render requires services to listen on the port specified by the `PORT` environment variable. The backend is configured to use:
- `process.env.PORT` (Render's assigned port)
- `process.env.BACKEND_PORT` (custom port if needed)
- `5003` (default fallback for local development)

### 2. CORS Issues
The backend is configured with CORS middleware to allow requests from any origin. If you encounter CORS issues:
1. Check that the frontend is correctly proxying requests to the backend
2. Verify the backend URL in [next.config.mjs](file:///c:/Users/rafi%20shaik/OneDrive/Desktop/new-front/next.config.mjs) matches your Render deployment

### 3. Health Check
Render uses the `/health` endpoint to check if your service is running. The backend includes this endpoint which returns:
```json
{
  "status": "OK",
  "timestamp": "2023-..."
}
```

### 4. Timeout Issues
Facebook parsing can take time. Render has a 15-second timeout for free tier services. If you encounter timeout issues:
1. Optimize the parsing logic
2. Consider upgrading to a paid Render tier
3. Implement caching for frequently requested content

## Monitoring and Logs

1. View logs in the Render dashboard under your service's "Logs" tab
2. Monitor the health endpoint: `https://your-render-app-name.onrender.com/health`
3. Check for error patterns in the logs to identify parsing issues

## Redeployment

After making changes:
1. Push to your GitHub repository
2. Render will automatically detect changes and redeploy
3. Monitor the build logs for any issues

## Scaling Considerations

For production use:
1. Consider upgrading from the free tier for better performance
2. Implement rate limiting to prevent abuse
3. Add caching mechanisms for parsed content
4. Monitor usage and adjust resources accordingly