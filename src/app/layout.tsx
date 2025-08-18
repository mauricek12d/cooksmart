import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CookSmart',
  description: 'Plan faster and cook better with AI-native recipes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}
