'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleSystem({ count = 100, ...props }) {
  const meshRef = useRef()
  const particlesRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20

        colors[i * 3] = Math.random() * 0.5 + 0.5
        colors[i * 3 + 1] = Math.random() * 0.5 + 0.5
        colors[i * 3 + 2] = Math.random() * 0.5 + 0.5

        sizes[i] = Math.random() * 0.1 + 0.05
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      })

      particlesRef.current = new THREE.Points(geometry, material)
      meshRef.current.add(particlesRef.current)
    }
  }, [count])

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime
      const positions = particlesRef.current.geometry.attributes.position.array

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.01
        positions[i + 1] += Math.cos(time + i) * 0.01
        positions[i + 2] += Math.sin(time * 0.5 + i) * 0.01
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.rotation.y += 0.001
    }
  })

  return <group ref={meshRef} {...props} />
} 