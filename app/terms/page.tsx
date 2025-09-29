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
    title: "Terms & Conditions",
    backHome: "Back to Home",
    returnToDownloader: "Return to FB Downloader",
    content: `
**1. Acceptance of Terms**

By accessing and using Facebook Downloader ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.

-----

**2. Description of Service**

Facebook Downloader is a web-based tool that allows users to download publicly available Facebook content, including videos, reels, publicly accessible stories, posts, and highlights. The service is intended for personal and educational use. You are responsible for ensuring you have appropriate authorization from rights holders and for complying with Facebook's Terms of Service and applicable copyright laws.

-----

**3. User Responsibilities & Legal Compliance**

As a user of our service, you agree to:
• Use it solely for personal and non-commercial purposes
• Obtain explicit permission from content creators before downloading their content
• Respect intellectual property and copyright laws
• Comply with Facebook's Terms of Service
• Recognize that downloading Facebook content may violate platform policies
• Accept full legal responsibility for any infringement
• Refrain from downloading private, copyrighted, or protected content
• Avoid any illegal, unauthorized, or commercial use
• Not attempt to circumvent security measures or rate limits
• Comply with all applicable laws and regulations

-----

**4. Prohibited Uses**

You may not use our service to:
• Download private content without authorization
• Violate laws or regulations
• Infringe the rights of others
• Distribute malware or harmful code
• Engage in disruptive activities that interfere with the service
• Access the service using automated systems or bots

-----

**5. Intellectual Property & Copyright**

All content downloaded through our service is protected by copyright and belongs to its respective owners. You are solely responsible for obtaining necessary permissions and licenses before downloading any content. Our service grants no rights, licenses, or ownership in the downloaded content. You must respect all copyright, trademark, and other intellectual property laws. Facebook content creators retain all rights to their works. Fair use exceptions are limited and generally do not apply to downloading activities. Commercial use of downloaded content is prohibited without proper licensing. You agree to indemnify us against any copyright infringement claims arising from your use of the service.

-----

**6. Disclaimer of Warranties**

Our service is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, whether express or implied, including without limitation implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee:
• Uninterrupted, timely, secure, or error-free operation
• The accuracy, reliability, completeness, or quality of downloaded content
• That the service will meet your requirements or expectations
• That any defects will be corrected
• The legality of downloading specific content in your jurisdiction
• Protection against copyright claims
• Compliance with third-party terms
• The availability or functionality of Facebook's platform

-----

**7. Limitation of Liability**

TO THE MAXIMUM EXTENT PERMITTED BY LAW, Facebook Downloader shall not be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages, including without limitation loss of profits, goodwill, use, data, or other intangible losses, arising out of or relating to your use of or inability to use the service, copyright claims or legal actions against you, violations of Facebook's Terms of Service resulting from your use, unauthorized access to or alteration of your data, interruptions or cessations of transmission, bugs, viruses or other harmful components, errors or omissions in content or loss of data, the conduct of any third party on or through the service, or any legal fees, fines, or penalties incurred due to your use of the service. Our total liability to you for all damages shall not exceed $100 USD or the amount you paid to use the service, whichever is less.

-----

**8. Privacy Policy**

Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.

-----

**9. Modifications to Service**

We reserve the right to modify or discontinue the service at any time, change these terms and conditions, refuse service to anyone for any reason, and remove or disable access to any content.

-----

**10. Termination**

We may terminate or suspend your access immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.

-----

**11. Governing Law**

These Terms shall be interpreted and governed by the laws of the jurisdiction in which our service operates, without regard to its conflict of law provisions.

-----

**12. Age Restrictions**

Our service is not intended for users under the age of 13. By using our service, you represent that you are at least 13 years old.

-----

**13. Third-Party Links**

Our service may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites.

-----

**14. Indemnification**

You agree to indemnify and hold harmless Facebook Downloader from any claims, damages, or expenses arising from your use of the service or violation of these terms.

-----

**15. Severability**

If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.

-----

**16. Contact Information**

If you have any questions about these Terms & Conditions, please contact us at legal@facebookdownloader.com or use our contact form.

-----

**17. Changes to Terms**

We reserve the right to update these Terms & Conditions at any time. We will notify users of any material changes by posting the new terms on our website. Your continued use of the service after such changes constitutes acceptance of the new terms.
    `
  },
  es: {
    title: "Términos y Condiciones",
    backHome: "Volver al Inicio",
    returnToDownloader: "Volver al Descargador FB",
    content: `
**1. Aceptación de Términos**

Al acceder y usar Facebook Downloader ("el Servicio"), acepta y se compromete a cumplir con los términos y disposiciones de este acuerdo. Si no está de acuerdo con lo anterior, no use este servicio.

-----

**2. Descripción del Servicio**

Facebook Downloader es una herramienta basada en web que permite a los usuarios descargar contenido de Facebook disponible públicamente, incluyendo videos, reels, historias accesibles públicamente, publicaciones y destacados. El servicio está destinado para uso personal y educativo. Usted es responsable de asegurar que tiene la autorización apropiada de los titulares de derechos y de cumplir con los Términos de Servicio de Facebook y las leyes de derechos de autor aplicables.

-----

**3. Responsabilidades del Usuario y Cumplimiento Legal**

Como usuario de nuestro servicio, usted acepta:
• Usarlo únicamente para propósitos personales y no comerciales
• Obtener permiso explícito de los creadores de contenido antes de descargar su contenido
• Respetar las leyes de propiedad intelectual y derechos de autor
• Cumplir con los Términos de Servicio de Facebook
• Reconocer que descargar contenido de Facebook puede violar las políticas de la plataforma
• Aceptar la responsabilidad legal completa por cualquier infracción
• Abstenerse de descargar contenido privado, con derechos de autor o protegido
• Evitar cualquier uso ilegal, no autorizado o comercial
• No intentar eludir medidas de seguridad o límites de velocidad
• Cumplir con todas las leyes y regulaciones aplicables

-----

**4. Usos Prohibidos**

No puede usar nuestro servicio para:
• Descargar contenido privado sin autorización
• Violar leyes o regulaciones
• Infringir los derechos de otros
• Distribuir malware o código dañino
• Participar en actividades disruptivas que interfieran con el servicio
• Acceder al servicio usando sistemas automatizados o bots

-----

**5. Propiedad Intelectual y Derechos de Autor**

Todo el contenido descargado a través de nuestro servicio está protegido por derechos de autor y pertenece a sus respectivos propietarios. Usted es el único responsable de obtener los permisos y licencias necesarios antes de descargar cualquier contenido. Nuestro servicio no otorga derechos, licencias o propiedad en el contenido descargado. Debe respetar todas las leyes de derechos de autor, marcas registradas y otras leyes de propiedad intelectual. Los creadores de contenido de Facebook mantienen todos los derechos sobre sus obras. Las excepciones de uso justo son limitadas y generalmente no se aplican a las actividades de descarga. El uso comercial del contenido descargado está prohibido sin la licencia adecuada. Usted acepta indemnizarnos contra cualquier reclamo de infracción de derechos de autor que surja de su uso del servicio.

-----

**6. Exención de Garantías**

Nuestro servicio se proporciona "TAL COMO ESTÁ" y "SEGÚN DISPONIBILIDAD" sin garantías de ningún tipo, ya sean expresas o implícitas, incluyendo sin limitación garantías implícitas de comerciabilidad, idoneidad para un propósito particular y no infracción. No garantizamos:
• Operación ininterrumpida, oportuna, segura o libre de errores
• La precisión, confiabilidad, integridad o calidad del contenido descargado
• Que el servicio cumpla con sus requisitos o expectativas
• Que se corregirán los defectos
• La legalidad de descargar contenido específico en su jurisdicción
• Protección contra reclamos de derechos de autor
• Cumplimiento con términos de terceros
• La disponibilidad o funcionalidad de la plataforma de Facebook
    `
  },
  // Add more languages as needed
  fr: {
    title: "Conditions d'utilisation",
    backHome: "Retour à l'accueil",
    returnToDownloader: "Retour au Téléchargeur FB",
    content: `
**1. Acceptation des conditions**

En accédant et en utilisant Facebook Downloader ("le Service"), vous acceptez et vous engagez à respecter les termes et dispositions de cet accord. Si vous n'êtes pas d'accord avec ce qui précède, veuillez ne pas utiliser ce service.

-----

**2. Description du service**

Facebook Downloader est un outil web qui permet aux utilisateurs de télécharger du contenu Facebook disponible publiquement, y compris des vidéos, reels, stories accessibles publiquement, publications et points forts. Le service est destiné à un usage personnel et éducatif. Vous êtes responsable de vous assurer que vous avez l'autorisation appropriée des détenteurs de droits et de respecter les Conditions de Service de Facebook et les lois applicables sur le droit d'auteur.
    `
  },
  de: {
    title: "Nutzungsbedingungen",
    backHome: "Zurück zur Startseite",
    returnToDownloader: "Zurück zum FB Downloader",
    content: `
**1. Annahme der Bedingungen**

Durch den Zugriff auf und die Nutzung von Facebook Downloader ("der Service") akzeptieren Sie die Bedingungen und Bestimmungen dieser Vereinbarung und verpflichten sich, diese einzuhalten. Wenn Sie mit dem oben Genannten nicht einverstanden sind, verwenden Sie diesen Service bitte nicht.

-----

**2. Servicebeschreibung**

Facebook Downloader ist ein webbasiertes Tool, das es Benutzern ermöglicht, öffentlich verfügbare Facebook-Inhalte herunterzuladen, einschließlich Videos, Reels, öffentlich zugängliche Stories, Beiträge und Highlights. Der Service ist für den persönlichen und pädagogischen Gebrauch bestimmt. Sie sind dafür verantwortlich, sicherzustellen, dass Sie die entsprechende Genehmigung von Rechteinhabern haben und die Nutzungsbedingungen von Facebook und anwendbare Urheberrechtsgesetze einhalten.
    `
  },
  it: {
    title: "Termini e Condizioni",
    backHome: "Torna alla Home",
    returnToDownloader: "Torna al Scaricatore FB",
    content: `
**1. Accettazione dei Termini**

Accedendo e utilizzando Facebook Downloader ("il Servizio"), accetti e acconsenti a rispettare i termini e le disposizioni di questo accordo.
    `
  },
  pt: {
    title: "Termos e Condições",
    backHome: "Voltar ao Início",
    returnToDownloader: "Voltar ao Downloader FB",
    content: `
**1. Aceitação dos Termos**

Ao acessar e usar o Facebook Downloader ("o Serviço"), você aceita e concorda em estar vinculado aos termos e disposições deste acordo.
    `
  },
  ru: {
    title: "Условия и Положения",
    backHome: "Назад на главную",
    returnToDownloader: "Вернуться к FB Downloader",
    content: `
**1. Принятие Условий**

Обращаясь к Facebook Downloader и используя его ("Сервис"), вы принимаете и соглашаетесь соблюдать условия и положения данного соглашения.
    `
  },
  ja: {
    title: "利用規約",
    backHome: "ホームに戻る",
    returnToDownloader: "FB ダウンローダーに戻る",
    content: `
**1. 利用規約の同意**

Facebook Downloader（「サービス」）にアクセスし、使用することにより、あなたはこの契約の約款と規定に拘束されることに同意し、承認します。
    `
  },
  ko: {
    title: "이용약관",
    backHome: "홈으로 돌아가기",
    returnToDownloader: "FB 다운로더로 돌아가기",
    content: `
**1. 약관 동의**

Facebook Downloader("서비스")에 액세스하고 사용함으로써 이 계약의 약관과 조항에 구속되는 것에 동의하고 수락합니다.
    `
  },
  zh: {
    title: "条款和条件",
    backHome: "返回首页",
    returnToDownloader: "返回 FB 下载器",
    content: `
**1. 接受条款**

通过访问和使用 Facebook Downloader（“服务”），您接受并同意受此协议的条款和规定约束。
    `
  },
  ar: {
    title: "الشروط والأحكام",
    backHome: "العودة للرئيسية",
    returnToDownloader: "العودة إلى منزل FB",
    content: `
**1. قبول الشروط**

بالوصول واستخدام Facebook Downloader ("الخدمة")، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية.
    `
  },
  hi: {
    title: "नियम और शर्तें",
    backHome: "होम पर वापस",
    returnToDownloader: "FB डाउनलोडर पर वापस",
    content: `
**1. शर्तों की स्वीकृति**

Facebook Downloader ("सेवा") तक पहुंचकर और इसका उपयोग करके, आप इस समझौते की शर्तों और प्रावधानों का पालन करने के लिए स्वीकार करते और सहमत होते हैं।
    `
  }
} as const

export default function TermsAndConditions() {
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