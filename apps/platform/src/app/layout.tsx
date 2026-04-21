import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { NextAuthSessionProvider } from '@/components/session-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Creators Circle — A Community for Artists',
  description: 'Build your artist site, share your work, and grow with a community of creators.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextAuthSessionProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
