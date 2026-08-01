import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { AdBlockDetector } from "@/components/AdBlockDetector"


const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pikashowgames.com"),
  title: "PikaShowGames - Play Free Online Games",
  description:
    "Play thousands of free online games instantly without download. Action, Adventure, Puzzle, Sports games and more on PikaShowGames.",
  keywords: [
    "PikaShowGames",
    "free online games",
    "play games online",
    "browser games",
    "HTML5 games",
    "no download games",
  ],
  openGraph: {
    title: "PikaShowGames – Play Free Online Games Instantly",
    description:
      "Enjoy thousands of free browser games. Play instantly without download on mobile and desktop at PikaShowGames!",
    url: "https://www.pikashowgames.com",
    siteName: "PikaShowGames",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "PikaShowGames Thumbnail",
      },
    ],
  },
  generator: "PikaShowGames",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3990057144186847"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`font-sans antialiased`}>

        {/* 🔒 AdBlock Detection ADDED */}
        <AdBlockDetector>
          {children}
        </AdBlockDetector>
        
        <Analytics />

        {/* Disable Inspect Element & Right Click */}
        {/* <Script id="disable-inspect" strategy="afterInteractive">
          {`
    // Disable right-click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Disable common inspect shortcuts (Windows + macOS)
    document.onkeydown = function (e) {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.metaKey && e.shiftKey && e.keyCode === 67) || // Cmd+Shift+C (Mac)
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C (Windows)
        (e.metaKey && e.altKey && e.keyCode === 73) ||   // Cmd+Option+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.metaKey && e.keyCode === 85)    // Cmd+U
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Detect if DevTools is open and redirect
    const detectDevTools = () => {
      const threshold = 160;
      const start = new Date().getTime();
      debugger;
      const end = new Date().getTime();
      if (end - start > threshold) {
        window.location.href = "/";
      }
    };
    setInterval(detectDevTools, 1000);
  `}
        </Script> */}

      </body>
    </html>
  )
}
