import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Satoshi Stop Loss — Patoshi Wallet Monitor',
  description: 'Be the first to know if Satoshi moves. We watch all 22,000+ Patoshi pattern wallets 24/7 and alert you instantly.',
  openGraph: {
    title: 'Satoshi Stop Loss',
    description: 'Real-time monitoring of all Patoshi pattern wallets. Get alerted the moment Satoshi moves.',
    url: 'https://nput.foundation',
    siteName: 'Satoshi Stop Loss',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satoshi Stop Loss',
    description: 'Real-time monitoring of all Patoshi pattern wallets.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
