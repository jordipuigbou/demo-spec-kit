import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { AppShell } from '@/components/AppShell/AppShell'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-ui',
})

export const metadata: Metadata = {
  title: 'Conferencias QA en España',
  description: 'Dashboard de conferencias de calidad y testing en España — próximos eventos, fechas y ciudades',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
