import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Mysterria Archive - Lord of The Mysteries',
    description: 'Collaborative forum for cataloging and discussing Lord of The Mysteries items',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
        <body className={inter.className}>
            {children}
        </body>
        </html>
    )
}