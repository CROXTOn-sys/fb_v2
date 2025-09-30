"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Globe, Link, ChevronDown, Sun, Moon, Clipboard, Play } from "lucide-react"
import NextLink from "next/link"

// ✅ Use only the environment variable for API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

const languages = [
  { code: "en", name: "English", displayName: "English" },
  { code: "es", name: "Spanish", displayName: "Español" },
  { code: "fr", name: "French", displayName: "Français" },
  { code: "de", name: "German", displayName: "Deutsch" },
  { code: "it", name: "Italian", displayName: "Italiano" },
  { code: "pt", name: "Portuguese", displayName: "Português" },
  { code: "ru", name: "Russian", displayName: "Русский" },
  { code: "ja", name: "Japanese", displayName: "日本語" },
  { code: "ko", name: "Korean", displayName: "한국어" },
  { code: "zh", name: "Chinese", displayName: "中文" },
  { code: "ar", name: "Arabic", displayName: "العربية" },
  { code: "hi", name: "Hindi", displayName: "हिन्दी" },
] as const

const translations = {
  en: {
    appName: "Downloader",
    facebook: "Facebook",
    downloader: "Downloader",
    title: "Facebook Downloader",
    subtitle:
      "Download high quality Facebook Reels, Story, Video and Post. Paste the link below and get download instantly.",
    placeholder: "Paste your URL here",
    download: "Download",
    processing: "Processing...",
    preview: "Preview",
    previewTitle: "Incredible Drone Footage of the Alps",
    previewDescription:
      "A breathtaking journey through the majestic Alpine landscapes, captured by a high-performance drone.",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    copyright: "© 2025 FB Downloader. All rights reserved.",
    contentTypes: {
      Reel: "Reel",
      Story: "Story",
      Video: "Video",
      Post: "Post",
    },
  },
  es: {
    appName: "Downloader",
    facebook: "Facebook",
    downloader: "Descargador",
    title: "Descargar cualquier contenido de Facebook",
    subtitle:
      "Descarga Reels, Historias, Videos y Publicaciones de Facebook de alta calidad. Pega el enlace a continuación y descarga al instante.",
    placeholder: "Pega tu URL aquí",
    download: "Descargar",
    processing: "Procesando...",
    preview: "Vista previa",
    previewTitle: "Increíbles imágenes de drones de los Alpes",
    previewDescription:
      "Un viaje impresionante a través de los paisajes alpinos majestuosos, capturado por un dron de alto rendimiento.",
    privacyPolicy: "Política de Privacidad",
    termsConditions: "Términos y Condiciones",
    copyright: "© 2025 FB Downloader. Todos los derechos reservados.",
    contentTypes: {
      Reel: "Reel",
      Story: "Historia",
      Video: "Video",
      Post: "Publicación",
    },
  },
  fr: {
    appName: "Downloader",
    facebook: "Facebook",
    downloader: "Téléchargeur",
    title: "Télécharger tout contenu Facebook",
    subtitle:
      "Téléchargez des Reels, Stories, Vidéos et Publications Facebook de haute qualité. Collez le lien ci-dessous et téléchargez instantanément.",
    placeholder: "Collez votre URL ici",
    download: "Télécharger",
    processing: "Traitement...",
    preview: "Aperçu",
    previewTitle: "Images de drone incroyables des Alpes",
    previewDescription:
      "Un voyage à couper le souffle à travers les paysages alpins majestueux, capturé par un drone haute performance.",
    privacyPolicy: "Politique de Confidentialité",
    termsConditions: "Conditions d'utilisation",
    copyright: "© 2025 Facebook Downloader. Tous droits réservés.",
    contentTypes: {
      Reel: "Reel",
      Story: "Story",
      Video: "Vidéo",
      Post: "Publication",
    },
  },
  de: {
    appName: "Downloader",
    facebook: "Facebook",
    downloader: "Downloader",
    title: "Beliebige Facebook-Inhalte herunterladen",
    subtitle:
      "Laden Sie hochwertige Facebook Reels, Stories, Videos und Beiträge herunter. Fügen Sie den Link unten ein und laden Sie sofort herunter.",
    placeholder: "Fügen Sie Ihre URL hier ein",
    download: "Herunterladen",
    processing: "Verarbeitung...",
    preview: "Vorschau",
    previewTitle: "Unglaubliche Drohnenaufnahmen der Alpes",
    previewDescription:
      "Eine atemberaubende Reise durch die majestätischen Alpenlandschaften, aufgenommen von einer Hochleistungsdrohne.",
    privacyPolicy: "Datenschutzrichtlinie",
    termsConditions: "Geschäftsbedingungen",
    copyright: "© 2025 Facebook Downloader. Alle Rechte vorbehalten.",
    contentTypes: {
      Reel: "Reel",
      Story: "Story",
      Video: "Video",
      Post: "Beitrag",
    },
  },
  it: {
    appName: "Downloader",
    facebook: "Facebook",
    downloader: "Downloader",
    title: "Scarica qualsiasi contenuto Facebook",
    subtitle:
      "Scarica Reel, Storie, Video e Post di Facebook di alta qualità. Incolla il link qui sotto e scarica istantaneamente.",
    placeholder: "Incolla il tuo URL qui",
    download: "Scarica",
    processing: "Elaborazione...",
    preview: "Anteprima",
    previewTitle: "Incredibili riprese aeree delle Alpi",
    previewDescription:
      "Un viaggio mozzafiato attraverso i maestosi paesaggi alpini, catturato da un drone ad alte prestazioni.",
    privacyPolicy: "Informativa sulla Privacy",
    termsConditions: "Termini e Condizioni",
    copyright: "© 2025 Facebook Downloader. Tutti i diritti riservati.",
    contentTypes: {
      Reel: "Reel",
      Story: "Story",
      Video: "Vidéo",
      Post: "Post",
    },
  },
  pt: {
    appName: "Downloader",
    facebook: "Facebook",
    downloader: "Downloader",
    title: "Baixar qualquer conteúdo do Facebook",
    subtitle:
      "Baixe Reels, Stories, Vídeos e Posts do Facebook de alta qualidade. Cole o link abaixo e baixe instantaneamente.",
    placeholder: "Cole sua URL aqui",
    download: "Baixar",
    processing: "Processando...",
    preview: "Visualização",
    previewTitle: "Imagens incríveis de drone dos Alpes",
    previewDescription:
      "Uma jornada de tirar o fôlego pelas majestosas paisagens alpinas, capturada por um drone de alto desempenho.",
    privacyPolicy: "Política de Privacidade",
    termsConditions: "Termos e Condições",
    copyright: "© 2025 Facebook Downloader. Todos os direitos reservados.",
    contentTypes: {
      Reel: "Reel",
      Story: "Story",
      Video: "Vídeo",
      Post: "Post",
    },
  },
  ru: {
    appName: "Downloader",
    facebook: "Фейсбук",
    downloader: "Загрузчик",
    title: "Скачать любой контент Facebook",
    subtitle:
      "Скачивайте высококачественные Reels, Stories, видео и посты Facebook. Вставьте ссылку ниже и скачайте мгновенно.",
    placeholder: "Вставьте вашу ссылку здесь",
    download: "Скачать",
    processing: "Обработка...",
    preview: "Предпросмотр",
    previewTitle: "Невероятные кадры Альп с дрона",
    previewDescription:
      "Захватывающее путешествие по величественным альпийским пейзажам, снятое высокопроизводительным дроном.",
    privacyPolicy: "Политика конфиденциальности",
    termsConditions: "Условия использования",
    copyright: "© 2025 Facebook Downloader. Все права защищены.",
    contentTypes: {
      Reel: "Рил",
      Story: "История",
      Video: "Видео",
      Post: "Пост",
    },
  },
  ja: {
    appName: "Downloader",
    facebook: "フェイスブック",
    downloader: "ダウンローダー",
    title: "あらゆるFacebookコンテンツをダウンロード",
    subtitle:
      "高品質のFacebookリール、ストーリー、動画、投稿をダウンロード。下にリンクを貼り付けて即座にダウンロード。",
    placeholder: "URLをここに貼り付け",
    download: "ダウンロード",
    processing: "処理中...",
    preview: "プレビュー",
    previewTitle: "アルプスの素晴らしいドローン映像",
    previewDescription: "高性能ドローンで撮影された雄大なアルプスの風景を通る息をのむような旅。",
    privacyPolicy: "プライバシーポリシー",
    termsConditions: "利用規約",
    copyright: "© 2025 Facebook Downloader. 全著作権所有。",
    contentTypes: {
      Reel: "リール",
      Story: "ストーリー",
      Video: "動画",
      Post: "投稿",
    },
  },
  ko: {
    appName: "Downloader",
    facebook: "페이스북",
    downloader: "다운로더",
    title: "모든 Facebook 콘텐츠 다운로드",
    subtitle:
      "고품질 Facebook 릴, 스토리, 비디오 및 게시물을 다운로드하세요. 아래에 링크를 붙여넣고 즉시 다운로드하세요.",
    placeholder: "URL을 여기에 붙여넣기",
    download: "다운로드",
    processing: "처리 중...",
    preview: "미리보기",
    previewTitle: "알프스의 놅라운 드론 영상",
    previewDescription: "고성능 드론으로 촬영한 장엄한 알프스 풍경을 통한 숨막히는 여행.",
    privacyPolicy: "개인정보 보호정책",
    termsConditions: "이용약관",
    copyright: "© 2025 Facebook Downloader. 모든 권리 보유.",
    contentTypes: {
      Reel: "릴",
      Story: "스토리",
      Video: "비디오",
      Post: "게시물",
    },
  },
  zh: {
    appName: "Downloader",
    facebook: "脸书",
    downloader: "下载器",
    title: "下载任何Facebook内容",
    subtitle: "下载高质量的Facebook短视频、故事、视频和帖子。在下方粘贴链接并立即下载。",
    placeholder: "在此粘贴您的网址",
    download: "下载",
    processing: "处理中...",
    preview: "预览",
    previewTitle: "阿尔卑斯山令人难以置信的无人机镜头",
    previewDescription: "通过高性能无人机捕捉的穿越雄伟阿尔卑斯山景观的令人叹为观止的旅程。",
    privacyPolicy: "隐私政策",
    termsConditions: "条款和条件",
    copyright: "© 2025 Facebook Downloader. 保留所有权利。",
    contentTypes: {
      Reel: "短视频",
      Story: "故事",
      Video: "视频",
      Post: "帖子",
    },
  },
  ar: {
    appName: "Downloader",
    facebook: "فيسبوك",
    downloader: "التنزيل",
    title: "تحميل أي محتوى من فيسبوك",
    subtitle:
      "قم بتحميل مقاطع الريلز والقصص والفيديوهات والمنشورات عالية الجودة من فيسبوك. الصق الرابط أدناه وحمل فوراً.",
    placeholder: "الصق رابطك هنا",
    download: "تحميل",
    processing: "جاري المعالجة...",
    preview: "معاينة",
    previewTitle: "لقطات مذهلة بالطائرة المسيرة لجبال الألب",
    previewDescription: "رحلة خلابة عبر المناظر الطبيعية الجبلية المهيبة، تم التقاطها بواسطة طائرة مسيرة عالية الأداء.",
    privacyPolicy: "سياسة الخصوصية",
    termsConditions: "الشروط والأحكام",
    copyright: "© 2025 Facebook Downloader. جميع الحقوق محفوظة.",
    contentTypes: {
      Reel: "ريلز",
      Story: "قصة",
      Video: "فيديو",
      Post: "منشور",
    },
  },
  hi: {
    appName: "Downloader",
    facebook: "फेसबुक",
    downloader: "डाउनलोडर",
    title: "कोई भी Facebook सामग्री डाउनलोड करें",
    subtitle: "उच्च गुणवत्ता वाले Facebook रील्स, स्टोरी, वीडियो और पोस्ट डाउनलोड करें। नीचे लिंक पेस्ट करें और तुरंत डाउनलोड करें।",
    placeholder: "अपना URL यहाँ पेस्ट करें",
    download: "डाउनलोड",
    processing: "प्रसंस्करण...",
    preview: "पूर्वावलोकन",
    previewTitle: "आल्प्स की अविश्वसनीय ड्रोन फुटेज",
    previewDescription: "उच्च प्रदर्शन ड्रोन द्वारा कैप्चर किए गए राजसी अल्पाइन परिदृश्यों के माध्यम से एक लुभावनी यात्रा।",
    privacyPolicy: "गोपनीयता नीति",
    termsConditions: "नियम और शर्तें",
    copyright: "© 2025 Facebook Downloader. सभी अधिकार सुरक्षित।",
    contentTypes: {
      Reel: "रील",
      Story: "स्टोरी",
      Video: "वीडियो",
      Post: "पोस्ट",
    },
  },
} as const

export default function FacebookDownloader() {
  const [activeTab, setActiveTab] = useState("Reel")
  const [url, setUrl] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isPasting, setIsPasting] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [inputError, setInputError] = useState(false)
  const [errorPlaceholder, setErrorPlaceholder] = useState<string | null>(null)
  
  // Determine API base (now using relative paths for API routes)
  function getApiBase() {
    // Always return empty string since we're using relative paths for API routes
    return '';
  }

  // Helper function to detect content type from URL
  function detectContentTypeFromUrl(url: string): string {
    const lowerUrl = url.toLowerCase();
    // Reel patterns
    if (lowerUrl.includes('/share/r/')) return 'reel';
    if (lowerUrl.includes('/reel/')) return 'reel';
    
    // Video patterns
    if (lowerUrl.includes('/share/v/')) return 'video';
    if (lowerUrl.includes('/video/')) return 'video';
    if (lowerUrl.includes('/videos/')) return 'video';
    if (lowerUrl.includes('/watch/')) return 'video';
    
    // Post patterns
    if (lowerUrl.includes('/share/p/')) return 'post';
    if (lowerUrl.includes('/posts/')) return 'post';
    
    // Story patterns
    if (lowerUrl.includes('/share/s/') || lowerUrl.includes('/stories/')) return 'story';
    if (lowerUrl.includes('/story/')) return 'story';
    
    return 'post';
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      // Optional: could show a toast later
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  // Robust preview generation with multiple fallbacks
  async function generatePreview(url: string, apiBase: string) {
    const contentType = detectContentTypeFromUrl(url)
    
    // Method 1: Try your existing preview API first
    try {
      const previewRes = await fetch(`${API_BASE}/api/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      
      if (previewRes.ok) {
        const result = await previewRes.json()
        // For Reels and Videos, prioritize actual video sources
        if ((contentType === 'reel' || contentType === 'video') && result.preview?.videoUrl) {
          console.log("Using API video preview")
          return result
        }
        // For Posts, use Open Graph images
        if (contentType === 'post' && result.preview?.previewImage) {
          console.log("Using API post preview")
          return result
        }
        // Fallback for other content types
        if (result.preview?.previewImage && !result.preview.fallback) {
          console.log("Using API preview")
          return result
        }
      }
    } catch (error) {
      console.log("API preview failed, trying alternatives...")
    }

    // Method 2: Generate from Facebook URL patterns
    const fbPreview = generateFacebookPreview(url, contentType)
    if (fbPreview) {
      console.log("Using Facebook URL pattern preview")
      return fbPreview
    }

    // Method 3: Use screenshot service (with rotation for reliability)
    const screenshotServices = [
      `https://api.screenshotone.com/take?access_key=demo&url=${encodeURIComponent(url)}&viewport_width=800&viewport_height=600&device_scale_factor=1&format=jpg&image_quality=80&block_ads=true`,
      `https://htmlcsstoimage.com/demo_run?url=${encodeURIComponent(url)}&width=800&height=600`,
      `https://api.urlbox.io/v1/demo/png?url=${encodeURIComponent(url)}&width=800&height=600`
    ]

    const randomService = screenshotServices[Math.floor(Math.random() * screenshotServices.length)]
    
    return {
      success: true,
      url: url,
      preview: {
        contentType: contentType,
        previewImage: randomService,
        title: `Facebook ${contentType}`,
        description: `Preview for ${contentType} content`,
        hasVideo: contentType === 'video' || contentType === 'reel',
        hasImage: true,
        fallback: false
      },
      timestamp: new Date().toISOString()
    }
  }

  // Extract Facebook ID and generate preview from known patterns
  function generateFacebookPreview(url: string, contentType: string) {
    try {
      let previewImage = null
      let videoUrl = null
      
      // For videos and reels, try to extract actual video sources
      if (contentType === 'video' || contentType === 'reel') {
        // Extract video ID - support multiple patterns
        let videoIdMatch = url.match(/\/(?:videos|reel)\/(\d+)/);
        if (!videoIdMatch) {
          videoIdMatch = url.match(/\/share\/[rv]\/(\d+)/);
        }
        if (!videoIdMatch) {
          videoIdMatch = url.match(/\/watch\/\?v=(\d+)/);
        }
        
        if (videoIdMatch && videoIdMatch[1]) {
          // Try to construct video URLs using known Facebook patterns
          videoUrl = `https://video.fbkk10-1.fna.fbcdn.net/v/t42.1790-2/${videoIdMatch[1]}_n.mp4`
        }
      }
      
      // For posts, try to extract Open Graph images
      if (contentType === 'post') {
        // Extract post ID - support multiple patterns
        let postIdMatch = url.match(/\/posts\/(\d+)/);
        if (!postIdMatch) {
          postIdMatch = url.match(/\/share\/p\/(\d+)/);
        }
        
        if (postIdMatch && postIdMatch[1]) {
          // Try to construct image URLs using known Facebook patterns
          previewImage = `https://scontent.fbkk10-1.fna.fbcdn.net/v/t1.0-9/${postIdMatch[1]}_n.jpg`
        }
      }
      
      // Extract Facebook post/video ID for fallback - support more patterns
      const fbIdMatch = url.match(/(?:\/posts\/|\/videos\/|\/reel\/|story_fbid=|\/watch\/\?v=|\/share\/[prv]\/)([0-9]+)/i)
      const fbId = fbIdMatch ? fbIdMatch[1] : null

      if (fbId) {
        // Use Facebook's public thumbnail endpoints (these often work)
        const thumbnailUrls = [
          `https://graph.facebook.com/${fbId}/picture?type=large`,
          `https://external-content.duckduckgo.com/iu/?u=https://graph.facebook.com/${fbId}/picture?type=large`
        ]

        if (!previewImage) {
          previewImage = thumbnailUrls[Math.floor(Math.random() * thumbnailUrls.length)]
        }

        return {
          success: true,
          url: url,
          preview: {
            contentType: contentType,
            previewImage: previewImage,
            videoUrl: videoUrl,
            title: `Facebook ${contentType}`,
            description: `Content from Facebook ${contentType}`,
            hasVideo: (contentType === 'video' || contentType === 'reel') && !!videoUrl,
            hasImage: !!previewImage,
            fallback: false
          },
          timestamp: new Date().toISOString()
        }
      }
      
      // Return what we have even if incomplete
      if (previewImage || videoUrl) {
        return {
          success: true,
          url: url,
          preview: {
            contentType: contentType,
            previewImage: previewImage,
            videoUrl: videoUrl,
            title: `Facebook ${contentType}`,
            description: `Content from Facebook ${contentType}`,
            hasVideo: (contentType === 'video' || contentType === 'reel') && !!videoUrl,
            hasImage: !!previewImage,
            fallback: false
          },
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      console.log("Facebook pattern preview failed")
    }
    
    return null
  }


  // Removed animated text effect

  // Strict tab-based URL validation for Facebook share links
  function isValidUrlForTab(rawUrl: string, tab: string) {
    if (!rawUrl) return false
    const u = rawUrl.trim()
    
    // Enhanced validation based on tab type for Facebook share links
    switch (tab) {
      case 'Reel':
        // Accept both share/r/ and /reel/ URLs
        return /https?:\/\/(?:www\.)?facebook\.com\/share\/r\//i.test(u) ||
               /https?:\/\/(?:www\.)?facebook\.com\/reel\//i.test(u)
      case 'Video':
        // Accept both share/v/ and /video/ or /videos/ URLs
        return /https?:\/\/(?:www\.)?facebook\.com\/share\/v\//i.test(u) ||
               /https?:\/\/(?:www\.)?facebook\.com\/video\//i.test(u) ||
               /https?:\/\/(?:www\.)?facebook\.com\/videos\//i.test(u) ||
               /https?:\/\/(?:www\.)?facebook\.com\/watch\//i.test(u)
      case 'Post':
        // Accept both share/p/ and /posts/ URLs
        return /https?:\/\/(?:www\.)?facebook\.com\/share\/p\//i.test(u) ||
               /https?:\/\/(?:www\.)?facebook\.com\/posts\//i.test(u) ||
               /https?:\/\/(?:www\.)?facebook\.com\/.*\/posts\//i.test(u)
      case 'Story':
        return /https?:\/\/(?:www\.)?facebook\.com\/share\/s\//i.test(u) ||
               /https?:\/\/(?:www\.)?facebook\.com\/.*\/stories\//i.test(u) || 
               /https?:\/\/(?:www\.)?facebook\.com\/.*\/story\//i.test(u)
      default:
        // For other cases, ensure it's a Facebook URL
        return /https?:\/\/(?:www\.)?facebook\.com\//i.test(u)
    }
  }

  // Clear URL when tab changes
  useEffect(() => {
    setUrl("")
    setInputError(false)
    setErrorPlaceholder(null)
  }, [activeTab])

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem("language") as string
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setSelectedLanguage(savedLanguage)
    }
    
    // Debug: Log all available languages
    console.log('Available languages:', languages.map(l => `${l.code}: ${l.name}`));
    console.log('Current selected language:', selectedLanguage);
  }, [])

  const handleDownload = async () => {
    if (!url.trim()) return

    // Reset previous states
    setIsLoading(false)
    setInputError(false)
    setErrorPlaceholder(null)
    
    // Validate URL before processing
    if (!isValidUrlForTab(url.trim(), activeTab)) {
      setInputError(true)
      setErrorPlaceholder(`Please paste a valid ${activeTab} URL`)
      return
    }
    
    // Show loading spinner
    setIsLoading(true)
    
    try {
      console.log("Fetching content for:", url.trim())
      
      // Fetch content directly without preview
      const response = await fetch(`${API_BASE}/api/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), desiredType: (activeTab || '').toLowerCase() })
      })
      
      let result: any = null
      try {
        result = await response.json()
      } catch (_) {
        // ignore JSON parse error; will fall back to generic error
      }
      
      if (!response.ok) {
        const message = result?.error || `Request failed (HTTP ${response.status})`
        setInputError(true)
        setErrorPlaceholder(message)
        return
      }
      
      
      if (result.success && result.content) {
        // Direct download based on content type
        await handleDirectDownload(result.content, activeTab)
      } else {
        console.error('Fetch API error:', result)
        setInputError(true)
        setErrorPlaceholder('Failed to fetch content')
      }
    } catch (error) {
      console.error("Download failed:", error)
      setInputError(true)
      setErrorPlaceholder('Failed to fetch content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDirectDownload = async (content: any, contentType: string) => {
    try {
      // Handle post downloads
      if (content.contentType === 'post') {
        if (Array.isArray(content.images) && content.images.length > 0) {
          // Download the first image
          const imageUrl = content.images[0]
          await triggerDownload(imageUrl, 'facebook-post.jpg')
        } else if (content.videos?.sd || content.videos?.hd) {
          // Download video with best available quality
          const videoUrl = content.videos.hd || content.videos.sd
          const filename = content.videos.hd ? 'facebook-post-720p.mp4' : 'facebook-post-360p.mp4'
          await triggerDownload(videoUrl, filename)
        }
        return
      }
      
      // Handle story downloads
      if (content.contentType === 'story') {
        if (Array.isArray(content.stories) && content.stories.length > 0) {
          const storyUrl = content.stories[0]
          const isVideo = /\.(mp4|mov|avi|wmv|flv|webm)/i.test(storyUrl)
          const filename = isVideo ? 'facebook-story.mp4' : 'facebook-story.jpg'
          await triggerDownload(storyUrl, filename)
        } else {
          // Silent fail for stories
        }
        return
      }
      
      // Handle video and reel downloads - try multiple approaches
      if (content.videos?.hd || content.videos?.sd) {
        // Try HD first, then SD
        const videoUrl = content.videos.hd || content.videos.sd
        const quality = content.videos.hd ? '720p' : '360p'
        const filename = `facebook-video-${quality}.mp4`
        
        console.log('Attempting to download video:', videoUrl)
        await triggerDownload(videoUrl, filename)
      } else if (Array.isArray(content.reels) && content.reels.length > 0) {
        await triggerDownload(content.reels[0], 'facebook-reel.mp4')
      } else if (Array.isArray(content.stories) && content.stories.length > 0) {
        const storyUrl = content.stories[0]
        const isVideo = /\.(mp4|mov|avi|wmv|flv|webm)/i.test(storyUrl)
        const filename = isVideo ? 'facebook-story.mp4' : 'facebook-story.jpg'
        await triggerDownload(storyUrl, filename)
      } else if (Array.isArray(content.images) && content.images.length > 0) {
        await triggerDownload(content.images[0], 'facebook-image.jpg')
      } else {
        // No content found - try to download the original URL as fallback
        await triggerDownload(content.url || '', 'facebook-content')
      }
    } catch (error) {
      console.error('Direct download failed:', error)
      // Silent fail - no popups
    }
  }

  async function triggerDownload(mediaUrl: string, suggestedName: string) {
    try {
      // Direct download via proxy
      const proxied = `${API_BASE}/api/download?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(suggestedName)}`;
      
      // Create a temporary anchor element for download
      const anchor = document.createElement('a');
      anchor.href = proxied;
      anchor.download = suggestedName;
      anchor.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      
      // Show success message
      console.log('Download initiated successfully');
    } catch (error) {
      console.error('Download failed:', error);
      // Show user-friendly error message
      alert('Download failed. Please try again or use a different video.');
    }
  }

  const handlePaste = async () => {
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported')
      return
    }

    setIsPasting(true)
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        setUrl(text.trim())
      } else {
        console.error('Clipboard is empty')
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error)
    } finally {
      setIsPasting(false)
    }
  }

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem("language", languageCode)
  }

  const selectedLanguageName = languages.find((lang) => lang.code === selectedLanguage)?.name || "English"
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en
  const contentTypes = Object.keys(t.contentTypes) as Array<keyof typeof t.contentTypes>

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const themeClasses = {
    background: theme === "dark" ? "bg-black" : "bg-white",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    headerBorder: theme === "dark" ? "border-gray-800" : "border-gray-200",
    cardBg: theme === "dark" ? "bg-gray-900" : "bg-gray-50",
    cardBorder: theme === "dark" ? "border-gray-800" : "border-gray-200",
    inputBg: theme === "dark" ? "bg-gray-900" : "bg-white",
    inputBorder: theme === "dark" ? "border-gray-700" : "border-gray-300",
    inputText: theme === "dark" ? "text-white" : "text-gray-900",
    placeholder: theme === "dark" ? "placeholder-gray-500" : "placeholder-gray-500",
    subtitle: theme === "dark" ? "text-gray-300" : "text-gray-600",
    tabsBg: theme === "dark" ? "bg-gray-900" : "bg-gray-100",
    tabsInactive: theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900",
    footerBorder: theme === "dark" ? "border-gray-800" : "border-gray-200",
    footerText: theme === "dark" ? "text-gray-400" : "text-gray-600",
    dropdownBg: theme === "dark" ? "bg-gray-900" : "bg-white",
    dropdownBorder: theme === "dark" ? "border-gray-800" : "border-gray-200",
    dropdownText:
      theme === "dark"
        ? "text-gray-300 hover:text-white hover:bg-gray-800"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
    buttonGhost: theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900",
  } as const

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text} font-sans antialiased`}>
      {/* Add consistent scrollbar behavior */}
      <style jsx global>{`
        /* Ensure scrollbar width is always reserved to prevent UI shifting */
        :root {
          --scrollbar-width: 12px;
        }
        
        html {
          overflow-y: scroll;
          scrollbar-width: thin;
        }
        
        body {
          overflow-y: scroll;
        }
        
        /* Make scrollbar invisible by default (transparent) but reserve space */
        ::-webkit-scrollbar {
          width: var(--scrollbar-width);
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: transparent;
        }
        
        /* Firefox */
        html {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        
        /* For Story tab, completely hide scrollbar while keeping functionality */
        .story-tab-active::-webkit-scrollbar {
          display: none;
        }
        
        .story-tab-active {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Ensure consistent spacing regardless of scrollbar visibility */
        body::-webkit-scrollbar {
          width: var(--scrollbar-width);
        }
      `}</style>
      
      {/* Header */}
      <header className={`flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b ${themeClasses.headerBorder}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-600 rounded transform rotate-45 flex items-center justify-center">
            <Download className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-white -rotate-45" />
          </div>
          <span className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight subpixel-antialiased">
            <span className="text-[#1877F2]">{t.facebook}</span>
            <span className="ml-1">{t.downloader}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`p-1.5 sm:p-2 ${themeClasses.buttonGhost}`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Simple and Reliable Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <select
              value={selectedLanguage}
              onChange={(e) => {
                console.log('Language changed to:', e.target.value);
                handleLanguageChange(e.target.value);
              }}
              className={`${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} text-xs sm:text-sm px-2 py-1 rounded border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer`}
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12 xl:py-16 max-w-7xl`}>
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 lg:mb-4 text-balance leading-tight tracking-tight subpixel-antialiased px-2">
            <span className="text-[#1877F2] font-black">{t.facebook}</span>
            <span className="ml-2">{t.downloader}</span>
          </h1>
          <p
            className={`${themeClasses.subtitle} text-sm sm:text-base lg:text-lg xl:text-xl max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed font-semibold tracking-wide subpixel-antialiased px-2`}
          >
            {t.subtitle}
          </p>
        </div>

        <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8 px-2">
          <div
            className={`flex ${themeClasses.tabsBg} rounded-lg p-0.5 sm:p-1 overflow-x-auto scrollbar-hide w-full max-w-lg sm:max-w-xl lg:max-w-2xl`}
          >
            {contentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex-1 px-4 sm:px-5 lg:px-7 py-2 sm:py-2.5 lg:py-3 rounded-md transition-[background,color,box-shadow] duration-200 whitespace-nowrap text-xs sm:text-sm lg:text-base font-bold tracking-wide subpixel-antialiased touch-manipulation ${
                  activeTab === type 
                    ? "bg-blue-600 text-white shadow-lg border-2 border-white border-opacity-20 shadow-blue-900/25" 
                    : `${themeClasses.tabsInactive} hover:shadow-md`
                }`}
              >
                {t.contentTypes[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Coming Soon Message for Stories */}
        {activeTab === 'Story' && (
          <div className="mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto px-2">
            <Card className={`${themeClasses.cardBg} ${themeClasses.cardBorder} p-6 rounded-xl shadow-lg border-t-4 border-yellow-500 text-center`}>
              <div className="inline-block mb-4">
                <span className="bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-2 rounded-full dark:bg-yellow-900 dark:text-yellow-100">
                  Coming Soon & Under Development
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-4">
                Story Download Feature
              </h2>
              <p className={`${themeClasses.subtitle} text-base sm:text-lg lg:text-xl mb-6 leading-relaxed`}>
                We're currently working on implementing the story download functionality. 
                This feature is under active development and will be available in a future update.
              </p>
              <p className={`${themeClasses.subtitle} text-sm sm:text-base italic`}>
                "Video and Post downloading is working perfectly. Story downloading coming soon!"
              </p>
            </Card>
          </div>
        )}

        {/* Main Download Form (hidden when Story tab is active) */}
        {activeTab !== 'Story' && (
        <div className="mb-8 sm:mb-12 lg:mb-16 max-w-4xl mx-auto px-2">
          <div className="flex gap-2 sm:gap-3 lg:gap-4">
            <div className="relative flex-1">
              <Link
                className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.subtitle} w-4 h-4 sm:w-5 sm:h-5 z-10`}
              />
                <Input
                type="url"
                  placeholder={
                    errorPlaceholder ? errorPlaceholder : (
                    activeTab === 'Video' ? 'Paste your video URL here' :
                    activeTab === 'Reel' ? 'Paste your reel URL here' :
                    activeTab === 'Post' ? 'Paste your post URL here' :
                    t.placeholder)
                  }
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  // Clear error when user starts typing
                  if (inputError) {
                    setInputError(false)
                    setErrorPlaceholder(null)
                  }
                }}
                  className={`pl-10 sm:pl-12 lg:pl-14 pr-14 sm:pr-20 lg:pr-24 ${themeClasses.inputBg} ${themeClasses.inputBorder} ${themeClasses.inputText} ${themeClasses.placeholder} h-11 sm:h-12 lg:h-14 text-sm sm:text-base lg:text-lg font-medium tracking-wide subpixel-antialiased rounded-lg border-2 focus:ring-2 ${inputError ? 'border-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} transition-all`}
              />
              <Button
                onClick={handlePaste}
                disabled={isPasting}
                variant="ghost"
                className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-7 sm:h-8 lg:h-9 px-2 sm:px-3 flex items-center justify-center gap-1 sm:gap-2 transition-all duration-200 rounded-md touch-manipulation bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600 ${isPasting ? 'opacity-50' : ''} z-10`}
              >
                <Clipboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs sm:text-sm font-medium">
                  {isPasting ? 'Pasting...' : 'Paste'}
                </span>
              </Button>
            </div>
            <Button
                onClick={() => handleDownload()}
              disabled={isLoading}
              className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#145DBF] disabled:bg-[#1877F2] disabled:opacity-50 h-11 sm:h-12 lg:h-14 px-3 sm:px-6 lg:px-8 text-xs sm:text-base lg:text-lg font-black flex items-center justify-center gap-1 sm:gap-3 transition-all duration-200 shadow-lg hover:shadow-xl active:shadow-md tracking-wide subpixel-antialiased rounded-lg touch-manipulation whitespace-nowrap min-w-[100px] sm:min-w-[140px] lg:min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm lg:text-base">{t.processing}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm lg:text-base">{t.download}</span>
                </>
              )}
            </Button>
          </div>
          {/* Error message display */}
          {inputError && errorPlaceholder && (
            <div className="mt-2 text-red-500 text-sm font-medium text-center">
              {errorPlaceholder}
            </div>
          )}
          {/* Loading spinner */}
          {isLoading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {/* Private content note */}
          <div className="mt-3 text-center">
            <p className={`text-xs ${themeClasses.subtitle} italic`}>
              Note: Private content cannot be fetched. Make sure the content is publicly accessible.
            </p>
          </div>
        </div>
        )}

      </main>

      <footer className={`border-t ${themeClasses.footerBorder} py-3 sm:py-4 lg:py-6 px-3 sm:px-4 lg:px-6`}>
        <div
          className={`container mx-auto flex flex-col gap-2 sm:gap-3 lg:flex-row lg:justify-between lg:items-center lg:gap-0 text-xs sm:text-sm ${themeClasses.footerText} font-semibold tracking-wide subpixel-antialiased max-w-7xl`}
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-6 order-2 lg:order-1 text-center sm:text-left">
            <NextLink href="/privacy">
              <span className={`${theme === "dark" ? "hover:text-white" : "hover:text-gray-900"} transition-colors touch-manipulation cursor-pointer`}>
                {t.privacyPolicy}
              </span>
            </NextLink>
            <NextLink href="/terms">
              <span className={`${theme === "dark" ? "hover:text-white" : "hover:text-gray-900"} transition-colors touch-manipulation cursor-pointer`}>
                {t.termsConditions}
              </span>
            </NextLink>
          </div>
          <div className="order-1 lg:order-2 text-center">{t.copyright}</div>
        </div>
      </footer>
    </div>
  )
}
