import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="es">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
