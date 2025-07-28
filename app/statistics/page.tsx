"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Target, TrendingUp, Calendar, Award, Clock, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ReadingStats {
  totalBooks: number
  booksRead: number
  currentlyReading: number
  wantToRead: number
  averageRating: number
  totalPages: number
  readingStreak: number
  favoriteGenre: string
  monthlyGoal: number
  monthlyProgress: number
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<ReadingStats>({
    totalBooks: 0,
    booksRead: 0,
    currentlyReading: 0,
    wantToRead: 0,
    averageRating: 0,
    totalPages: 0,
    readingStreak: 0,
    favoriteGenre: "Programming",
    monthlyGoal: 5,
    monthlyProgress: 3,
  })
  const [favorites, setFavorites] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = () => {
    // Load favorites
    const savedFavorites = localStorage.getItem("bookFavorites")
    if (savedFavorites) {
      const favs = JSON.parse(savedFavorites)
      setFavorites(favs)
    }

    // Load reading lists for statistics
    const savedLists = localStorage.getItem("readingLists")
    if (savedLists) {
      const lists = JSON.parse(savedLists)
      let totalBooks = 0
      let booksRead = 0
      let currentlyReading = 0
      let wantToRead = 0

      lists.forEach((list: any) => {
        list.books.forEach((book: any) => {
          totalBooks++
          switch (book.status) {
            case "completed":
              booksRead++
              break
            case "reading":
              currentlyReading++
              break
            case "want-to-read":
              wantToRead++
              break
          }
        })
      })

      setStats((prev) => ({
        ...prev,
        totalBooks,
        booksRead,
        currentlyReading,
        wantToRead,
        totalPages: booksRead * 250, // Estimate 250 pages per book
        readingStreak: Math.floor(Math.random() * 30) + 1, // Random streak for demo
        averageRating: 4.2 + Math.random() * 0.6, // Random rating between 4.2-4.8
      }))
    }
  }

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      description: "Books in your library",
    },
    {
      title: "Books Read",
      value: stats.booksRead,
      icon: Award,
      color: "from-green-500 to-emerald-500",
      description: "Completed this year",
    },
    {
      title: "Currently Reading",
      value: stats.currentlyReading,
      icon: Clock,
      color: "from-orange-500 to-red-500",
      description: "Books in progress",
    },
    {
      title: "Want to Read",
      value: stats.wantToRead,
      icon: Target,
      color: "from-purple-500 to-pink-500",
      description: "On your wishlist",
    },
    {
      title: "Favorites",
      value: favorites.length,
      icon: Heart,
      color: "from-red-500 to-pink-500",
      description: "Loved books",
    },
    {
      title: "Reading Streak",
      value: `${stats.readingStreak} days`,
      icon: TrendingUp,
      color: "from-indigo-500 to-purple-500",
      description: "Keep it up!",
    },
  ]

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

              <h1 className="text-2xl font-bold text-white">Reading Statistics</h1>

              <Link href="/reading-list">
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  Reading Lists
                </Button>
              </Link>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-12">
          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Reading Journey
            </h2>
            <p className="text-xl text-gray-300 mb-8">Track your progress and celebrate your achievements</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={`bg-gradient-to-r ${stat.color} text-white border-none`}>
                          {typeof stat.value === "number" ? stat.value : stat.value}
                        </Badge>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">{stat.title}</h3>
                      <p className="text-gray-400 text-sm">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Monthly Goal Progress */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          >
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-400" />
                  Monthly Reading Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-white font-semibold">
                      {stats.monthlyProgress} / {stats.monthlyGoal} books
                    </span>
                  </div>
                  <Progress value={(stats.monthlyProgress / stats.monthlyGoal) * 100} className="h-3" />
                  <p className="text-gray-400 text-sm">
                    {stats.monthlyGoal - stats.monthlyProgress} books remaining to reach your goal
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  Reading Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Average Rating</span>
                    <div className="flex items-center">
                      <span className="text-white font-semibold mr-1">{stats.averageRating.toFixed(1)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(stats.averageRating) ? "text-yellow-400" : "text-gray-600"
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Favorite Genre</span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                      {stats.favoriteGenre}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Pages Read</span>
                    <span className="text-white font-semibold">{stats.totalPages.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="backdrop-blur-md bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-purple-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "First Book", description: "Read your first book", unlocked: stats.booksRead > 0 },
                    { name: "Bookworm", description: "Read 10 books", unlocked: stats.booksRead >= 10 },
                    {
                      name: "Speed Reader",
                      description: "Read 5 books in a month",
                      unlocked: stats.monthlyProgress >= 5,
                    },
                    { name: "Collector", description: "Add 20 books to favorites", unlocked: favorites.length >= 20 },
                    {
                      name: "Streak Master",
                      description: "30-day reading streak",
                      unlocked: stats.readingStreak >= 30,
                    },
                    { name: "Genre Explorer", description: "Read from 5 different genres", unlocked: false },
                    { name: "Page Turner", description: "Read 10,000 pages", unlocked: stats.totalPages >= 10000 },
                    {
                      name: "Dedicated Reader",
                      description: "Read every day for a week",
                      unlocked: stats.readingStreak >= 7,
                    },
                  ].map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`p-4 rounded-lg text-center transition-all duration-300 ${
                        achievement.unlocked
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          : "bg-gray-800/50 text-gray-500"
                      }`}
                    >
                      <div className="text-2xl mb-2">{achievement.unlocked ? "🏆" : "🔒"}</div>
                      <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                      <p className="text-xs opacity-80">{achievement.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
