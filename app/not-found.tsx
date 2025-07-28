import React from 'react'

export default function NotFound() {
  return (
    <main className="bg-gray-50 flex items-center justify-center h-screen">
  <div className="text-center p-6">
    
    <h1 className="text-8xl font-extrabold text-purple-600">404</h1>
    <p className="mt-4 text-xl font-semibold text-gray-800">Whoops!</p>
    <p className="mt-2 text-gray-600 max-w-md mx-auto">
      Something went wrong. The page you’re looking for isn’t found,
      we suggest you back to home.
    </p>
    
    <div className="mt-6">
      <a href="index.html"
        className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow">
        Back to home page
      </a>
    </div>
  </div>
</main>
  )
}
