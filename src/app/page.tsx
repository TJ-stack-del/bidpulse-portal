'use client'

import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="w-full flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="text-xl font-bold tracking-tight">BidPulse Portal</div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
          Turnkey Proposal Assembly & Operations
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Manage your assembly deadlines, internal margins, automated queues, and customer orders seamlessly in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-md hover:bg-indigo-700 transition"
          >
            Access Portal & Admin
          </Link>
          <Link
            href="/forgot-password"
            className="rounded-md border border-gray-300 dark:border-gray-700 px-6 py-3 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Reset Password
          </Link>
        </div>
      </main>

      <footer className="w-full p-6 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
        &copy; {new Date().getFullYear()} BidPulse Portal. All rights reserved.
      </footer>
    </div>
  )
}
