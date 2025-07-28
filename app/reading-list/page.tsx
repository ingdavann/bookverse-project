"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, BookOpen, CheckCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface ReadingListItem {
  isbn: string
  title: string
  image: string
  status: "want-to-read" | "reading" | "completed"
  progress: number
  dateAdded: string
  dateCompleted?: string
  notes?: string
}

interface ReadingList {
  id: string
  name: string
  description: string
  books: ReadingListItem[]
  createdAt: string
}

export default function ReadingListPage() {
  const [readingLists, setReadingLists] = useState<ReadingList[]>([])
  const [selectedList, setSelectedList] = useState<ReadingList | null>(null)
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadReadingLists()
  }, [])

  const loadReadingLists = () => {
    const saved = localStorage.getItem("readingLists")
    if (saved) {
      const lists = JSON.parse(saved)
      setReadingLists(lists)
      if (lists.length > 0 && !selectedList) {
        setSelectedList(lists[0])
      }
    } else {
      // Create default lists
      const defaultLists: ReadingList[] = [
        {
          id: "default-1",
          name: "Currently Reading",
          description: "Books I'm actively reading",
          books: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "default-2",
          name: "Want to Read",
          description: "Books on my wishlist",
          books: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "default-3",
          name: "Completed",
          description: "Books I've finished reading",
          books: [],
          createdAt: new Date().toISOString(),
        },
      ]
      setReadingLists(defaultLists)
      setSelectedList(defaultLists[0])
      localStorage.setItem("readingLists", JSON.stringify(defaultLists))
    }
  }

  const createNewList = () => {
    if (!newListName.trim()) return

    const newList: ReadingList = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      books: [],
      createdAt: new Date().toISOString(),
    }

    const updatedLists = [...readingLists, newList]
    setReadingLists(updatedLists)
    localStorage.setItem("readingLists", JSON.stringify(updatedLists))
    setSelectedList(newList)
    setNewListName("")
    setNewListDescription("")
    setIsCreateDialogOpen(false)
  }

  const deleteList = (listId: string) => {
    const updatedLists = readingLists.filter((list) => list.id !== listId)
    setReadingLists(updatedLists)
    localStorage.setItem("readingLists", JSON.stringify(updatedLists))
    if (selectedList?.id === listId) {
      setSelectedList(updatedLists[0] || null)
    }
  }

  const updateBookProgress = (isbn: string, progress: number) => {
    if (!selectedList) return

    const updatedBooks = selectedList.books.map((book) => (book.isbn === isbn ? { ...book, progress } : book))

    const updatedList = { ...selectedList, books: updatedBooks }
    const updatedLists = readingLists.map((list) => (list.id === selectedList.id ? updatedList : list))

    setReadingLists(updatedLists)
    setSelectedList(updatedList)
    localStorage.setItem("readingLists", JSON.stringify(updatedLists))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "want-to-read":
        return "from-blue-500 to-cyan-500"
      case "reading":
        return "from-orange-500 to-red-500"
      case "completed":
        return "from-green-500 to-emerald-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "want-to-read":
        return Plus
      case "reading":
        return BookOpen
      case "completed":
        return CheckCircle
      default:
        return BookOpen
    }
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

              <h1 className="text-2xl font-bold text-white">Reading Lists</h1>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    New List
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Reading List</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="List name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                    <Button onClick={createNewList} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                      Create List
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Lists Sidebar */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <Card className="backdrop-blur-md bg-white/10 border-white/20 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">My Lists</h2>
                  <div className="space-y-2">
                    {readingLists.map((list) => (
                      <motion.div
                        key={list.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          selectedList?.id === list.id
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "text-gray-300 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedList(list)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{list.name}</h3>
                            <p className="text-xs opacity-70">{list.books.length} books</p>
                          </div>
                          {list.id.startsWith("default-") ? null : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteList(list.id)
                              }}
                              className="p-1 h-auto text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Books in Selected List */}
            <div className="lg:col-span-3">
              {selectedList ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedList.name}</h2>
                    <p className="text-gray-400">{selectedList.description}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {selectedList.books.length} books
                      </Badge>
                      <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                        Created {new Date(selectedList.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>

                  {selectedList.books.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-2xl font-semibold text-white mb-2">No books in this list</h3>
                      <p className="text-gray-400 mb-6">Start adding books to track your reading progress</p>
                      <Link href="/">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          Browse Books
                        </Button>
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {selectedList.books.map((book, index) => {
                        const StatusIcon = getStatusIcon(book.status)
                        return (
                          <motion.div
                            key={book.isbn}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <Card className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden">
                              <CardContent className="p-0">
                                <div className="relative">
                                  <Image
                                    src={book.image || "/placeholder.svg?height=240&width=160"}
                                    alt={book.title}
                                    width={160}
                                    height={240}
                                    className="w-full h-48 object-cover"
                                  />
                                  <div
                                    className={`absolute top-3 right-3 p-2 rounded-full bg-gradient-to-r ${getStatusColor(book.status)} text-white`}
                                  >
                                    <StatusIcon className="w-4 h-4" />
                                  </div>
                                  {book.status === "reading" && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="flex-1 bg-gray-600 rounded-full h-2">
                                          <div
                                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${book.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-white text-xs">{book.progress}%</span>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="p-4">
                                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{book.title}</h3>
                                  <div className="flex items-center justify-between">
                                    <Badge
                                      className={`bg-gradient-to-r ${getStatusColor(book.status)} text-white border-none text-xs`}
                                    >
                                      {book.status.replace("-", " ")}
                                    </Badge>
                                    <Link href={`/books/${book.isbn}`}>
                                      <Button
                                        size="sm"
                                        className="bg-white/20 hover:bg-white/30 text-white border-white/20 text-xs"
                                      >
                                        View
                                      </Button>
                                    </Link>
                                  </div>
                                  {book.status === "reading" && (
                                    <div className="mt-3">
                                      <Input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={book.progress}
                                        onChange={(e) => updateBookProgress(book.isbn, Number.parseInt(e.target.value))}
                                        className="w-full"
                                      />
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">No reading list selected</h3>
                  <p className="text-gray-400">Select a list from the sidebar to view your books</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
