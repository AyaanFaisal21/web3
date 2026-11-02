import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { italiana } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayaan Faisal',
  description: 'Builder with an interest in computer hardware, human-centered technology and impact.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable} ${italiana.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
