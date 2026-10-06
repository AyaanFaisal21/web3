import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { italiana } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayaan Faisal',
  description:
    'Software and intelligent systems engineer. Ambitious innovator, designer and engineer building scalable business solutions and human-centered technology.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable} ${italiana.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
