"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Sun, Moon, Globe, ChevronDown } from "lucide-react"
import Link from "next/link"

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
    title: "Privacy Policy",
    backHome: "Back to Home",
    returnToDownloader: "Return to FB Downloader",
    content: `
**1. Quick summary — what we do and what you should know**

We provide a tool that helps users download publicly shared Facebook stories and videos for personal, lawful use. We do not host or claim ownership of content pulled from Facebook or Meta platforms. You are responsible for ensuring you have the right to download or reuse content you fetch using our service. We are not affiliated with Meta or Facebook in any way. This website is for learning purposes only.

-----

**2. Definitions**

"User" means anyone who visits or uses this website. "Service" means the Facebook Story Downloader website and related features and APIs. "Personal data" means any information that can identify you directly or indirectly, such as your IP address, device info, or contact email.

-----

**3. Information we collect**

We don't collect any user data or any technical information. The users are anonymous to us and all the people who visit our site are equivalent. Cookies and similar tracking technologies are used to support functionality and measure usage. If you contact us directly, we may also store the information you provide, such as your name or email address.

-----

**4. Legal basis for processing**

We rely on legitimate interests to maintain the security of the platform, detect and prevent abuse, and analyze usage trends so we can improve the experience. Where required, particularly for non-essential cookies or marketing communication, we rely on your explicit consent.

-----

**5. How we use information**

The information we collect is used solely to operate and safeguard the service while improving your overall experience. It allows us to process downloads and deliver requested content, while also enabling us to detect fraudulent or abusive behavior and keep the system secure. We use the data to troubleshoot technical issues, monitor system performance, and optimize the site's usability. Additionally, usage patterns help us prioritize feature development and improvements. If you contact us with questions or issues, the information you provide will also be used to respond and resolve your request.

-----

**6. Cookies and tracking technologies**

Our service uses cookies and similar tools to ensure smooth functionality and to help us measure and improve performance. Strictly necessary cookies are always active to support essential functions such as downloading. Other cookies, like performance and analytics cookies, functional cookies for remembering settings, and targeting cookies for personalization, are used only when you consent to them. You are in full control of cookies. You may adjust your browser settings to block or delete them, use our consent banner to accept or reject optional cookies, or enable Do Not Track signals, which we honor whenever possible. Please note that disabling certain cookies may reduce site functionality or prevent some downloads from working properly.

-----

**7. Security**

All transmissions between your browser and our servers use encrypted HTTPS connections. Temporary files and processed URLs are deleted according to our retention policies, and we don't access any personal data. We also conduct regular reviews and updates of our security practices. While no system can guarantee complete security, we take every reasonable step to safeguard.

-----

**8. Third-party services and data sharing**

To deliver the service efficiently, we use trusted third-party providers such as analytics tools, cloud hosting services, and content delivery networks. These partners help us analyze site usage, improve performance, and maintain availability. All third-party providers who handle your data on our behalf are required to comply with strict data protection obligations.

-----

**9. Your privacy rights**

Depending on where you live, you may have certain rights concerning your data.

• For example, if you are an EU resident, you may request access to the information we hold about you, ask for corrections, request deletion under the right to be forgotten, limit how your data is processed, or object to processing based on legitimate interests. You also have the right to withdraw your consent at any time and to receive your data in a portable format.

• If you are a California resident, you may request details about the categories and sources of information we collect, ask us to delete your data, opt out of the sale or sharing of personal information, and exercise your rights without being denied equal service.

To exercise any of these rights, simply email us at privacy@facebookdownloader.com or use our contact form. We will respond within the legally required timeframe.

-----

**10. Children's privacy**

Our service is not intended for children under 13 years of age. We do not knowingly collect personal data from anyone we know to be under 13 or any age. If a parent or guardian believes their child has provided personal data to us, contact privacy@facebookdownloader.com and we will promptly delete the data where required.

-----

**11. Law enforcement and legal requests**

We will disclose information when required by law, court order, or a valid government request. We may also disclose data when necessary to prevent imminent harm or to investigate illegal activity.

-----

**12. DMCA and copyright policy**

We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). Because our tool only facilitates access to publicly available Facebook content and does not permanently host or store that content, we do not claim ownership of it. If you believe your copyrighted material has been used improperly, you may submit a DMCA takedown notice to dmca@facebookdownloader.com. Your notice must include your contact details, a description of the copyrighted work, the URL of the allegedly infringing content, a statement made in good faith that the use is unauthorized, and a declaration under penalty of perjury that your claim is accurate. If you believe content was removed in error, you may send us a counter-notification. Once received, we will restore the content unless the original complainant initiates legal action within 10 business days. To protect rights holders, we also maintain a repeat infringer policy under which users who repeatedly violate copyright law may lose access to our service.
    `
  },
  es: {
    title: "Política de Privacidad",
    backHome: "Volver al Inicio",
    returnToDownloader: "Volver al Descargador FB",
    content: `
**1. Resumen rápido — qué hacemos y qué debes saber**

Proporcionamos una herramienta que ayuda a los usuarios a descargar historias y videos de Facebook compartidos públicamente para uso personal y legal. No alojamos ni reclamamos la propiedad del contenido extraído de las plataformas de Facebook o Meta. Eres responsable de asegurar que tienes el derecho de descargar o reutilizar el contenido que obtienes usando nuestro servicio. No estamos afiliados con Meta o Facebook de ninguna manera. Este sitio web es solo para fines de aprendizaje.

-----

**2. Definiciones**

"Usuario" significa cualquier persona que visita o usa este sitio web. "Servicio" significa el sitio web Facebook Story Downloader y las características y APIs relacionadas. "Datos personales" significa cualquier información que puede identificarte directa o indirectamente, como tu dirección IP, información del dispositivo o email de contacto.

-----

**3. Información que recolectamos**

No recolectamos ningún dato de usuario o información técnica. Los usuarios son anónimos para nosotros y todas las personas que visitan nuestro sitio son equivalentes. Las cookies y tecnologías de seguimiento similares se usan para apoyar la funcionalidad y medir el uso. Si nos contactas directamente, también podemos almacenar la información que proporcionas, como tu nombre o dirección de email.

-----

**4. Base legal para el procesamiento**

Nos basamos en intereses legítimos para mantener la seguridad de la plataforma, detectar y prevenir abusos, y analizar tendencias de uso para poder mejorar la experiencia. Donde se requiere, particularmente para cookies no esenciales o comunicación de marketing, nos basamos en tu consentimiento explícito.

-----

**5. Cómo usamos la información**

La información que recolectamos se usa únicamente para operar y proteger el servicio mientras mejoramos tu experiencia general. Nos permite procesar descargas y entregar contenido solicitado, mientras también nos permite detectar comportamiento fraudulento o abusivo y mantener el sistema seguro. Usamos los datos para solucionar problemas técnicos, monitorear el rendimiento del sistema y optimizar la usabilidad del sitio. Además, los patrones de uso nos ayudan a priorizar el desarrollo de características y mejoras. Si nos contactas con preguntas o problemas, la información que proporciones también se usará para responder y resolver tu solicitud.
    `
  },
  fr: {
    title: "Politique de confidentialité",
    backHome: "Retour à l'accueil",
    returnToDownloader: "Retour au Téléchargeur FB",
    content: `
**1. Résumé rapide — ce que nous faisons et ce que vous devez savoir**

Nous fournissons un outil qui aide les utilisateurs à télécharger des stories et vidéos Facebook partagées publiquement pour un usage personnel et légal. Nous n'hébergeons pas et ne revendiquons pas la propriété du contenu extrait des plateformes Facebook ou Meta. Vous êtes responsable de vous assurer que vous avez le droit de télécharger ou de réutiliser le contenu que vous obtenez en utilisant notre service. Nous ne sommes affiliés à Meta ou Facebook d'aucune manière. Ce site web est à des fins d'apprentissage uniquement.

-----

**2. Définitions**

"Utilisateur" signifie toute personne qui visite ou utilise ce site web. "Service" signifie le site web Facebook Story Downloader et les fonctionnalités et API associées. "Données personnelles" signifie toute information qui peut vous identifier directement ou indirectement, comme votre adresse IP, informations sur l'appareil ou email de contact.

-----

**3. Informations que nous collectons**

Nous ne collectons aucune donnée utilisateur ou information technique. Les utilisateurs sont anonymes pour nous et toutes les personnes qui visitent notre site sont équivalentes. Les cookies et technologies de suivi similaires sont utilisés pour soutenir la fonctionnalité et mesurer l'utilisation.

-----

**4. Base légale pour le traitement**

Nous nous appuyons sur des intérêts légitimes pour maintenir la sécurité de la plateforme, détecter et prévenir les abus, et analyser les tendances d'utilisation.

-----

**5. Comment nous utilisons les informations**

Les informations que nous collectons sont utilisées uniquement pour faire fonctionner et protéger le service tout en améliorant votre expérience globale.
    `
  },
  de: {
    title: "Datenschutzrichtlinie",
    backHome: "Zurück zur Startseite",
    returnToDownloader: "Zurück zum FB Downloader",
    content: `
**1. Kurze Zusammenfassung — was wir tun und was Sie wissen sollten**

Wir stellen ein Tool zur Verfügung, das Benutzern hilft, öffentlich geteilte Facebook-Stories und -Videos für den persönlichen, rechtmäßigen Gebrauch herunterzuladen. Wir hosten nicht und beanspruchen keine Eigentumsrechte an Inhalten, die von Facebook- oder Meta-Plattformen abgerufen werden. Sie sind dafür verantwortlich sicherzustellen, dass Sie das Recht haben, Inhalte herunterzuladen oder wiederzuverwenden, die Sie mit unserem Service abrufen. Wir sind in keiner Weise mit Meta oder Facebook verbunden. Diese Website dient nur Lernzwecken.

-----

**2. Definitionen**

"Benutzer" bedeutet jeder, der diese Website besucht oder nutzt. "Service" bedeutet die Facebook Story Downloader Website und verwandte Funktionen und APIs. "Persönliche Daten" bedeutet alle Informationen, die Sie direkt oder indirekt identifizieren können, wie Ihre IP-Adresse, Geräteinformationen oder Kontakt-E-Mail.
    `
  },
  it: {
    title: "Informativa sulla Privacy",
    backHome: "Torna alla Home",
    returnToDownloader: "Torna al Scaricatore FB",
    content: `
**1. Riassunto rapido — cosa facciamo e cosa dovresti sapere**

Forniamo uno strumento che aiuta gli utenti a scaricare storie e video di Facebook condivisi pubblicamente per uso personale e legale. Non ospitiamo e non rivendichiamo la proprietà del contenuto estratto dalle piattaforme Facebook o Meta.
    `
  },
  pt: {
    title: "Política de Privacidade",
    backHome: "Voltar ao Início",
    returnToDownloader: "Voltar ao Downloader FB",
    content: `
**1. Resumo rápido — o que fazemos e o que você deve saber**

Fornecemos uma ferramenta que ajuda os usuários a baixar stories e vídeos do Facebook compartilhados publicamente para uso pessoal e legal.
    `
  },
  ru: {
    title: "Политика конфиденциальности",
    backHome: "Назад на главную",
    returnToDownloader: "Вернуться к FB Downloader",
    content: `
**1. Краткое резюме — что мы делаем и что вы должны знать**

Мы предоставляем инструмент, который помогает пользователям загружать общедоступные истории и видео Facebook для личного и законного использования.
    `
  },
  ja: {
    title: "プライバシーポリシー",
    backHome: "ホームに戻る",
    returnToDownloader: "FB ダウンローダーに戻る",
    content: `
**1. 概要 — 私たちが行うことと知っておくべきこと**

個人的で合法的な使用のために、公開共有されたFacebookストーリーと動画をダウンロードするツールを提供しています。
    `
  },
  ko: {
    title: "개인정보 처리방침",
    backHome: "홈으로 돌아가기",
    returnToDownloader: "FB 다운로더로 돌아가기",
    content: `
**1. 간단한 요약 — 우리가 하는 일과 알아야 할 것**

개인적이고 합법적인 사용을 위해 공개적으로 공유된 Facebook 스토리와 동영상을 다운로드하는 도구를 제공합니다.
    `
  },
  zh: {
    title: "隐私政策",
    backHome: "返回首页",
    returnToDownloader: "返回 FB 下载器",
    content: `
**1. 快速摘要 — 我们做什么以及您应该知道什么**

我们提供一个工具，帮助用户下载公开共享的Facebook故事和视频，用于个人和合法用途。
    `
  },
  ar: {
    title: "سياسة الخصوصية",
    backHome: "العودة للرئيسية",
    returnToDownloader: "العودة إلى منزل FB",
    content: `
**1. ملخص سريع — ما نفعله وما يجب أن تعرفه**

نحن نقدم أداة تساعد المستخدمين على تنزيل قصص وفيديوهات الفيسبوك المشتركة علناً للاستخدام الشخصي والقانوني.
    `
  },
  hi: {
    title: "गोपनीयता नीति",
    backHome: "होम पर वापस",
    returnToDownloader: "FB डाउनलोडर पर वापस",
    content: `
**1. त्वरित सारांश — हम क्या करते हैं और आपको क्या जानना चाहिए**

हम एक उपकरण प्रदान करते हैं जो उपयोगकर्ताओं को व्यक्तिगत और कानूनी उपयोग के लिए सार्वजनिक रूप से साझा की गई Facebook कहानियों और वीडियो को डाउनलोड करने में मदद करता है।
    `
  }
} as const

export default function PrivacyPolicy() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  useEffect(() => {
    // Always default to light theme for legal pages
    // Only check for saved preference if user explicitly toggles
    const savedTheme = localStorage.getItem("legal-theme") as "light" | "dark"
    const savedLanguage = localStorage.getItem("language") as string
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme("light") // Always default to light theme for legal pages
    }
    
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  // Keep language in sync if changed elsewhere
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'language' && e.newValue) {
        setSelectedLanguage(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    // Use separate localStorage key for legal pages
    localStorage.setItem("legal-theme", newTheme)
  }

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem("language", languageCode)
  }

  const themeClasses = {
    background: theme === "dark" ? "bg-black" : "bg-white",
    text: theme === "dark" ? "text-white" : "text-gray-900",
    headerBorder: theme === "dark" ? "border-gray-800" : "border-gray-200",
    buttonGhost: theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900",
    dropdownBg: theme === "dark" ? "bg-gray-900" : "bg-white",
    dropdownBorder: theme === "dark" ? "border-gray-800" : "border-gray-200",
    dropdownText: theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
  } as const

  const selectedLanguageName = languages.find((lang) => lang.code === selectedLanguage)?.name || "English"
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  return (
    <div className={`legal-scroll ${themeClasses.background} ${themeClasses.text} font-sans antialiased`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-4 sm:p-6 border-b ${themeClasses.headerBorder} sticky top-0 ${themeClasses.background} z-10`}>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className={`${themeClasses.buttonGhost} flex items-center gap-2`}>
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.backHome}</span>
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold">{t.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${themeClasses.buttonGhost} text-xs sm:text-sm px-2 h-8 sm:h-9`}
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{selectedLanguageName}</span>
                <span className="sm:hidden text-xs">
                  {selectedLanguage.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`${themeClasses.dropdownBg} ${themeClasses.dropdownBorder} w-48 z-[100] border shadow-lg rounded-md p-1`}
              sideOffset={5}
            >
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => {
                    console.log('Language selected:', language.code, language.name);
                    handleLanguageChange(language.code);
                  }}
                  className={`${themeClasses.dropdownText} cursor-pointer text-sm px-3 py-2 rounded-sm transition-colors focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800`}
                >
                  <span className="w-full text-left">{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className={`p-2 ${themeClasses.buttonGhost}`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <div className={`${themeClasses.text} prose prose-sm sm:prose lg:prose-lg max-w-none`}>
          {t.content.split('\n').map((line: string, index: number) => {
            if (line.trim() === '') {
              return <div key={index} className="h-4"></div>
            }
            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-blue-600 scroll-mt-20">
                  {line.replace(/\*\*/g, '')}
                </h2>
              )
            }
            if (line.trim() === '-----') {
              return <hr key={index} className={`my-8 border-t-2 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`} />
            }
            if (line.startsWith('•')) {
              return (
                <div key={index} className="ml-6 mb-3 flex items-start">
                  <span className="text-blue-500 mr-3 mt-1 font-bold">•</span>
                  <span className="flex-1 leading-relaxed text-sm sm:text-base">{line.substring(1).trim()}</span>
                </div>
              )
            }
            return (
              <p key={index} className="mb-4 leading-relaxed text-sm sm:text-base">
                {line}
              </p>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t ${themeClasses.headerBorder} py-6 px-4 sm:px-6 lg:px-8 mt-12`}>
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              {t.returnToDownloader}
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}