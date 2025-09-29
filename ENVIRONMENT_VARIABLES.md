# Environment Variables Configuration

To properly connect your Vercel frontend with the Render backend, you need to set the following environment variables:

## Frontend (Vercel)

Set these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Replace `https://your-backend-url.onrender.com` with your actual Render backend URL.

## Backend (Render)

Set these environment variables in your Render project settings:

```
FRONTEND_URL=https://your-frontend.vercel.app
```

Replace `https://your-frontend.vercel.app` with your actual Vercel frontend URL.

## Local Development

For local development, create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_API_URL=http://localhost:5003
```

And in your backend directory, create a `.env` file with:

```
FRONTEND_URL=http://localhost:3000
```

## Deployment Notes

1. After setting these environment variables, redeploy both your frontend and backend services.
2. Make sure to update the URLs with your actual deployment URLs.
3. The CORS configuration in the backend will automatically use these environment variables.