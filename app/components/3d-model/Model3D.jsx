'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useRef } from 'react'
import HealthBot from './HealthBot'
import LightController from './LightController'
import ParticleSystem from './ParticleSystem'

export default function Model3D({ className = '', style = {} }) {
  const [lightsOn, setLightsOn] = useState(true)
  const [botState, setBotState] = useState('normal') // 'normal', 'flyingOut', 'flyingIn', 'hidden'
  const [showGreeting, setShowGreeting] = useState(false)
  const [showGoodbye, setShowGoodbye] = useState(false)
  const animationTimeout = useRef(null)
  const messageTimeout = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const handleToggleLights = (newState) => {
    setLightsOn(newState)
    if (!newState) {
      // Hiện goodbye trước 1.5s, sau đó mới bay đi
      setShowGoodbye(true)
      if (messageTimeout.current) clearTimeout(messageTimeout.current)
      messageTimeout.current = setTimeout(() => {
        setShowGoodbye(false)
        setBotState('flyingOut')
        // Sau 5.2s (animation), ẩn bot
        if (animationTimeout.current) clearTimeout(animationTimeout.current)
        animationTimeout.current = setTimeout(() => setBotState('hidden'), 5200)
      }, 1500)
    } else {
      setBotState('flyingIn')
      // Sau 5.2s, về trạng thái bình thường
      if (animationTimeout.current) clearTimeout(animationTimeout.current)
      animationTimeout.current = setTimeout(() => {
        setBotState('normal')
        setShowGreeting(true)
        if (messageTimeout.current) clearTimeout(messageTimeout.current)
        messageTimeout.current = setTimeout(() => setShowGreeting(false), 1500)
      }, 5200)
    }
  }

  // Xử lý khi click vào bot
  const handleBotClick = () => {
    if (!isSpinning) {
      setIsSpinning(true)
      setTimeout(() => setIsSpinning(false), 1500) // 1.5s spin
    }
  }

  // Clean up timeout khi unmount
  React.useEffect(() => () => {
    if (animationTimeout.current) clearTimeout(animationTimeout.current)
    if (messageTimeout.current) clearTimeout(messageTimeout.current)
  }, [])

  // CSS cho hiệu ứng container
  let containerClass = `w-full h-full min-h-[400px] overflow-visible cursor-grab active:cursor-grabbing ${className} `
  if (botState === 'flyingOut' || botState === 'hidden') {
    containerClass += 'transition-all duration-1000 ease-in-out opacity-0 scale-50 translate-x-[60vw] -translate-y-[40vh] pointer-events-none';
  } else if (botState === 'flyingIn') {
    containerClass += 'transition-all duration-1000 ease-in-out opacity-100 scale-100 translate-x-0 translate-y-0';
  } else {
    containerClass += 'transition-all duration-500 opacity-100 scale-100 translate-x-0 translate-y-0';
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Nút LightController luôn ở góc trên phải, không bị animate */}
      <LightController onToggleLights={handleToggleLights} />
      {/* Tooltip hướng dẫn luôn cố định, không bay theo bot */}
      {!(botState === 'flyingOut' || botState === 'hidden') && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded z-50">
          🖱️ Drag to rotate
        </div>
      )}
      <div 
        className={containerClass}
        style={{ ...style, overflow: 'visible', position: 'relative' }}
      >
        {/* Hiện greeting/goodbye message trên đầu bot */}
        {(showGreeting || showGoodbye) && (
          <div className="absolute left-1/2 top-8 -translate-x-1/2 bg-white/90 text-black text-lg font-bold px-4 py-2 rounded-full shadow z-50 select-none pointer-events-none animate-fadein">
            {showGreeting ? "Hi, I'm Bot !!!" : "Goodbye..zzz"}
          </div>
        )}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          shadows
          gl={{ 
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
          }}
        >
          <Suspense fallback={null}>
            <HealthBot 
              lightsOn={lightsOn} 
              botState={botState} 
              isSpinning={isSpinning}
              onClick={handleBotClick}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
} 