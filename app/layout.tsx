import type { Metadata } from 'next'
import './globals.css'

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
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"
                rel="stylesheet"
            />
        </head>
        <body>
            {children}
        </body>
        </html>
    )
}
