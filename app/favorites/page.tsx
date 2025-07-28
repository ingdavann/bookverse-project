"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Book {
  isbn13: string
  title: string
  subtitle: string
  price: string
  image: string
  url: string
}

export default function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    loadFavorites()
  }, [])

  useEffect(() => {
    const handleFavoritesChange = () => {
      loadFavorites()
    }

    window.addEventListener("favoritesChanged", handleFavoritesChange)
    return () => window.removeEventListener("favoritesChanged", handleFavoritesChange)
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    try {
      const savedFavorites = localStorage.getItem("bookFavorites")
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites)
        setFavorites(favoriteIds)

        // Fetch details for each favorite book
        const bookPromises = favoriteIds.map(async (isbn: string) => {
          try {
            const response = await fetch(`https://api.itbook.store/1.0/books/${isbn}`)
            const data = await response.json()
            // FIX: Keep books when error === "0"
            return data.error === "0" ? data : null
          } catch (error) {
            console.error(`Error fetching book ${isbn}:`, error)
            return null
          }
        })

        const books = await Promise.all(bookPromises)
        setFavoriteBooks(books.filter((book) => book !== null))
      } else {
        setFavoriteBooks([])
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = (isbn: string) => {
    const newFavorites = favorites.filter((fav) => fav !== isbn)
    setFavorites(newFavorites)
    setFavoriteBooks(favoriteBooks.filter((book) => book.isbn13 !== isbn))
    localStorage.setItem("bookFavorites", JSON.stringify(newFavorites))
    window.dispatchEvent(new Event("favoritesChanged"))
  }

  const clearAllFavorites = () => {
    setFavorites([])
    setFavoriteBooks([])
    localStorage.removeItem("bookFavorites")
    window.dispatchEvent(new Event("favoritesChanged"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-white/10 border-b border-white/20"
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </motion.button>

              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-red-500 fill-current" />
                  My Favorites ({favoriteBooks.length})
                </h1>
                {favoriteBooks.length > 0 && (
                  <Button
                    onClick={clearAllFavorites}
                    variant="outline"
                    className="border-red-500/30 text-red-300 hover:bg-red-500/20 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
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
          ) : favoriteBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">💔</div>
              <h2 className="text-3xl font-bold text-white mb-4">No favorites yet</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Start exploring books and add them to your favorites to see them here!
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-3">
                  Discover Books
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favoriteBooks.map((book, index) => (
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
                          onClick={() => removeFavorite(book.isbn13)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-red-500/80 text-white backdrop-blur-md hover:bg-red-600/80 transition-all duration-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="p-6">
                        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {book.title}
                        </h3>
                        {book.subtitle && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{book.subtitle}</p>}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
                          >
                            {book.price}
                          </Badge>
                          <Link href={`/categories/${book.isbn13}`}>
                            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
