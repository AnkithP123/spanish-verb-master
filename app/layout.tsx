import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spanish Verb Master',
  description: 'Created by Ankith Prabhakar',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
