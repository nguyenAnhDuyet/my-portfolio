'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DynamicPointLight({ position, intensity, color, speed = 1.0, ...props }) {
  const lightRef = useRef()

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.elapsedTime * speed
      
      // Animate position
      lightRef.current.position.x = position[0] + Math.sin(time) * 2
      lightRef.current.position.y = position[1] + Math.cos(time * 0.7) * 1.5
      lightRef.current.position.z = position[2] + Math.sin(time * 0.5) * 1
      
      // Animate intensity
      lightRef.current.intensity = intensity + Math.sin(time * 2) * (intensity * 0.3)
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={position}
      intensity={intensity}
      color={color}
      distance={10}
      decay={2}
      {...props}
    />
  )
} 