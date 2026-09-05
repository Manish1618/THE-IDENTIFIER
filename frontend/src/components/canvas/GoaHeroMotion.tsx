import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Constantly running, scroll-reactive 3D holographic centerpiece
function MorphingHologram({ scrollProgress, currentStep }: { scrollProgress: number; currentStep: number }) {
  const coreRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Determine active geometry mode from scroll progress & current step
  // 0: Icosahedron, 1: Torus Knot, 2: Dodecahedron, 3: Octahedron, 4: Sphere Shield
  const shapeIndex = Math.min(Math.floor(scrollProgress * 5), 4)

  // Dynamic color calculation based on scroll progress & continuous sine wave
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Smooth multi-axis rotation that accelerates on scroll
    const spinSpeed = 0.5 + scrollProgress * 1.5
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * spinSpeed
      coreRef.current.rotation.x = Math.sin(time * 0.7) * 0.25
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * (spinSpeed * 0.8)
      wireRef.current.rotation.z += delta * 0.3
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.6
      ring1Ref.current.rotation.y += delta * 0.4
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.5
      ring2Ref.current.rotation.z += delta * 0.4
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.2
    }
  })

  // Dynamic hue sweep: Teal (175) -> Sky (200) -> Emerald (150) -> Purple (280) -> Gold/Rose (340)
  const baseHues = [175, 205, 155, 280, 345]
  const currentHue = (baseHues[(currentStep - 1) % baseHues.length] + scrollProgress * 100) % 360
  const coreColor = `hsl(${currentHue}, 88%, 56%)`
  const emissiveColor = `hsl(${currentHue}, 95%, 12%)`
  const cageColor = `hsl(${(currentHue + 25) % 360}, 90%, 65%)`
  const ringColor = `hsl(${(currentHue + 45) % 360}, 95%, 70%)`

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2.8} rotationIntensity={0.7} floatIntensity={1.4}>
        {/* Core Shape that morphs across geometries */}
        <mesh ref={coreRef} scale={1.8 + scrollProgress * 0.3}>
          {shapeIndex === 0 && <icosahedronGeometry args={[1, 3]} />}
          {shapeIndex === 1 && <torusKnotGeometry args={[0.7, 0.25, 100, 16]} />}
          {shapeIndex === 2 && <dodecahedronGeometry args={[1, 0]} />}
          {shapeIndex === 3 && <octahedronGeometry args={[1.1, 0]} />}
          {shapeIndex === 4 && <sphereGeometry args={[1, 32, 32]} />}

          <MeshDistortMaterial
            color={coreColor}
            emissive={emissiveColor}
            roughness={0.15}
            metalness={0.85}
            distort={0.3 + scrollProgress * 0.35}
            speed={2.5}
          />
        </mesh>

        {/* Outer Wireframe Lattice */}
        <mesh ref={wireRef} scale={2.4 + scrollProgress * 0.2}>
          {shapeIndex === 0 && <octahedronGeometry args={[1, 1]} />}
          {shapeIndex === 1 && <torusGeometry args={[1.5, 0.4, 16, 50]} />}
          {shapeIndex === 2 && <icosahedronGeometry args={[1.1, 1]} />}
          {shapeIndex === 3 && <boxGeometry args={[1.4, 1.4, 1.4]} />}
          {shapeIndex === 4 && <dodecahedronGeometry args={[1.2, 1]} />}

          <meshStandardMaterial
            color={cageColor}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Orbit Ring 1 */}
        <group ref={ring1Ref}>
          <mesh rotation={[Math.PI / 3.2, 0, 0]}>
            <torusGeometry args={[2.9, 0.035, 16, 120]} />
            <meshBasicMaterial color={ringColor} transparent opacity={0.65} />
          </mesh>
        </group>

        {/* Orbit Ring 2 (Orthogonal Gyroscope) */}
        <group ref={ring2Ref}>
          <mesh rotation={[0, Math.PI / 2.8, Math.PI / 4]}>
            <torusGeometry args={[3.2, 0.025, 16, 120]} />
            <meshBasicMaterial color={coreColor} transparent opacity={0.45} />
          </mesh>
        </group>
      </Float>
    </group>
  )
}

interface GoaHeroMotionProps {
  currentStep: number
  onNext: () => void
  onPrev: () => void
  onSelectStep: (step: number) => void
}

export const GoaHeroMotion: React.FC<GoaHeroMotionProps> = ({
  currentStep,
  onNext,
  onPrev,
  onSelectStep,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const current = totalScroll > 0 ? window.scrollY / totalScroll : 0
      setScrollProgress(Math.min(Math.max(current, 0), 1))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stepHeadlines = [
    'BIOMETRIC SCAN',
    'OSINT FOOTPRINT',
    'CANONICAL MATCH',
    'AMOY ATTEST',
    'VERIFIED PROOF',
  ]

  return (
    <div className="relative w-full overflow-hidden py-8 md:py-14 select-none">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] max-w-[1000px] h-[450px] bg-gradient-to-r from-teal-500/15 via-emerald-500/15 to-purple-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* CONTINUOUS LEFT-TO-RIGHT MOVING MARQUEE TICKER TAPE BEHIND 3D HERO */}
      <div className="w-full overflow-hidden py-2 mb-4 border-y border-teal-500/20 bg-teal-950/20 backdrop-blur-sm">
        <div className="animate-marquee-ltr text-xs md:text-sm font-mono font-bold tracking-[0.25em] text-teal-300/80 whitespace-nowrap">
          <span>THE IDENTITY ✦ MULTIMODAL BIOMETRIC PROTOCOL ✦ 512-D FACENET EMBEDDING ✦ ZERO-KNOWLEDGE PROOF OF PERSONHOOD ✦ GEMINI 3.6 VISION OSINT ✦ RFC 8785 CANONICAL HASHER ✦ POLYGON AMOY ATTESTATION ✦ &nbsp;</span>
          <span>THE IDENTITY ✦ MULTIMODAL BIOMETRIC PROTOCOL ✦ 512-D FACENET EMBEDDING ✦ ZERO-KNOWLEDGE PROOF OF PERSONHOOD ✦ GEMINI 3.6 VISION OSINT ✦ RFC 8785 CANONICAL HASHER ✦ POLYGON AMOY ATTESTATION ✦ &nbsp;</span>
        </div>
      </div>

      {/* Massive Bold Headline Behind 3D (Subtly gliding from left to right) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="whitespace-nowrap"
        >
          <motion.h1
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.12, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="text-[12vw] font-black tracking-tighter uppercase text-slate-100 whitespace-nowrap leading-none select-none"
          >
            {stepHeadlines[currentStep - 1]}
          </motion.h1>
        </motion.div>
      </div>

      {/* Grid Layout spanning full width */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[420px] px-2">
        {/* Left Column: Narrative description & spinning circular identity badge */}
        <div className="md:col-span-3 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-teal-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              THE IDENTITY PROTOCOL // GOA 2026
            </span>
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Decentralized biometric attestation protocol. Encodes facial geometry into 512-D
              canonical vectors and anchors them immutably to Polygon Amoy.
            </p>
          </div>

          {/* Spinning Circular Badge: THE IDENTITY • HACKERHOUSE GOA */}
          <div className="flex items-center gap-4 pt-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 animate-spin-slow">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    id="identityBadgePath"
                    d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    fill="none"
                  />
                  <text className="text-[8px] font-mono font-bold tracking-[0.28em] fill-teal-400">
                    <textPath href="#identityBadgePath">
                      • THE IDENTITY • HACKERHOUSE GOA
                    </textPath>
                  </text>
                </svg>
              </div>
              <div className="w-12 h-12 rounded-full glass-panel flex flex-col items-center justify-center text-teal-300 font-mono font-bold text-xs shadow-inner">
                <span>0{currentStep}</span>
                <span className="text-[8px] text-slate-400">/ 05</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              <span className="text-teal-300 font-bold block">SCROLL-REACTIVE</span>
              <span>Shape & Color Morph</span>
            </div>
          </div>
        </div>

        {/* Center Column: 3D Floating & Morphing Holographic Canvas */}
        <div className="md:col-span-6 h-80 md:h-[420px] relative flex items-center justify-center cursor-grab active:cursor-grabbing">
          <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
            <ambientLight intensity={1.0} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#14b8a6" />
            <pointLight position={[-10, -10, -10]} intensity={2.0} color="#a855f7" />
            <pointLight position={[0, -10, 5]} intensity={1.2} color="#38bdf8" />
            <MorphingHologram scrollProgress={scrollProgress} currentStep={currentStep} />
          </Canvas>

          {/* Morphing telemetry badge */}
          <div className="absolute bottom-2 px-3 py-1 rounded-full glass-pill text-[10px] font-mono text-teal-300/80 pointer-events-none flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
            <span>MORPH STAGE: 0{Math.min(Math.floor(scrollProgress * 5) + 1, 5)} / 05</span>
          </div>
        </div>

        {/* Right Column: Stacked Circular Arrow Navigation */}
        <div className="md:col-span-3 flex md:flex-col items-center justify-center md:items-end gap-4">
          {/* Circular Next Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={currentStep === 5}
            className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center text-xl font-bold transition-all shadow-lg ${
              currentStep === 5
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'text-teal-300 hover:bg-teal-400/20 hover:text-teal-200 border-teal-500/40 hover:border-teal-400'
            }`}
            title="Next Step"
          >
            →
          </motion.button>

          {/* Circular Prev Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrev}
            disabled={currentStep === 1}
            className={`w-14 h-14 rounded-full glass-panel flex items-center justify-center text-xl font-bold transition-all shadow-lg ${
              currentStep === 1
                ? 'opacity-30 cursor-not-allowed text-slate-600'
                : 'text-teal-300 hover:bg-teal-400/20 hover:text-teal-200 border-teal-500/40 hover:border-teal-400'
            }`}
            title="Previous Step"
          >
            ←
          </motion.button>

          {/* Step Dots indicator */}
          <div className="flex md:flex-col gap-2 pt-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => onSelectStep(s)}
                className={`transition-all rounded-full ${
                  s === currentStep
                    ? 'w-8 h-2 md:w-2 md:h-8 bg-teal-400 shadow-[0_0_12px_#2dd4bf]'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to Step ${s}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Feature Columns - Wide Full Width */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-6 border-t border-slate-800/80">
        <div className="p-4 rounded-2xl glass-panel text-left hover:border-teal-500/40 transition-all hover:bg-slate-900/50">
          <div className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            512-D VECTOR MAP
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Facenet & RetinaFace deep embedding creates a deterministic cryptographic fingerprint across 512 dimensions.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel text-left hover:border-emerald-500/40 transition-all hover:bg-slate-900/50">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            GEMINI 3.6 VISION
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multimodal AI reverse visual search detects social handles and web identity profiles without stale cache.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel text-left hover:border-purple-500/40 transition-all hover:bg-slate-900/50">
          <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            POLYGON AMOY (80002)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pinata IPFS CID and EVM Keccak-256 hash anchored with immutable zero-knowledge proof on Polygon Amoy.
          </p>
        </div>
      </div>
    </div>
  )
}
