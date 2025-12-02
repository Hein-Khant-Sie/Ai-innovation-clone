'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, MapPin, Send, Loader2 } from 'lucide-react'

interface LocationInputProps {
  onLocationDetected: (location: string) => void
  onDestinationSet: (destination: string) => void
  currentLocation: string | null
}

export default function LocationInput({
  onLocationDetected,
  onDestinationSet,
  currentLocation,
}: LocationInputProps) {
  const [inputMode, setInputMode] = useState<'text' | 'camera'>('text')
  const [textInput, setTextInput] = useState('')
  const [destinationInput, setDestinationInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true)
    setImagePreview(URL.createObjectURL(file))

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/detect-location', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to detect location')
      }

      const data = await response.json()
      onLocationDetected(data.location)
    } catch (error) {
      console.error('Error detecting location:', error)
      alert('Failed to detect location from image. Please try again or use text input.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTextLocationSubmit = async () => {
    if (!textInput.trim()) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/parse-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput }),
      })

      if (!response.ok) {
        throw new Error('Failed to parse location')
      }

      const data = await response.json()
      onLocationDetected(data.location)
      setTextInput('')
    } catch (error) {
      console.error('Error parsing location:', error)
      alert('Failed to parse location. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDestinationSubmit = () => {
    if (!destinationInput.trim()) return
    onDestinationSet(destinationInput.trim())
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Location Input Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Where are you?
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === 'text'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Type Location
          </button>
          <button
            onClick={() => setInputMode('camera')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              inputMode === 'camera'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Take Photo
          </button>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextLocationSubmit()}
                placeholder="e.g., Main entrance, Library, Room 123..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isProcessing}
              />
              <button
                onClick={handleTextLocationSubmit}
                disabled={isProcessing || !textInput.trim()}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Camera/Upload Mode */}
        {inputMode === 'camera' && (
          <div className="space-y-3">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                <button
                  onClick={() => {
                    setImagePreview(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                    if (cameraInputRef.current) cameraInputRef.current.value = ''
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Take a photo or upload an image</p>
                <div className="flex gap-3 justify-center">
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                    id="camera-input"
                  />
                  <label
                    htmlFor="camera-input"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors"
                  >
                    <Camera className="w-4 h-4 inline mr-2" />
                    Camera
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label
                    htmlFor="file-input"
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Location Display */}
        {currentLocation && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Current Location:</strong> {currentLocation}
            </p>
          </div>
        )}
      </div>

      {/* Destination Input Section */}
      {currentLocation && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Where do you want to go?
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleDestinationSubmit()}
              placeholder="e.g., Room 201, Science Building, Cafeteria..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleDestinationSubmit}
              disabled={!destinationInput.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Navigate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

