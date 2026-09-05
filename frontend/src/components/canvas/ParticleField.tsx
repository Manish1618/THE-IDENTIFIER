import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMotionPreference } from '@/hooks/useMotionPreference'

function MatrixRain() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const { positions, colors } = useMemo(() => {
    const count = 1000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = Math.random() * 20 + 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      const colorChoice = Math.random()
      if (colorChoice < 0.7) {
        colors[i * 3] = 0.0
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = 0.78
      } else {
        colors[i * 3] = 0.06
        colors[i * 3 + 1] = 0.73
        colors[i * 3 + 2] = 0.51
      }
    }
    
    return { positions, colors }
  }, [])

  useFrame((_, delta) => {
    if (!particlesRef.current) return
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 1] -= delta * (2 + Math.random() * 3)
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] = 20
        positions[i * 3] = (Math.random() - 0.5) * 40
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export function ParticleField() {
  const prefersReducedMotion = useMotionPreference()

  if (prefersReducedMotion) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10 particle-field">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <MatrixRain />
      </Canvas>
    </div>
  )
}
