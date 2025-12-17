import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MatchMap HR - Intelligentes Bewerber-Matching',
  description: 'Stellenausschreibungen + Bewerbungen → Skills + Ranking in Minuten. DSGVO-konform, transparent, effizient.',
  keywords: ['HR', 'Recruiting', 'Bewerbermanagement', 'Skill-Matching', 'KI'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
