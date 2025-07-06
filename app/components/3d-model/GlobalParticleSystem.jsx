'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GlobalParticleSystem({ count = 200, ...props }) {
  const meshRef = useRef()
  const particlesRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        // Phân bố particles trên toàn màn hình
        positions[i * 3] = (Math.random() - 0.5) * 40 // X: -20 đến 20
        positions[i * 3 + 1] = (Math.random() - 0.5) * 40 // Y: -20 đến 20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20 // Z: -10 đến 10

        // Màu sắc phù hợp với theme
        const colorChoice = Math.random()
        if (colorChoice < 0.3) {
          // Màu xanh theme
          colors[i * 3] = 0.086 // #16f2b3
          colors[i * 3 + 1] = 0.949
          colors[i * 3 + 2] = 0.702
        } else if (colorChoice < 0.6) {
          // Màu tím theme
          colors[i * 3] = 0.655 // #a78bfa
          colors[i * 3 + 1] = 0.545
          colors[i * 3 + 2] = 0.980
        } else {
          // Màu trắng nhẹ
          colors[i * 3] = 0.8
          colors[i * 3 + 1] = 0.8
          colors[i * 3 + 2] = 0.9
        }

        sizes[i] = Math.random() * 0.15 + 0.05
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
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
        // Chuyển động chậm và mượt mà
        positions[i] += Math.sin(time * 0.3 + i * 0.1) * 0.005
        positions[i + 1] += Math.cos(time * 0.4 + i * 0.1) * 0.005
        positions[i + 2] += Math.sin(time * 0.2 + i * 0.1) * 0.003
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
      particlesRef.current.rotation.y += 0.0005 // Xoay rất chậm
    }
  })

  return <group ref={meshRef} {...props} />
} 