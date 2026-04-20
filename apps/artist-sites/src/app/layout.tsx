import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Artist Sites — Creators Circle',
  description: 'Beautiful artist websites powered by Creators Circle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
