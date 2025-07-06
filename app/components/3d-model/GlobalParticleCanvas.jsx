'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import GlobalParticleSystem from './GlobalParticleSystem'

export default function GlobalParticleCanvas({ count = 150 }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
      >
        <Suspense fallback={null}>
          <GlobalParticleSystem count={count} />
        </Suspense>
      </Canvas>
    </div>
  )
} 