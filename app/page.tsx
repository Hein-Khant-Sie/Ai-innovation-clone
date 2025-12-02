'use client'

import ChatInterface from '@/components/ChatInterface'
import { Bot } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Share your location (text or photo) • Tell us where you want to go • Get directions
          </p>
        </div>

        {/* Chat Interface */}
        <ChatInterface />
      </div>
    </main>
  )
}

