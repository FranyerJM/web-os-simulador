import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Web OS - Mobile Simulator',
  description: 'A complete web-based operating system simulator',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // La clave es el atributo suppressHydrationWarning
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-gray-950`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}