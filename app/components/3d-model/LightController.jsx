'use client'

import { useState } from 'react'

export default function LightController({ onToggleLights }) {
  const [lightsOn, setLightsOn] = useState(true)

  const toggleLights = () => {
    setLightsOn(!lightsOn)
    onToggleLights(!lightsOn)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleLights}
        className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg border-2 border-yellow-400 ${
          lightsOn 
            ? 'bg-yellow-300 text-white hover:bg-yellow-200 drop-shadow-[0_2px_8px_rgba(255,255,0,0.7)]' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        aria-label={lightsOn ? 'Lights ON' : 'Lights OFF'}
        style={{ fontSize: 28, filter: lightsOn ? 'drop-shadow(0 0 8px #fff700)' : 'none' }}
      >
        {lightsOn ? '🔆' : '🌙'}
      </button>
    </div>
  )
} 