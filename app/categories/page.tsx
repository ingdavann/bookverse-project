"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Code, Heart, Brain, Briefcase, Palette, Gamepad2, Music, Camera } from "lucide-react"
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

const categories = [
  {
    id: "programming",
    name: "Programming",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    keywords: ["javascript", "python", "react", "programming", "coding", "software"],
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    keywords: ["design", "ui", "ux", "photoshop", "illustrator", "creative"],
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    color: "from-green-500 to-emerald-500",
    keywords: ["business", "management", "marketing", "finance", "startup"],
  },
  {
    id: "science",
    name: "Science",
    icon: Brain,
    color: "from-purple-500 to-violet-500",
    keywords: ["science", "physics", "chemistry", "biology", "mathematics"],
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    color: "from-orange-500 to-red-500",
    keywords: ["game", "gaming", "unity", "unreal", "development"],
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "from-indigo-500 to-purple-500",
    keywords: ["music", "audio", "sound", "production", "recording"],
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    color: "from-teal-500 to-cyan-500",
    keywords: ["photography", "photo", "camera", "digital", "editing"],
  },
  {
    id: "general",
    name: "General",
    icon: BookOpen,
    color: "from-gray-500 to-slate-500",
    keywords: ["book", "guide", "tutorial", "learning"],
  },
]

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    const savedFavorites = localStorage.getItem("bookFavorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
    fetchCategoryBooks(selectedCategory)
  }, [selectedCategory])

  const fetchCategoryBooks = async (category: (typeof categories)[0]) => {
    setLoading(true)
    try {
      const keyword = category.keywords[0]
      const response = await fetch(`https://api.itbook.store/1.0/search/${keyword}`)
      const data = await response.json()
      setBooks(data.books || [])
    } catch (error) {
      console.error("Error fetching category books:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (isbn: string) => {
    const newFavorites = favorites.includes(isbn) ? favorites.filter((fav) => fav !== isbn) : [...favorites, isbn]
    setFavorites(newFavorites)
    localStorage.setItem("bookFavorites", JSON.stringify(newFavorites))
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

              <h1 className="text-2xl font-bold text-white">Book Categories</h1>

              <Link href="/favorites">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  <Heart className="w-5 h-5 mr-2" />
                  Favorites ({favorites.length})
                </Button>
              </Link>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <Card className="backdrop-blur-md bg-white/10 border-white/20 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Categories</h2>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <motion.button
                          key={category.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                            selectedCategory.id === category.id
                              ? "bg-gradient-to-r " + category.color + " text-white"
                              : "text-gray-300 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{category.name}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Books Grid */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedCategory.color} flex items-center justify-center`}
                  >
                    <selectedCategory.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{selectedCategory.name}</h2>
                    <p className="text-gray-400">Discover amazing {selectedCategory.name.toLowerCase()} books</p>
                  </div>
                </div>
              </motion.div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-6 animate-pulse"
                    >
                      <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {books.map((book, index) => (
                    <motion.div
                      key={book.isbn13}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group"
                    >
                      <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden ">
                        <CardContent className="p-0">
                          <div className="relative">
                            <Image
                              src={book.image || "/placeholder.svg?height=240&width=160"}
                              alt={book.title}
                              width={160}
                              height={240}
                              className="w-full h-48 object-cover"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleFavorite(book.isbn13)}
                              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                                favorites.includes(book.isbn13)
                                  ? "bg-red-500/80 text-white"
                                  : "bg-white/20 text-gray-300 hover:bg-white/30"
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${favorites.includes(book.isbn13) ? "fill-current" : ""}`} />
                            </motion.button>
                          </div>

                          <div className="p-4">
                            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                              {book.title}
                            </h3>
                            {book.subtitle && (
                              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{book.subtitle}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <Badge
                                variant="secondary"
                                className={`bg-gradient-to-r ${selectedCategory.color} text-white border-none text-xs`}
                              >
                                {book.price}
                              </Badge>
                              <Link href={`/categories/${book.isbn13}`}>
                                <Button
                                  size="sm"
                                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 text-xs"
                                >
                                  Details
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

              {books.length === 0 && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">No books found</h3>
                  <p className="text-gray-400">Try selecting a different category</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
