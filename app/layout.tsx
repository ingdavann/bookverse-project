import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookVerse - Discover Amazing Books",
  description:
    "Explore thousands of books, find your next favorite read, and build your personal library with modern UI and smooth animations.",
  keywords: [
    "books",
    "bookstore",
    "online bookstore",
    "book reviews",
    "book recommendations",
    "book search",
    "book categories",
    "book details",
    "book ratings",
    "book covers",
    "book authors",
    "book genres",
    "book prices",
    "bookstore UI",
    "modern bookstore",
    "responsive design",
    "framer-motion",
    "next.js",
    "react",
    "tailwindcss",
    "ui components",
    "book library",
    "book collection",
    "book discovery",
    "book reading",
    "book lovers",
    "book enthusiasts",
    "book community",
    "book recommendations",
    "book reviews",
    "book ratings",
    "book search",
    "book categories",
    "book details",
    "book covers",
    "book authors",
    "book genres",
    "book prices",
    "bookstore UI",
    "modern bookstore",
    "responsive design",
    "framer-motion",
    "next.js",
  ],
  openGraph: {
    title: "BookVerse - Discover Amazing Books",
    description:
      "Explore thousands of books, find your next favorite read, and build your personal library with modern UI and smooth animations.",
    url: "https://bookverse.fluentflow.live",
    siteName: "BookVerse",
    images: [
      {
        url: "https://assets.penguinrandomhouse.com/wp-content/uploads/2023/11/30163958/Sad_Books_PRH_Site_1200x628.jpg",
        width: 1200,
        height: 630,
        alt: "BookVerse - Discover Amazing Books",
      },
    ],
    locale: "en_US",
    type: "website",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children} <Footer /></body>
    </html>
  )
}
