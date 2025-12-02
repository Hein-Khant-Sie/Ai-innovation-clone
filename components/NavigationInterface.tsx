'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Navigation, MapPin, Clock, ArrowRight } from 'lucide-react'
import { getNavigationRoute } from '@/lib/bmcc-data'

interface NavigationInterfaceProps {
  currentLocation: string
  destination: string
  onReset: () => void
}

export default function NavigationInterface({
  currentLocation,
  destination,
  onReset,
}: NavigationInterfaceProps) {
  const [route, setRoute] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const navigationRoute = getNavigationRoute(currentLocation, destination)
    setRoute(navigationRoute)
    setCurrentStep(0)
  }, [currentLocation, destination])

  if (!route) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-600">Calculating route...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <button
          onClick={onReset}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start Over
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Navigation Route
            </h2>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-green-500" />
                <span>From: {currentLocation}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                <span>To: {destination}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-primary-600 mb-1">
              <Clock className="w-5 h-5 mr-2" />
              <span className="text-xl font-semibold">{route.estimatedTime}</span>
            </div>
            <p className="text-sm text-gray-500">{route.distance}</p>
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Route Map</h3>
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden">
          {/* Simple visual representation */}
          <div className="relative w-full h-full">
            {/* Start Point */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              <p className="text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                Start
              </p>
            </div>

            {/* Route Line */}
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 w-[calc(100%-8rem)] h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>

            {/* End Point */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-lg"></div>
              <p className="text-xs mt-2 text-gray-700 font-medium whitespace-nowrap">
                Destination
              </p>
            </div>

            {/* Building markers */}
            {route.buildings && route.buildings.map((building: string, idx: number) => (
              <div
                key={idx}
                className="absolute"
                style={{
                  left: `${20 + (idx + 1) * 15}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                <p className="text-xs mt-1 text-gray-600 whitespace-nowrap text-center">
                  {building}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Directions */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Step-by-Step Directions
        </h3>
        <div className="space-y-4">
          {route.steps.map((step: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                index === currentStep
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    index === currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{step.instruction}</p>
                  {step.details && (
                    <p className="text-sm text-gray-600 mt-1">{step.details}</p>
                  )}
                </div>
                {index === currentStep && (
                  <Navigation className="w-5 h-5 text-primary-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentStep(Math.min(route.steps.length - 1, currentStep + 1))
            }
            disabled={currentStep === route.steps.length - 1}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Next
            <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

