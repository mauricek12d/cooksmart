import type { Metadata } from 'next' // importing my TS for Next.js
import { Inter } from 'next/font/google' // importing my font loader
import './globals.css' // importing my globals.css file
import { AuthProvider } from '@/context/auth-context' // importing my AuthProvider component

const inter = Inter({ subsets: ['latin'] }) // Importing Inter font

export const metadata: Metadata = {
  title: 'CookSmart - AI Cooking Assistant',
  description: 'Plan faster and cook better with AI-native recipes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}