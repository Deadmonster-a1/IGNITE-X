import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'ASCI LMS - Master DSA & Modern Web Development',
  description:
    'Comprehensive learning management system for mastering Data Structures, Algorithms, and full-stack web development. Interactive visualizers, 1-on-1 mentorship, real-world projects, and career-focused curriculum.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

import { AdminProvider } from "@/context/admin-context"
import { AdminEditToggle } from "@/components/admin-edit-toggle"
import { UserSettingsProvider } from "@/context/user-settings-context"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UserSettingsProvider>
            <AdminProvider>
              {children}
              <AdminEditToggle />
            </AdminProvider>
          </UserSettingsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
