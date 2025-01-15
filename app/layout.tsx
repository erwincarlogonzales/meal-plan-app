import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meal Planner',
  description: 'A simple meal planning application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}