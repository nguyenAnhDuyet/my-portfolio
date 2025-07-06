'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, Environment, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'
import DynamicPointLight from './DynamicPointLight'

export default function HealthBot({ lightsOn = true, botState = 'normal', isSpinning = false, onAnimationComplete, onClick, ...props }) {
  const gltf = useLoader(GLTFLoader, '/models/health-bot.glb')
  const meshRef = useRef()
  const mixerRef = useRef()
  const [spinStartTime, setSpinStartTime] = useState(null)

  const targetRotation = {
    normal: [0, -Math.PI / 2, 0], // Quay mặt ra user, nghiêng 90 độ sang trái
    flyingOut: [0, Math.PI, Math.PI / 2],
    flyingIn: [0, Math.PI, Math.PI / 2],
    hidden: [0, Math.PI, Math.PI / 2],
  }

  // Animation state
  const anim = useRef({
    position: [0, -0.3, 0],
    rotation: [0, -Math.PI / 2, 0],
    scale: 0.8,
    progress: 0,
    lastState: 'normal',
  })

  // Khi bắt đầu spin, lưu lại thời gian bắt đầu
  useEffect(() => {
    if (isSpinning) {
      setSpinStartTime(performance.now() / 1000)
    } else {
      setSpinStartTime(null)
    }
  }, [isSpinning])

  // Complex animation with multiple movements and bone animations
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Update animation mixer if it exists
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    // Chuyển động lắc lư nhẹ nhàng (vẫn giữ cho cả spin)
    meshRef.current.position.y = Math.sin(time * 1.2) * 0.08;
    meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.02;

    // Animation for flying in/out và các trạng thái khác
    let target = {
      position: [0, -0.3, 0],
      rotation: [0, -Math.PI / 2, 0],
      scale: 0.8,
    }
    if (botState === 'flyingOut') {
      target = {
        position: [2.5, 2.5, 0],
        rotation: [0, Math.PI / 2, 0],
        scale: 0.2,
      }
      anim.current.progress = Math.min(anim.current.progress + delta / 5.1, 1)
    } else if (botState === 'flyingIn') {
      target = {
        position: [0, -0.3, 0],
        rotation: [0, -Math.PI / 2, 0],
        scale: 0.8,
      }
      anim.current.progress = Math.max(anim.current.progress - delta / 5.1, 0)
    } else if (botState === 'hidden') {
      anim.current.progress = 1
    } else {
      anim.current.progress = 0
    }
    // Tween
    const p = anim.current.progress
    const lerp = (a, b, t) => a + (b - a) * t
    const lerpArr = (a, b, t) => a.map((v, i) => lerp(v, b[i], t))
    // Lerp position, rotation, scale
    let pos, rot, scale
    if (botState === 'flyingOut') {
      pos = lerpArr([0, -0.3, 0], [2.5, 2.5, 0], p)
      rot = lerpArr([0, -Math.PI / 2, 0], [0, Math.PI / 2, 0], p)
      scale = lerp(0.8, 0.2, p)
    } else if (botState === 'flyingIn') {
      pos = lerpArr([2.5, 2.5, 0], [0, -0.3, 0], 1 - p)
      rot = lerpArr([0, Math.PI / 2, 0], [0, -Math.PI / 2, 0], 1 - p)
      scale = lerp(0.2, 0.8, 1 - p)
    } else if (botState === 'hidden') {
      pos = [2.5, 2.5, 0]
      rot = [0, Math.PI / 2, 0]
      scale = 0.2
    } else {
      pos = [0, -0.3, 0]
      rot = [0, -Math.PI / 2, 0]
      scale = 0.8
    }
    meshRef.current.position.set(...pos)
    meshRef.current.scale.set(scale, scale, scale)
    if (isSpinning && spinStartTime !== null) {
      const spinSpeed = Math.PI * 2 * 1; // 1 vòng/giây (xoay chậm)
      const elapsed = time - spinStartTime;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
      meshRef.current.rotation.y = -Math.PI / 2 + spinSpeed * elapsed;
      // Duỗi thẳng hai cánh khi spin
      if (gltf.scene) {
        gltf.scene.traverse((child) => {
          if (child.name === 'WingsRightGRP' || child.name === 'WingsLeftGRP') {
            child.rotation.x = 0;
            child.rotation.z = 0;
          }
        });
      }
    } else {
      meshRef.current.rotation.set(...rot)
      // Animation cũ cho hai cánh
      if (gltf.scene) {
        gltf.scene.traverse((child) => {
          if (child.name === 'WingsRightGRP') {
            child.rotation.x = Math.sin(time * 2) * 0.7;
            child.rotation.z = 0;
          }
          if (child.name === 'WingsLeftGRP') {
            child.rotation.x = Math.sin(time * 2 + Math.PI) * 0.7;
            child.rotation.z = 0;
          }
        });
      }
    }
    // Khi xong animation, gọi callback
    if ((botState === 'flyingOut' && p >= 1) || (botState === 'flyingIn' && p <= 0)) {
      if (onAnimationComplete && anim.current.lastState !== botState) {
        onAnimationComplete(botState)
        anim.current.lastState = botState
      }
    }
  })

  // Optimize the model and debug bone names
  useEffect(() => {
    if (gltf.scene) {
      console.log('=== Model Structure ===')
      console.log('Available animations:', gltf.animations?.length || 0)
      
      // Set up animation mixer if animations exist
      if (gltf.animations && gltf.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(gltf.scene)
        gltf.animations.forEach((clip, index) => {
          console.log(`Animation ${index}: ${clip.name}`)
          const action = mixerRef.current.clipAction(clip)
          action.play()
        })
      }
      
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.needsUpdate = true
        }
        
        // Log all object names for debugging
        if (child.name) {
          console.log(`Object: ${child.name}, Type: ${child.type}`)
          // Đặc biệt log các object có thể là đèn
          if (child.name.toLowerCase().includes('light') || 
              child.name.toLowerCase().includes('lamp') || 
              child.name.toLowerCase().includes('gyro') ||
              child.name.toLowerCase().includes('emissive') ||
              child.name.toLowerCase().includes('wing') ||
              child.name.toLowerCase().includes('arm')) {
            console.log(`*** POTENTIAL LIGHT: ${child.name} ***`)
          }
        }
      })
    }
  }, [gltf])

  return (
    <>
      <group ref={meshRef} {...props} onClick={onClick}>
        <primitive 
          object={gltf.scene} 
          // scale, position, rotation sẽ được set động
        />
        {/* Khi spin, phát ra ánh sáng tím ở hai bên */}
        {isSpinning && (
          <>
            <spotLight
              position={[-1.2, 0.2, 0]}
              angle={0.6}
              penumbra={0.7}
              intensity={2.5}
              color="#a78bfa"
              distance={8}
              target-position={[-5, 0, 0]}
              castShadow={false}
            />
            <spotLight
              position={[1.2, 0.2, 0]}
              angle={0.6}
              penumbra={0.7}
              intensity={2.5}
              color="#a78bfa"
              distance={8}
              target-position={[5, 0, 0]}
              castShadow={false}
            />
          </>
        )}
      </group>
      
      {/* OrbitControls để xoay mô hình bằng chuột */}
      <OrbitControls 
        enablePan={false} // Tắt di chuyển ngang
        enableZoom={false} // Tắt zoom
        enableDamping={true} // Bật damping để chuyển động mượt
        dampingFactor={0.05} // Tốc độ damping
        rotateSpeed={0.8} // Tốc độ xoay
        minPolarAngle={Math.PI / 4} // Góc tối thiểu (45 độ)
        maxPolarAngle={Math.PI * 3 / 4} // Góc tối đa (135 độ)
        autoRotate={false} // Tắt tự động xoay
      />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
      />
      
      {/* Dynamic point lights */}
      <DynamicPointLight 
        position={[-5, 5, 5]} 
        intensity={0.5} 
        color="#16f2b3" 
        speed={1.2}
      />
      <DynamicPointLight 
        position={[5, -5, -5]} 
        intensity={0.5} 
        color="#a78bfa" 
        speed={0.8}
      />
      <DynamicPointLight 
        position={[0, 10, 0]} 
        intensity={0.3} 
        color="#ffffff" 
        speed={1.5}
      />
      <DynamicPointLight 
        position={[0, -10, 0]} 
        intensity={0.4} 
        color="#ff6b6b" 
        speed={1.0}
      />
      
      {/* Model lights - controlled by lightsOn prop */}
      {lightsOn && (
        <>
          <pointLight 
            position={[2, 2, 2]} 
            intensity={0.8} 
            color="#ffff00" 
            distance={5}
          />
          <pointLight 
            position={[-2, 2, 2]} 
            intensity={0.8} 
            color="#ffff00" 
            distance={5}
          />
          <pointLight 
            position={[0, 3, 0]} 
            intensity={0.6} 
            color="#00ffff" 
            distance={3}
          />
        </>
      )}
    </>
  )
} 