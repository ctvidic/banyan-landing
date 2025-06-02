import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Banyan - Financial Literacy Platform for Teens | Learn, Earn, Invest",
  description: "The only financial education platform where teens earn real money while learning to invest, negotiate, and build businesses. Parent-approved, teen-loved.",
  keywords: ["financial literacy", "teen finance", "investment education", "money management for teens", "financial education", "teen investing"],
  authors: [{ name: "Banyan Financial Education" }],
  creator: "Banyan",
  publisher: "Banyan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://banyan.education"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Banyan - Where Future Millionaires Start Their Journey",
    description: "The only financial education platform where teens earn real money while learning to invest, negotiate, and build businesses.",
    url: "https://banyan.education",
    siteName: "Banyan",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Banyan - Financial Literacy for Teens",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Banyan - Financial Literacy Platform for Teens",
    description: "Where teens learn to build wealth, not just save pennies. Join the next generation of investors.",
    images: ["/og-image.png"],
    creator: "@banyan_edu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Remove manual link tag */}
      {/* <head>
         <link rel="icon" href="/favicon.png" sizes="any" />
      </head> */}
      {/* Next.js will automatically handle the head based on metadata and app/icon.tsx */}
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
