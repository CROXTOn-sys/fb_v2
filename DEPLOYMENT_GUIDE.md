# Deployment Guide

This guide explains how to deploy the Facebook Downloader application to both Vercel (frontend) and Render (backend) simultaneously.

## Prerequisites

1. GitHub account
2. Vercel account
3. Render account

## Deploying to Render (Backend)

### 1. Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New+" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `facebook-downloader-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
   - Instance Type: `Free` (or choose a paid tier for better performance)

### 2. Environment Variables for Render

Set the following environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
```

### 3. Note Your Render URL

After deployment, Render will provide you with a URL like:
`https://facebook-downloader-backend-xyz1.onrender.com`

Keep this URL for the next step.

## Deploying to Vercel (Frontend)

### 1. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: `Next.js`
   - Root Directory: `/`
   - Build Command: `next build`
   - Output Directory: `.next`

### 2. Environment Variables for Vercel

Set the following environment variables in your Vercel dashboard:

```
NODE_ENV=production
RENDER_BACKEND_URL=https://your-render-app-name.onrender.com
```

Replace `https://your-render-app-name.onrender.com` with the actual URL you got from Render.

### 3. Update next.config.mjs (Alternative Method)

Instead of using environment variables, you can also directly update the [next.config.mjs](file:///c:/Users/rafi%20shaik/OneDrive/Desktop/new-front/next.config.mjs) file with your Render URL:

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

## Simultaneous Deployment Process

1. **Push to GitHub**: Commit and push all your changes to GitHub
2. **Deploy Backend First**: Deploy to Render first since the frontend needs to know the backend URL
3. **Get Render URL**: Copy the URL provided by Render after deployment
4. **Configure Vercel**: Set the `RENDER_BACKEND_URL` environment variable in Vercel
5. **Deploy Frontend**: Deploy to Vercel

## Redeployment

After making changes:
1. Push to your GitHub repository
2. Both Vercel and Render will automatically detect changes and redeploy
3. Monitor the build logs for any issues

## Monitoring

- **Vercel**: Check logs in the Vercel dashboard
- **Render**: Check logs in the Render dashboard
- **Health Checks**: 
  - Frontend: `https://your-vercel-app.vercel.app/`
  - Backend: `https://your-render-app.onrender.com/health`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the RENDER_BACKEND_URL in Vercel matches your Render deployment URL
2. **API Not Working**: Check that the backend is running and the URL is correct
3. **Timeout Issues**: Facebook parsing can take time; consider upgrading from free tiers if needed

### Checking Deployments

1. **Backend Health Check**: Visit `https://your-render-app.onrender.com/health`
2. **Frontend Access**: Visit your Vercel deployment URL
3. **API Connection**: Try making a request to `/api/fetch` through your frontend

## Best Practices

1. **Environment Variables**: Use environment variables instead of hardcoding URLs
2. **Monitoring**: Regularly check both Vercel and Render dashboards for errors
3. **Performance**: Consider upgrading from free tiers for production use
4. **Security**: Don't expose sensitive information in logs or responses