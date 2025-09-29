/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Use Render backend URL in production, localhost in development
    // This can be overridden with RENDER_BACKEND_URL environment variable
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.RENDER_BACKEND_URL || 'https://YOUR_RENDER_APP_NAME.onrender.com'  // Replace with your actual Render app name
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
  },
}

export default nextConfig