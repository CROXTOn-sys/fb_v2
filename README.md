# Facebook Downloader

A full-stack application for downloading Facebook content including videos, reels, posts, and stories. Built with Next.js frontend and Node.js backend with HTML parsing capabilities.

## Features

- 🎥 **Video Download**: Download Facebook videos in HD and SD quality
- 🎬 **Reel Download**: Download Facebook Reels
- 📱 **Post Download**: Download Facebook posts with images
- 📖 **Story Download**: Download Facebook stories (coming soon)
- 🌍 **Multi-language Support**: 12 languages supported
- 🌙 **Dark/Light Theme**: Toggle between themes
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Fast Processing**: Optimized HTML parsing and content extraction

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Radix UI** - UI components
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Cheerio** - HTML parsing
- **Axios** - HTTP client
- **CORS** - Cross-origin requests

## Prerequisites

Before running the application, make sure you have:

- **Node.js** (version 14 or higher)
- **pnpm** (package manager) - Install with `npm install -g pnpm`
- **Git** (for cloning the repository)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd facebook-downloader
```

### 2. Install Dependencies

#### Option A: Automatic Setup (Recommended)
Run the startup script:

**For Windows:**
```bash
start-app.bat
```

**For Linux/Mac:**
```bash
chmod +x start-app.sh
./start-app.sh
```

#### Option B: Manual Setup

**Backend Setup:**
```bash
cd backend
npm install
```

**Frontend Setup:**
```bash
cd ..
pnpm install
```

### 3. Start the Application

#### Option A: Using Startup Scripts
The startup scripts will automatically install dependencies and start both servers:

**Windows:**
```bash
start-app.bat
```

**Linux/Mac:**
```bash
./start-app.sh
```

#### Option B: Manual Start

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend Server:**
```bash
pnpm dev
```

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Select content type**: Choose from Video, Reel, Post, or Story
3. **Paste Facebook URL**: Copy and paste the Facebook URL you want to download
4. **Click Download**: The app will parse the content and show a preview
5. **Download**: Click the download button to save the content to your device

## Supported URL Formats

### Videos
- `https://www.facebook.com/share/v/[video-id]/`
- `https://www.facebook.com/watch/?v=[video-id]`
- `https://www.facebook.com/videos/[video-id]/`

### Reels
- `https://www.facebook.com/share/r/[reel-id]/`
- `https://www.facebook.com/reel/[reel-id]/`

### Posts
- `https://www.facebook.com/share/p/[post-id]/`
- `https://www.facebook.com/posts/[post-id]/`

### Stories
- `https://www.facebook.com/share/s/[story-id]/`
- `https://www.facebook.com/stories/[story-id]/`

## API Endpoints

### Backend API (Port 5003)

- `GET /health` - Health check
- `POST /api/fetch` - Parse Facebook content
- `POST /api/preview` - Generate content preview
- `GET /api/download` - Download media files

### Frontend API (Port 3000)

- `POST /api/fetch` - Proxy to backend fetch
- `POST /api/preview` - Proxy to backend preview
- `GET /api/download` - Proxy to backend download

## Project Structure

```
facebook-downloader/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── download/      # Download endpoint
│   │   ├── fetch/         # Fetch endpoint
│   │   └── preview/       # Preview endpoint
│   ├── components/        # React components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── backend/               # Backend server
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── downloads/         # Downloaded files storage
├── components/            # Shared components
├── lib/                  # Utility functions
├── public/               # Static assets
├── start-app.bat         # Windows startup script
├── start-app.sh          # Linux/Mac startup script
└── package.json          # Frontend dependencies
```

## Configuration

### Environment Variables

You can set these environment variables:

- `PORT` - Backend server port (default: 5003)
- `NODE_ENV` - Environment (development/production)

### Customization

- **Languages**: Add new languages in `app/page.tsx`
- **Themes**: Modify theme classes in `app/page.tsx`
- **UI Components**: Update components in `components/ui/`
- **Parsing Logic**: Modify `backend/server.js`

## Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check if port 5003 is available
   - Run `npm install` in the backend directory
   - Check Node.js version (should be 14+)

2. **Frontend not connecting to backend**
   - Ensure backend is running on port 5003
   - Check for CORS issues
   - Verify API endpoints are correct

3. **Download not working**
   - Check if the Facebook URL is valid
   - Ensure the content is publicly accessible
   - Check browser console for errors

4. **Parsing errors**
   - Facebook may have changed their HTML structure
   - Try with different Facebook URLs
   - Check backend logs for detailed error messages

5. **Vercel Deployment Errors**
   - If you see `ERR_PNPM_OUTDATED_LOCKFILE`, run `pnpm install` to update the lockfile
   - Remove any conflicting lock files (`package-lock.json` or `yarn.lock`)
   - Ensure your `pnpm-lock.yaml` is up to date with `package.json`
   - See [VERCEL_DEPLOYMENT_FIX.md](VERCEL_DEPLOYMENT_FIX.md) for detailed instructions

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=facebook-downloader:*
```

## Development

### Adding New Features

1. **Backend**: Add new parsing logic in `backend/server.js`
2. **Frontend**: Add new UI components in `components/`
3. **API**: Add new endpoints in `app/api/`

### Testing

Test the application with sample Facebook URLs:

```bash
# Test video download
curl -X POST http://localhost:5003/api/fetch \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.facebook.com/share/v/[video-id]/"}'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This tool is for educational purposes only. Please respect Facebook's Terms of Service and only download content you have permission to download. The developers are not responsible for any misuse of this application.

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review the GitHub issues
3. Create a new issue with detailed information

---

**Happy Downloading! 🎉**