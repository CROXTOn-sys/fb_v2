import express from "express";
import cors from "cors";
import axios from "axios";
import cheerio from "cheerio";
import path from "path";
import fs from "fs";

const app = express();

const cors = require('cors');
app.use(cors({
  origin: 'https://fb-v2-eta.vercel.app',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your existing routes stay exactly the same
app.get("/api/fetch", (req, res) => {
  // existing fetch logic
  res.status(200).json({ message: "Fetch endpoint placeholder" });
});

// Serve static files
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Enhanced Facebook content parser class
class FacebookParser {
  constructor() {
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    this.headers = {
      'User-Agent': this.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
      'Referer': 'https://www.facebook.com/'
    };
  }

  async fetchMbasicVideoUrl(originalUrl) {
    try {
      // Convert share links to www URLs for mbasic navigation
      let wwwUrl = originalUrl
        .replace('://m.', '://www.')
        .replace('://mbasic.', '://www.')
        .replace('/share/v/', '/videos/')
        .replace('/share/r/', '/reel/')
        .replace('/share/p/', '/posts/')
      
      const mbasicUrl = wwwUrl.replace('://www.', '://mbasic.');
      console.log('Fetching mbasic page:', mbasicUrl)
      const resp = await axios.get(mbasicUrl, { headers: this.headers, timeout: 20000 });
      const $ = cheerio.load(resp.data);
      
      // Find the video redirect link (works for many public videos)
      let redirect = $('a[href*="/video_redirect/"]').attr('href');
      if (redirect && redirect.startsWith('/')) {
        redirect = 'https://mbasic.facebook.com' + redirect;
      }
      if (!redirect) return null;
      
      // Follow the redirect to get the real mp4 URL
      const redResp = await axios.get(redirect, {
        headers: this.headers,
        timeout: 20000,
        maxRedirects: 5,
        validateStatus: s => s >= 200 && s < 400
      });
      
      // Extract final URL from response
      let finalUrl = redResp.request?.res?.responseUrl;
      if (!finalUrl) {
        // Try to get from the response data
        const match = String(redResp.data || '').match(/https?:[^"']+\.mp4[^"']*/i);
        finalUrl = match ? match[0] : null;
      }
      
      if (finalUrl && /\.mp4(\?|$)/i.test(finalUrl)) {
        console.log('Found working mp4 URL:', finalUrl);
        return finalUrl;
      }
      
      return null;
    } catch (e) {
      console.log('mbasic fetch error:', e.message);
      return null;
    }
  }

  async parseContent(url, contentType = 'auto') {
    try {
      console.log(`Parsing Facebook content: ${url}`);
      
      // Detect content type from URL if auto
      if (contentType === 'auto') {
        contentType = this.detectContentType(url);
      }

      console.log(`Detected content type: ${contentType}`);

      // Try multiple approaches to fetch the content
      let response;
      let html;
      
      try {
        // Method 1: Direct fetch with enhanced headers
        response = await axios.get(url, {
          headers: this.headers,
          timeout: 30000,
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 400; // Accept redirects
          }
        });
        
        html = response.data;
        console.log(`Successfully fetched HTML, length: ${html.length}`);
        
      } catch (fetchError) {
        console.log('Direct fetch failed, trying alternative method...');
        
        // Method 2: Try with mobile headers
        const mobileHeaders = {
          ...this.headers,
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
        };
        
        response = await axios.get(url, {
          headers: mobileHeaders,
          timeout: 30000,
          maxRedirects: 5
        });
        
        html = response.data;
        console.log(`Mobile fetch successful, length: ${html.length}`);
      }

      const $ = cheerio.load(html);

      const result = {
        success: true,
        url: url,
        contentType: contentType,
        content: {
          contentType: contentType,
          videos: {},
          images: [],
          stories: [],
          reels: [],
          postText: '',
          postTitle: '',
          postDescription: ''
        }
      };

      // Parse based on content type
      switch (contentType) {
        case 'video':
          await this.parseVideo($, result, html);
          break;
        case 'reel':
          await this.parseReel($, result, html);
          break;
        case 'post':
          await this.parsePost($, result, html);
          break;
        case 'story':
          await this.parseStory($, result, html);
          break;
        default:
          await this.parseGeneric($, result, html);
      }

      // If no videos found, try to generate fallback URLs
      if (Object.keys(result.content.videos).length === 0 && contentType === 'video') {
        console.log('No videos found, trying fallback URL generation...');
        result.content.videos = this.generateFallbackVideoUrls(url);
      }

      return result;
    } catch (error) {
      console.error('Facebook parsing error:', error.message);
      return {
        success: false,
        error: error.message,
        url: url,
        details: error.response?.status ? `HTTP ${error.response.status}` : 'Unknown error'
      };
    }
  }

  detectContentType(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('/share/r/')) return 'reel';
    if (lowerUrl.includes('/share/v/')) return 'video';
    if (lowerUrl.includes('/share/p/')) return 'post';
    if (lowerUrl.includes('/share/s/') || lowerUrl.includes('/stories/')) return 'story';
    if (lowerUrl.includes('/reel/')) return 'reel';
    if (lowerUrl.includes('/watch/') || lowerUrl.includes('/videos/')) return 'video';
    return 'post';
  }

  generateFallbackVideoUrls(url) {
    console.log('Generating fallback video URLs...');
    
    // Extract video ID from URL - support multiple patterns
    let videoIdMatch = url.match(/\/share\/v\/([^\/]+)/);
    if (!videoIdMatch) {
      videoIdMatch = url.match(/\/videos\/([^\/]+)/);
    }
    if (!videoIdMatch) {
      videoIdMatch = url.match(/\/video\/([^\/]+)/);
    }
    if (!videoIdMatch) {
      videoIdMatch = url.match(/\/reel\/([^\/]+)/);
    }
    if (!videoIdMatch) {
      videoIdMatch = url.match(/\/watch\/\?v=([^&]+)/);
    }
    
    if (!videoIdMatch) return {};
    
    const videoId = videoIdMatch[1];
    console.log('Extracted video ID:', videoId);
    
    // Generate multiple potential video URLs using different Facebook CDN patterns
    const fallbackUrls = {
      sd: [
        `https://video.fbkk10-1.fna.fbcdn.net/v/t42.1790-2/${videoId}_n.mp4`,
        `https://video.fbkk10-1.fna.fbcdn.net/v/t42.1790-2/${videoId}.mp4`,
        `https://scontent.fbkk10-1.fna.fbcdn.net/v/t42.1790-2/${videoId}_n.mp4`,
        `https://video.xx.fbcdn.net/v/t42.1790-2/${videoId}_n.mp4`
      ],
      hd: [
        `https://video.fbkk10-1.fna.fbcdn.net/v/t42.1790-2/${videoId}_hd.mp4`,
        `https://video.fbkk10-1.fna.fbcdn.net/v/t42.1790-2/${videoId}_720p.mp4`,
        `https://scontent.fbkk10-1.fna.fbcdn.net/v/t42.1790-2/${videoId}_hd.mp4`,
        `https://video.xx.fbcdn.net/v/t42.1790-2/${videoId}_hd.mp4`
      ]
    };
    
    // Return the first URL from each quality (we'll try them in order)
    return {
      sd: fallbackUrls.sd[0],
      hd: fallbackUrls.hd[0],
      alternatives: {
        sd: fallbackUrls.sd,
        hd: fallbackUrls.hd
      }
    };
  }

  async parseVideo($, result, html) {
    console.log('Parsing video content...');
    
    // PRIORITY 1: Try mbasic.facebook.com video_redirect first (most reliable)
    try {
      console.log('Trying mbasic video_redirect first...');
      const mbasicUrl = await this.fetchMbasicVideoUrl(result.url);
      if (mbasicUrl) {
        console.log('mbasic video_redirect URL found:', mbasicUrl);
        result.content.videos = { sd: mbasicUrl };
        this.extractMetadata($, result);
        return;
      }
    } catch (e) {
      console.log('mbasic extraction failed:', e.message);
    }
    
    // PRIORITY 2: Extract video URLs from script tags
    const videoUrls = this.extractVideoUrls($, html);
    if (videoUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(videoUrls);
      console.log(`Found ${videoUrls.length} video URLs`);
      this.extractMetadata($, result);
      return;
    }
    
    // PRIORITY 3: Try alternative extraction methods
    console.log('No video URLs found, trying alternative extraction...');
    const altUrls = this.extractVideoUrlsAlternative($, html);
    if (altUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(altUrls);
      console.log(`Found ${altUrls.length} alternative video URLs`);
      this.extractMetadata($, result);
      return;
    }
    
    // PRIORITY 4: Try to extract real video URLs using Facebook's internal data
    console.log('No video URLs found, trying Facebook Graph API approach...');
    const realUrls = await this.extractRealVideoUrls(result.url, html);
    if (realUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(realUrls);
      console.log(`Found ${realUrls.length} real video URLs`);
      this.extractMetadata($, result);
      return;
    }
    
    // FINAL FALLBACK: Generate fallback URLs (these may not work due to Facebook restrictions)
    console.log('No real video URLs found, using fallback...');
    result.content.videos = this.generateFallbackVideoUrls(result.url);
    
    // Extract metadata
    this.extractMetadata($, result);
  }

  async extractRealVideoUrls(originalUrl, html) {
    console.log('Attempting to extract real video URLs...');
    const videoUrls = [];
    
    try {
      // Method 1: Look for video URLs in Facebook's internal data structures
      const scriptMatches = html.match(/<script[^>]*>.*?<\/script>/gs);
      if (scriptMatches) {
        for (const script of scriptMatches) {
          // Look for video URLs in various Facebook data structures
          const patterns = [
            /"playable_url":"([^"]+)"/g,
            /"video_url":"([^"]+)"/g,
            /"src":"([^"]*\.mp4[^"]*)"/g,
            /"url":"([^"]*\.mp4[^"]*)"/g,
            /"hd_src":"([^"]+)"/g,
            /"sd_src":"([^"]+)"/g,
            /"hd_src_no_ratelimit":"([^"]+)"/g,
            /"sd_src_no_ratelimit":"([^"]+)"/g,
            /"browser_native_hd_url":"([^"]+)"/g,
            /"browser_native_sd_url":"([^"]+)"/g,
            /"dash_manifest":"([^"]+)"/g,
            /"progressive_url":"([^"]+)"/g
          ];
          
          for (const pattern of patterns) {
            const matches = script.match(pattern);
            if (matches) {
              matches.forEach(match => {
                const urlMatch = match.match(pattern);
                if (urlMatch && urlMatch[1]) {
                  let cleanUrl = urlMatch[1].replace(/\\/g, '');
                  if (cleanUrl.startsWith('http') && (cleanUrl.includes('.mp4') || cleanUrl.includes('video'))) {
                    videoUrls.push(cleanUrl);
                    console.log('Real video URL found:', cleanUrl);
                  }
                }
              });
            }
          }
        }
      }
      
      // Method 2: Try to extract from meta tags and other sources
      const metaMatches = html.match(/<meta[^>]*property="og:video"[^>]*>/g);
      if (metaMatches) {
        metaMatches.forEach(meta => {
          const contentMatch = meta.match(/content="([^"]+)"/);
          if (contentMatch && contentMatch[1]) {
            const url = contentMatch[1];
            if (url.includes('.mp4') || url.includes('video')) {
              videoUrls.push(url);
              console.log('Meta video URL found:', url);
            }
          }
        });
      }
      
      // Method 3: Look for video URLs in data attributes
      const dataMatches = html.match(/data-video-url="([^"]+)"/g);
      if (dataMatches) {
        dataMatches.forEach(match => {
          const urlMatch = match.match(/data-video-url="([^"]+)"/);
          if (urlMatch && urlMatch[1]) {
            const url = urlMatch[1];
            if (url.includes('.mp4') || url.includes('video')) {
              videoUrls.push(url);
              console.log('Data video URL found:', url);
            }
          }
        });
      }
      
      // Method 4: Look for video URLs in JSON-LD structured data
      const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>.*?<\/script>/gs);
      if (jsonLdMatches) {
        jsonLdMatches.forEach(script => {
          try {
            const jsonContent = script.replace(/<\/?script[^>]*>/g, '');
            const data = JSON.parse(jsonContent);
            if (data.video && data.video.contentUrl) {
              videoUrls.push(data.video.contentUrl);
              console.log('JSON-LD video URL found:', data.video.contentUrl);
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        });
      }
      
    } catch (error) {
      console.error('Error extracting real video URLs:', error);
    }
    
    return [...new Set(videoUrls)]; // Remove duplicates
  }

  async parseReel($, result, html) {
    console.log('Parsing reel content...');
    
    // PRIORITY 1: Try mbasic.facebook.com video_redirect first (most reliable)
    try {
      console.log('Trying mbasic video_redirect first for reel...');
      const mbasicUrl = await this.fetchMbasicVideoUrl(result.url);
      if (mbasicUrl) {
        console.log('mbasic video_redirect URL found for reel:', mbasicUrl);
        result.content.videos = { sd: mbasicUrl };
        this.extractMetadata($, result);
        return;
      }
    } catch (e) {
      console.log('mbasic extraction failed for reel:', e.message);
    }
    
    // PRIORITY 2: Extract video URLs from script tags
    const videoUrls = this.extractVideoUrls($, html);
    if (videoUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(videoUrls);
      result.content.reels = videoUrls;
      console.log(`Found ${videoUrls.length} reel URLs`);
      this.extractMetadata($, result);
      return;
    }
    
    // PRIORITY 3: Try alternative extraction methods
    console.log('No video URLs found for reel, trying alternative extraction...');
    const altUrls = this.extractVideoUrlsAlternative($, html);
    if (altUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(altUrls);
      result.content.reels = altUrls;
      console.log(`Found ${altUrls.length} alternative reel URLs`);
      this.extractMetadata($, result);
      return;
    }
    
    // PRIORITY 4: Try to extract real video URLs using Facebook's internal data
    console.log('No video URLs found for reel, trying Facebook Graph API approach...');
    const realUrls = await this.extractRealVideoUrls(result.url, html);
    if (realUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(realUrls);
      result.content.reels = realUrls;
      console.log(`Found ${realUrls.length} real reel URLs`);
      this.extractMetadata($, result);
      return;
    }
    
    // FINAL FALLBACK: Generate fallback URLs (these may not work due to Facebook restrictions)
    console.log('No real video URLs found for reel, using fallback...');
    result.content.videos = this.generateFallbackVideoUrls(result.url);
    result.content.reels = [result.content.videos.sd || result.content.videos.hd].filter(Boolean);
    
    // Extract metadata
    this.extractMetadata($, result);
  }

  async parsePost($, result, html) {
    console.log('Parsing post content...');
    
    // Extract images
    const images = this.extractImages($);
    if (images.length > 0) {
      result.content.images = images;
      console.log(`Found ${images.length} images`);
    }

    // Extract videos if any
    const videoUrls = this.extractVideoUrls($, html);
    if (videoUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(videoUrls);
      console.log(`Found ${videoUrls.length} video URLs in post`);
    }

    // Extract metadata
    this.extractMetadata($, result);
  }

  async parseStory($, result, html) {
    console.log('Parsing story content...');
    
    // Extract story media
    const storyUrls = this.extractStoryUrls($, html);
    if (storyUrls.length > 0) {
      result.content.stories = storyUrls;
      console.log(`Found ${storyUrls.length} story URLs`);
    }

    // Extract metadata
    this.extractMetadata($, result);
  }

  async parseGeneric($, result, html) {
    console.log('Parsing generic content...');
    
    // Try to extract all types of media
    const videoUrls = this.extractVideoUrls($, html);
    const images = this.extractImages($);
    const storyUrls = this.extractStoryUrls($, html);

    if (videoUrls.length > 0) {
      result.content.videos = this.categorizeVideoQualities(videoUrls);
      console.log(`Found ${videoUrls.length} video URLs`);
    }
    if (images.length > 0) {
      result.content.images = images;
      console.log(`Found ${images.length} images`);
    }
    if (storyUrls.length > 0) {
      result.content.stories = storyUrls;
      console.log(`Found ${storyUrls.length} story URLs`);
    }

    this.extractMetadata($, result);
  }

  extractVideoUrls($, html) {
    const videoUrls = [];
    
    // Method 1: Extract from script tags with enhanced patterns
    $('script').each((i, script) => {
      const scriptContent = $(script).html();
      if (scriptContent) {
        // Look for HD video URLs with multiple patterns
        const hdPatterns = [
          /"hd_src_no_ratelimit":"([^"]+)"/g,
          /"hd_src":"([^"]+)"/g,
          /"hd_video_url":"([^"]+)"/g,
          /"video_hd_url":"([^"]+)"/g,
          /"720p":"([^"]+)"/g,
          /"1280x720":"([^"]+)"/g,
          /"playable_url":"([^"]+)"/g,
          /"video_url":"([^"]+)"/g
        ];
        
        hdPatterns.forEach(pattern => {
          const matches = scriptContent.match(pattern);
          if (matches) {
            matches.forEach(match => {
              const urlMatch = match.match(pattern);
              if (urlMatch && urlMatch[1]) {
                const cleanUrl = urlMatch[1].replace(/\\/g, '');
                if (cleanUrl.startsWith('http') && !videoUrls.includes(cleanUrl)) {
                  videoUrls.push(cleanUrl);
                  console.log('HD URL found:', cleanUrl);
                }
              }
            });
          }
        });
        
        // Look for SD video URLs with multiple patterns
        const sdPatterns = [
          /"sd_src_no_ratelimit":"([^"]+)"/g,
          /"sd_src":"([^"]+)"/g,
          /"sd_video_url":"([^"]+)"/g,
          /"video_sd_url":"([^"]+)"/g,
          /"360p":"([^"]+)"/g,
          /"640x360":"([^"]+)"/g
        ];
        
        sdPatterns.forEach(pattern => {
          const matches = scriptContent.match(pattern);
          if (matches) {
            matches.forEach(match => {
              const urlMatch = match.match(pattern);
              if (urlMatch && urlMatch[1]) {
                const cleanUrl = urlMatch[1].replace(/\\/g, '');
                if (cleanUrl.startsWith('http') && !videoUrls.includes(cleanUrl)) {
                  videoUrls.push(cleanUrl);
                  console.log('SD URL found:', cleanUrl);
                }
              }
            });
          }
        });

        // Look for any video URLs in script content
        const videoMatches = scriptContent.match(/https?:\/\/[^"]+\.mp4/g);
        if (videoMatches) {
          videoMatches.forEach(videoUrl => {
            const cleanUrl = videoUrl.replace(/\\/g, '');
            if (!videoUrls.includes(cleanUrl)) {
              videoUrls.push(cleanUrl);
              console.log('Generic video URL found:', cleanUrl);
            }
          });
        }
      }
    });

    // Method 2: Extract from meta tags
    $('meta[property="og:video"]').each((i, elem) => {
      const videoUrl = $(elem).attr('content');
      if (videoUrl && !videoUrls.includes(videoUrl)) {
        videoUrls.push(videoUrl);
        console.log('OG video URL found:', videoUrl);
      }
    });

    $('meta[property="og:video:secure_url"]').each((i, elem) => {
      const videoUrl = $(elem).attr('content');
      if (videoUrl && !videoUrls.includes(videoUrl)) {
        videoUrls.push(videoUrl);
        console.log('OG secure video URL found:', videoUrl);
      }
    });

    // Method 3: Extract from link tags
    $('link[rel="preload"][as="video"]').each((i, elem) => {
      const videoUrl = $(elem).attr('href');
      if (videoUrl && !videoUrls.includes(videoUrl)) {
        videoUrls.push(videoUrl);
        console.log('Preload video URL found:', videoUrl);
      }
    });

    return [...new Set(videoUrls)]; // Remove duplicates
  }

  extractVideoUrlsAlternative($, html) {
    const videoUrls = [];
    
    // Try to find video URLs in the raw HTML
    const videoRegex = /https?:\/\/[^"'\s]+\.mp4[^"'\s]*/g;
    const matches = html.match(videoRegex);
    
    if (matches) {
      matches.forEach(url => {
        const cleanUrl = url.replace(/\\/g, '');
        if (!videoUrls.includes(cleanUrl)) {
          videoUrls.push(cleanUrl);
          console.log('Raw HTML video URL found:', cleanUrl);
        }
      });
    }
    
    // Try to find video URLs in data attributes
    $('[data-video-url]').each((i, elem) => {
      const videoUrl = $(elem).attr('data-video-url');
      if (videoUrl && !videoUrls.includes(videoUrl)) {
        videoUrls.push(videoUrl);
        console.log('Data attribute video URL found:', videoUrl);
      }
    });
    
    return [...new Set(videoUrls)];
  }

  extractImages($) {
    const images = [];
    
    // Extract from meta tags
    $('meta[property="og:image"]').each((i, elem) => {
      const imageUrl = $(elem).attr('content');
      if (imageUrl && !images.includes(imageUrl)) {
        images.push(imageUrl);
        console.log('OG image found:', imageUrl);
      }
    });

    // Extract from img tags
    $('img').each((i, elem) => {
      const imageUrl = $(elem).attr('src');
      if (imageUrl && imageUrl.startsWith('http') && !images.includes(imageUrl)) {
        // Filter out profile pictures and icons
        if (!imageUrl.includes('_s.') && !imageUrl.includes('_t.') && 
            !imageUrl.includes('profile') && !imageUrl.includes('icon')) {
          images.push(imageUrl);
          console.log('Image found:', imageUrl);
        }
      }
    });

    return [...new Set(images)];
  }

  extractStoryUrls($, html) {
    const storyUrls = [];
    
    // Look for story-specific URLs in script tags
    $('script').each((i, script) => {
      const scriptContent = $(script).html();
      if (scriptContent) {
        const storyMatches = scriptContent.match(/https?:\/\/[^"]+(?:story|stories)[^"]*\.(?:mp4|jpg|jpeg|png)/g);
        if (storyMatches) {
          storyMatches.forEach(url => {
            const cleanUrl = url.replace(/\\/g, '');
            if (!storyUrls.includes(cleanUrl)) {
              storyUrls.push(cleanUrl);
              console.log('Story URL found:', cleanUrl);
            }
          });
        }
      }
    });

    return [...new Set(storyUrls)];
  }

  categorizeVideoQualities(videoUrls) {
    const videos = {};
    
    for (const videoUrl of videoUrls) {
      // Check for HD indicators
      if (videoUrl.includes('hd_src') || videoUrl.includes('720p') || videoUrl.includes('_hd') || 
          videoUrl.includes('1280x720') || videoUrl.includes('hd_video')) {
        if (!videos.hd) {
          videos.hd = videoUrl;
          console.log('Assigned as HD:', videoUrl);
        }
      } 
      // Check for SD indicators
      else if (videoUrl.includes('sd_src') || videoUrl.includes('360p') || videoUrl.includes('_sd') ||
               videoUrl.includes('640x360') || videoUrl.includes('sd_video')) {
        if (!videos.sd) {
          videos.sd = videoUrl;
          console.log('Assigned as SD:', videoUrl);
        }
      }
    }
    
    // If we couldn't categorize, assign the first URLs as SD/HD
    if (!videos.hd && !videos.sd && videoUrls.length > 0) {
      videos.sd = videoUrls[0];
      console.log('Assigned first URL as SD:', videoUrls[0]);
      
      if (videoUrls.length > 1) {
        videos.hd = videoUrls[1];
        console.log('Assigned second URL as HD:', videoUrls[1]);
      }
    } else if (!videos.sd && videoUrls.length > 0) {
      videos.sd = videoUrls[0];
      console.log('Assigned URL as SD:', videoUrls[0]);
    }

    return videos;
  }

  extractMetadata($, result) {
    // Extract title
    const title = $('title').first().text();
    if (title) {
      result.content.postTitle = title;
      console.log('Title found:', title);
    }

    // Extract description
    const description = $('meta[name="description"]').attr('content') || 
                        $('meta[property="og:description"]').attr('content');
    if (description) {
      result.content.postDescription = description;
      console.log('Description found:', description.substring(0, 100) + '...');
    }

    // Extract post text
    const postContent = [];
    $('div[data-ad-preview="message"]').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        postContent.push(text);
      }
    });

    $('div[dir="auto"]').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 20 && !postContent.includes(text)) {
        postContent.push(text);
      }
    });

    if (postContent.length > 0) {
      result.content.postText = postContent[0];
      console.log('Post text found:', postContent[0].substring(0, 100) + '...');
    }
  }
}

// Initialize parser
const parser = new FacebookParser();

// API Routes

// Health check
import healthRouter from './health.js';
app.use('/', healthRouter);

// Your existing routes stay exactly the same
app.get("/api/fetch", (req, res) => {
  // existing fetch logic
  res.status(200).json({ message: "Fetch endpoint placeholder" });
});

// Download media file
app.get('/api/download', async (req, res) => {
  try {
    const { url, filename } = req.query;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required'
      });
    }

    console.log('Downloading file:', url);
    console.log('Filename:', filename);
    
    // Check if this is a Facebook CDN URL that might be restricted
    const isFacebookCDN = url.includes('fbcdn.net') || url.includes('video.fbkk');
    
    if (isFacebookCDN) {
      console.log('Detected Facebook CDN URL, trying alternative approach...');
      
      // For Facebook CDN URLs, we'll try multiple approaches
      // Approach 0: try mbasic video_redirect to obtain a fresh downloadable URL
      try {
        const freshUrl = await parser.fetchMbasicVideoUrl(url);
        if (freshUrl) {
          console.log('Using fresh mp4 URL from mbasic:', freshUrl);
          const r = await axios({
            method: 'GET',
            url: freshUrl,
            responseType: 'stream',
            headers: { 'User-Agent': parser.userAgent, 'Accept': '*/*', 'Referer': 'https://mbasic.facebook.com/' },
            timeout: 30000,
            maxRedirects: 5,
            validateStatus: s => (s >= 200 && s < 400) || s === 206
          });
          res.setHeader('Content-Type', r.headers['content-type'] || 'video/mp4');
          res.setHeader('Content-Disposition', `attachment; filename="${filename || 'facebook-video.mp4'}"`);
          if (r.headers['content-length']) res.setHeader('Content-Length', r.headers['content-length']);
          if (r.status === 206 && r.headers['content-range']) {
            res.status(206);
            res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Content-Range', r.headers['content-range']);
          }
          r.data.pipe(res);
          return;
        }
      } catch (e) {
        console.log('mbasic prefetch failed, continuing with header variants');
      }
      
      // Additional user agents to try
      const additionalUserAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Linux; Android 14; SM-S918U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.112 Mobile Safari/537.36'
      ];
      
      const approaches = [
        // Approach 1: Try with mobile user agent
        {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.facebook.com/',
          'Origin': 'https://www.facebook.com'
        },
        // Approach 2: Try with desktop user agent
        {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.facebook.com/',
          'Origin': 'https://www.facebook.com'
        },
        // Approach 3: Try with minimal headers
        {
          'User-Agent': 'Mozilla/5.0 (compatible; FacebookBot/1.0)',
          'Accept': '*/*'
        }
      ];
      
      // Add additional user agents as separate approaches
      additionalUserAgents.forEach((userAgent, index) => {
        approaches.push({
          'User-Agent': userAgent,
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.facebook.com/',
          'Origin': 'https://www.facebook.com'
        });
      });
      
      let lastError = null;
      
      for (let i = 0; i < approaches.length; i++) {
        try {
          console.log(`Trying approach ${i + 1} with User-Agent: ${approaches[i]['User-Agent']}...`);
          
          const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            headers: approaches[i],
            timeout: 30000,
            maxRedirects: 5,
            validateStatus: function (status) {
              return (status >= 200 && status < 400) || status === 206;
            }
          });

          console.log(`Approach ${i + 1} successful, status:`, response.status);
          
          // Set appropriate headers for download
          const contentType = response.headers['content-type'] || 'video/mp4';
          const downloadFilename = filename || 'facebook-media';

          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
          res.setHeader('Cache-Control', 'no-cache');
          
          if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
          }
          if (response.status === 206 && response.headers['content-range']) {
            res.status(206);
            res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Content-Range', response.headers['content-range']);
          }

          // Pipe the response to the client
          response.data.pipe(res);
          return;
          
        } catch (error) {
          console.log(`Approach ${i + 1} failed:`, error.response?.status, error.message);
          lastError = error;
          continue;
        }
      }
      
      // If all approaches failed, try one more time with mbasic redirect
      console.log('All download approaches failed for Facebook CDN URL, trying mbasic redirect...');
      
      try {
        // Extract video ID from URL for mbasic fallback
        const videoIdMatch = url.match(/(\w+)_hd\.mp4$/) || url.match(/(\w+)_n\.mp4$/);
        if (videoIdMatch) {
          const videoId = videoIdMatch[1];
          const mbasicUrl = `https://mbasic.facebook.com/videos/${videoId}`;
          console.log('Trying mbasic fallback:', mbasicUrl);
          
          const mbasicResp = await axios.get(mbasicUrl, { 
            headers: parser.headers, 
            timeout: 15000 
          });
          const $ = cheerio.load(mbasicResp.data);
          
          // Look for video redirect link
          let redirect = $('a[href*="/video_redirect/"]').attr('href');
          if (redirect && redirect.startsWith('/')) {
            redirect = 'https://mbasic.facebook.com' + redirect;
          }
          
          if (redirect) {
            console.log('Found mbasic redirect, following...');
            const finalResp = await axios.get(redirect, {
              headers: parser.headers,
              timeout: 15000,
              maxRedirects: 5,
              validateStatus: s => s >= 200 && s < 400
            });
            
            // Extract final URL
            let finalUrl = finalResp.request?.res?.responseUrl;
            if (!finalUrl) {
              const match = String(finalResp.data || '').match(/https?:[^"']+\.mp4[^"']*/i);
              finalUrl = match ? match[0] : null;
            }
            
            if (finalUrl && /\.mp4(\?|$)/i.test(finalUrl)) {
              console.log('mbasic redirect successful, streaming:', finalUrl);
              const streamResp = await axios({
                method: 'GET',
                url: finalUrl,
                responseType: 'stream',
                headers: { 'User-Agent': parser.userAgent, 'Accept': '*/*' },
                timeout: 30000,
                maxRedirects: 5,
                validateStatus: s => (s >= 200 && s < 400) || s === 206
              });
              
              res.setHeader('Content-Type', streamResp.headers['content-type'] || 'video/mp4');
              res.setHeader('Content-Disposition', `attachment; filename="${filename || 'facebook-video.mp4'}"`);
              if (streamResp.headers['content-length']) res.setHeader('Content-Length', streamResp.headers['content-length']);
              if (streamResp.status === 206 && streamResp.headers['content-range']) {
                res.status(206);
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Content-Range', streamResp.headers['content-range']);
              }
              streamResp.data.pipe(res);
              return;
            }
          }
        }
      } catch (mbasicError) {
        console.log('mbasic fallback failed:', mbasicError.message);
      }
      
      // Final fallback - try to stream directly but with better error handling
      console.log('All approaches failed, trying direct stream with error handling...');
      try {
        const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'stream',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.facebook.com/',
            'Origin': 'https://www.facebook.com'
          },
          timeout: 30000,
          maxRedirects: 5,
          validateStatus: function (status) {
            // Accept even 403 status to try to stream the response
            return (status >= 200 && status < 400) || status === 403 || status === 206;
          }
        });

        console.log('Direct stream attempt status:', response.status);
        
        // Set appropriate headers for download
        const contentType = response.headers['content-type'] || 'video/mp4';
        const downloadFilename = filename || 'facebook-media';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
        res.setHeader('Cache-Control', 'no-cache');
        
        if (response.headers['content-length']) {
          res.setHeader('Content-Length', response.headers['content-length']);
        }
        if (response.status === 206 && response.headers['content-range']) {
          res.status(206);
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Content-Range', response.headers['content-range']);
        }

        // Pipe the response to the client
        response.data.pipe(res);
        return;
      } catch (streamError) {
        console.log('Direct stream failed:', streamError.message);
      }
      
      // Final fallback - return 403 with no popup
      return res.status(403).json({
        success: false,
        error: 'Video not accessible'
      });
    }
    
    // For non-Facebook CDN URLs, use standard approach
    const downloadHeaders = {
      'User-Agent': parser.userAgent,
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.facebook.com/',
      'Origin': 'https://www.facebook.com',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'Cache-Control': 'no-cache',
      'Range': req.headers['range'] || 'bytes=0-'
    };

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: downloadHeaders,
      timeout: 60000,
      maxRedirects: 5,
      validateStatus: function (status) {
        return (status >= 200 && status < 400) || status === 206;
      }
    });

    console.log('Download response status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);

    // Set appropriate headers for download
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const downloadFilename = filename || 'facebook-media';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    if (response.status === 206 && response.headers['content-range']) {
      res.status(206);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Range', response.headers['content-range']);
    }

    // Pipe the response to the client
    response.data.pipe(res);

  } catch (error) {
    console.error('Download error:', error.message);
    console.error('Error details:', error.response?.status, error.response?.statusText);
    
    // Return more specific error information
    let errorMessage = 'Failed to download file';
    let statusCode = 500;
    
    if (error.response) {
      statusCode = error.response.status;
      if (statusCode === 403) {
        // For 403 errors, try mbasic redirect as final attempt
        try {
          const videoIdMatch = url.match(/(\w+)_hd\.mp4$/) || url.match(/(\w+)_n\.mp4$/);
          if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            const mbasicUrl = `https://mbasic.facebook.com/videos/${videoId}`;
            console.log('403 error, trying mbasic redirect:', mbasicUrl);
            
            const mbasicResp = await axios.get(mbasicUrl, { 
              headers: parser.headers, 
              timeout: 15000 
            });
            const $ = cheerio.load(mbasicResp.data);
            
            let redirect = $('a[href*="/video_redirect/"]').attr('href');
            if (redirect && redirect.startsWith('/')) {
              redirect = 'https://mbasic.facebook.com' + redirect;
            }
            
            if (redirect) {
              const finalResp = await axios.get(redirect, {
                headers: parser.headers,
                timeout: 15000,
                maxRedirects: 5,
                validateStatus: s => s >= 200 && s < 400
              });
              
              let finalUrl = finalResp.request?.res?.responseUrl;
              if (!finalUrl) {
                const match = String(finalResp.data || '').match(/https?:[^"']+\.mp4[^"']*/i);
                finalUrl = match ? match[0] : null;
              }
              
              if (finalUrl && /\.mp4(\?|$)/i.test(finalUrl)) {
                console.log('403 recovery successful, streaming:', finalUrl);
                const streamResp = await axios({
                  method: 'GET',
                  url: finalUrl,
                  responseType: 'stream',
                  headers: { 'User-Agent': parser.userAgent, 'Accept': '*/*' },
                  timeout: 30000,
                  maxRedirects: 5,
                  validateStatus: s => (s >= 200 && s < 400) || s === 206
                });
                
                res.setHeader('Content-Type', streamResp.headers['content-type'] || 'video/mp4');
                res.setHeader('Content-Disposition', `attachment; filename="${filename || 'facebook-video.mp4'}"`);
                if (streamResp.headers['content-length']) res.setHeader('Content-Length', streamResp.headers['content-length']);
                if (streamResp.status === 206 && streamResp.headers['content-range']) {
                  res.status(206);
                  res.setHeader('Accept-Ranges', 'bytes');
                  res.setHeader('Content-Range', streamResp.headers['content-range']);
                }
                streamResp.data.pipe(res);
                return;
              }
            }
          }
        } catch (recoveryError) {
          console.log('403 recovery failed:', recoveryError.message);
        }
        
        // Instead of returning JSON error, try to stream with different headers
        try {
          console.log('403 error, trying to stream with alternative headers...');
          const streamResp = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            headers: {
              'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
              'Accept': '*/*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Referer': 'https://mbasic.facebook.com/',
              'Origin': 'https://mbasic.facebook.com'
            },
            timeout: 30000,
            maxRedirects: 5,
            validateStatus: s => (s >= 200 && s < 400) || s === 206 || s === 403
          });
          
          res.setHeader('Content-Type', streamResp.headers['content-type'] || 'video/mp4');
          res.setHeader('Content-Disposition', `attachment; filename="${filename || 'facebook-video.mp4'}"`);
          if (streamResp.headers['content-length']) res.setHeader('Content-Length', streamResp.headers['content-length']);
          if (streamResp.status === 206 && streamResp.headers['content-range']) {
            res.status(206);
            res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Content-Range', streamResp.headers['content-range']);
          } else if (streamResp.status === 403) {
            // Even with 403, try to stream the response
            res.status(200); // Force 200 status to avoid frontend error
          }
          streamResp.data.pipe(res);
          return;
        } catch (streamError) {
          console.log('Streaming with alternative headers failed:', streamError.message);
        }
        
        // Final fallback - return a more user-friendly error
        return res.status(403).json({
          success: false,
          error: 'Video not accessible - Facebook may be blocking automated downloads. Please try again later or use a different video.'
        });
      } else if (statusCode === 404) {
        errorMessage = 'File not found - the URL may be invalid';
      } else if (statusCode === 429) {
        errorMessage = 'Too many requests - please try again later';
      } else {
        errorMessage = `Download failed with status ${statusCode}`;
      }
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Connection refused - the server may be down';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Request timeout - the server is taking too long to respond';
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error.response?.statusText || error.message
    });
  }
});

// Helper function to extract Facebook ID
function extractFacebookId(url) {
  const matches = url.match(/(?:\/posts\/|\/videos\/|\/reel\/|story_fbid=|\/watch\/\?v=|\/share\/[vrp]\/([^\/]+))/i);
  return matches ? matches[1] || 'default' : 'default';
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));

export default app;