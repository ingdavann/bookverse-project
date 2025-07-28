"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Heart, TrendingUp, Award, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Book {
  isbn13: string
  title: string
  subtitle: string
  price: string
  image: string
  url: string
}

interface SearchResult {
  total: string
  page: string
  books: Book[]
}

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

const categories = [
  { id: "new", label: "New Releases", icon: Clock, color: "from-blue-500 to-cyan-500" },
  { id: "popular", label: "Popular", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
  { id: "top", label: "Top Rated", icon: Award, color: "from-orange-500 to-red-500" },
]

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("new")
  const [favorites, setFavorites] = useState<string[]>([])

  const [selectedBook, setSelectedBook] = useState<BookDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    const savedFavorites = localStorage.getItem("bookFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    fetchBooks()
  }, [activeCategory])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`https://api.itbook.store/1.0/new`)
      const data: SearchResult = await response.json()
      setBooks(data.books || [])
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    try {
      const response = await fetch(`https://api.itbook.store/1.0/search/${encodeURIComponent(query)}`)
      const data: SearchResult = await response.json()
      setSearchResults(data.books || [])
    } catch (error) {
      console.error("Error searching books:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  // FIX: Use functional state update
  // const toggleFavorite = (isbn: string) => {
  //   setFavorites((prev) => {
  //     const newFavorites = prev.includes(isbn)
  //       ? prev.filter((fav) => fav !== isbn)
  //       : [...prev, isbn]

  //     localStorage.setItem("bookFavorites", JSON.stringify(newFavorites))
  //     return newFavorites
  //   })
  // }
  const toggleFavorite = (isbn: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(isbn)
      const newFavorites = exists
        ? prev.filter((fav) => fav !== isbn)
        : [...prev, isbn]

      // Update localStorage after state
      setTimeout(() => {
        localStorage.setItem("bookFavorites", JSON.stringify(newFavorites))
      }, 0)

      return newFavorites
    })
  }

  const openBookDetail = async (isbn13: string) => {
    setDetailLoading(true)
    try {
      const res = await fetch(`https://api.itbook.store/1.0/books/${isbn13}`)
      const data: BookDetail = await res.json()
      setSelectedBook(data)
    } catch (err) {
      console.error("Error loading book detail", err)
    } finally {
      setDetailLoading(false)
    }
  }

  const displayBooks = searchQuery ? searchResults : books

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50"
        >
          <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">📚</span>
              </div>
              <h1 className="text-2xl font-bold text-white">BookVerse</h1>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/categories" className="text-white hover:text-purple-300 transition-colors">
                Categories
              </Link>
              <Link href="/reading-list" className="text-white hover:text-purple-300 transition-colors">
                Reading Lists
              </Link>
              <Link href="/statistics" className="text-white hover:text-purple-300 transition-colors">
                Statistics
              </Link>
            </nav>

            <Link href="/favorites">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <Heart className="w-5 h-5 mr-2" />
                Favorites ({favorites.length})
              </Button>
            </Link>
          </div>
        </motion.header>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="container mx-auto px-4 py-16 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Discover Amazing Books
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Explore thousands of books, find your next favorite read, and build your personal library
          </p>

          {/* Search */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30"></div>
              <div className="relative backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-2">
                <div className="flex items-center space-x-4">
                  <Search className="w-6 h-6 text-gray-300 ml-4" />
                  <Input
                    placeholder="Search for books by title..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      searchBooks(e.target.value)
                    }}
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-300 text-lg focus:ring-0"
                  />
                  {searchLoading && (
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-4"></div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center space-x-4 mb-12"
          >
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeCategory === category.id ? "text-white" : "text-gray-300 hover:text-white"
                    }`}
                >
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className={`absolute inset-0 bg-gradient-to-r ${category.color} rounded-xl`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{category.label}</span>
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        </motion.section>

        {/* Books */}
        <section className="container mx-auto px-4 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-6 animate-pulse"
                >
                  <div className="w-full h-64 bg-gray-600 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayBooks.map((book, index) => (
                <motion.div
                  key={book.isbn13}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={book.image || "/placeholder.svg?height=300&width=200"}
                          alt={book.title}
                          width={200}
                          height={300}
                          className="w-full h-64 object-cover"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite(book.isbn13)
                          }}
                          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${favorites.includes(book.isbn13)
                              ? "bg-red-500/80 text-white"
                              : "bg-white/20 text-gray-300 hover:bg-white/30"
                            }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(book.isbn13) ? "fill-current" : ""}`} />
                        </motion.button>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="p-6">
                        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {book.title}
                        </h3>
                        {book.subtitle && (
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{book.subtitle}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
                          >
                            {book.price}
                          </Badge>
                          <Button
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                            onClick={() => openBookDetail(book.isbn13)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {displayBooks.length === 0 && !loading && searchQuery && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No books found</h3>
              <p className="text-gray-400">Try searching with different keywords</p>
            </motion.div>
          )}
        </section>

        {/* Book Detail Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-3xl w-full text-white relative">
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 text-white hover:text-red-400"
              >
                ✖
              </button>

              {detailLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <Image
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    width={500}
                    height={300}
                    className="rounded-lg"
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                    <p className="text-gray-300 mb-4">{selectedBook.subtitle}</p>
                    <p><strong>Authors:</strong> {selectedBook.authors}</p>
                    <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
                    <p><strong>Year:</strong> {selectedBook.year}</p>
                    <p><strong>Pages:</strong> {selectedBook.pages}</p>
                    <p className="mt-4">{selectedBook.desc}</p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={() => window.open(selectedBook.url, "_blank")}
                    >
                      Buy ({selectedBook.price})
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
