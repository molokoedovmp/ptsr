import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'ПТСР Эксперт - Платформа поддержки людей с ПТСР',
  description: 'Профессиональная поддержка и помощь людям с посттравматическим стрессовым расстройством',
  keywords: ['ПТСР', 'психологическая помощь', 'травма', 'поддержка', 'терапия'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <AnalyticsTracker />
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
