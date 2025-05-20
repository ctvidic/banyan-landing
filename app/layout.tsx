import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "Banyan - Financial Literacy for Students",
  description: "Help your child build financial literacy skills with Banyan's interactive learning platform.",
  generator: 'v0.dev'
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
      <body className={`${inter.variable} ${outfit.variable} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
