import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgenticGSD - AI IT Support',
  description: 'Multi-agent IT support system with Ram (L1), Sam (L2), and Sita (Booking) agents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-dark-bg">
          <header className="border-b border-gray-800/50 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 max-w-7xl flex items-center justify-between">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AgenticGSD
              </h1>
              <span className="text-xs text-gray-600 hidden sm:block">AI IT Support</span>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
