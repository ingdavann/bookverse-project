"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface BookDetail {
  title: string
  subtitle: string
  authors: string
  publisher: string
  isbn13: string
  pages: string
  year: string
  rating: string
  desc: string
  price: string
  image: string
  url: string
  pdf?: Record<string, string>
}

export default function BookDetailPage() {
  const { isbn13 } = useParams()
  const router = useRouter()
  const [book, setBook] = useState<BookDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const res = await fetch(`https://api.itbook.store/1.0/books/${isbn13}`)
        const data = await res.json()
        setBook(data)
      } catch (error) {
        console.error("Error fetching book detail:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isbn13) fetchBookDetail()
  }, [isbn13])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <h2 className="text-2xl mb-4">Book not found</h2>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  const isFree = book.price === "$0.00" && book.pdf
  const firstPdfUrl = isFree ? Object.values(book.pdf!)[0] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6 text-white hover:bg-white/20"
          onClick={() => router.back()}
        >
          ← Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
        >
          {/* Book Info Section */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <Image
                src={book.image}
                alt={book.title}
                width={500}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>

            <div className="flex-1 text-white mt-8">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-gray-300 mb-4">{book.subtitle}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-300 text-sm mb-6">
                <p><strong>Authors:</strong> {book.authors}</p>
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Year:</strong> {book.year}</p>
                <p><strong>Pages:</strong> {book.pages}</p>
                <p><strong>Rating:</strong> {book.rating}</p>
                <p><strong>ISBN13:</strong> {book.isbn13}</p>
              </div>

              <p className="text-gray-100 mb-6">{book.desc}</p>

              {!isFree && (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  onClick={() => window.open(book.url, "_blank")}
                >
                  Buy / More Info ({book.price})
                </Button>
              )}
            </div>
          </div>

          {/* If free book, show PDF frame */}
          {isFree && firstPdfUrl && (
            <div className="w-full h-[80vh] mt-6">
              <h2 className="text-2xl font-bold text-white mb-4">Read Book (Free PDF)</h2>
              <iframe
                src={firstPdfUrl}
                className="w-full h-full rounded-lg border border-white/20"
              />
            </div>
          )}

          {/* If not free but has pdf samples */}
          {!isFree && book.pdf && (
            <div className="mt-6 text-white">
              <h3 className="font-semibold mb-2">PDF Samples:</h3>
              <ul className="list-disc list-inside text-purple-300">
                {Object.entries(book.pdf).map(([label, link]) => (
                  <li key={label}>
                    <a href={link} target="_blank" className="underline hover:text-purple-400">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
