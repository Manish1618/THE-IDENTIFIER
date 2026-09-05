import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ParticleField } from '@/components/canvas/ParticleField'
import { GoaHeroMotion } from '@/components/canvas/GoaHeroMotion'
import { StatusIndicator } from '@/components/hud/StatusIndicator'
import { StepCard } from '@/components/pipeline/StepCard'
import { Step1FaceIngestion } from '@/components/pipeline/Step1FaceIngestion'
import { Step2SocialSearch } from '@/components/pipeline/Step2SocialSearch'
import { Step3BiometricVerify } from '@/components/pipeline/Step3BiometricVerify'
import { Step4IPFSAnchor } from '@/components/pipeline/Step4IPFSAnchor'
import { Step5ChainVerify } from '@/components/pipeline/Step5ChainVerify'
import { usePipelineStore } from '@/store/pipelineStore'
import { cyberSound } from '@/utils/cyberSound'
import { healthCheck } from '@/api/client'

const STEP_TITLES = [
  {
    num: 1,
    title: 'Biometric Face Ingestion',
    sub: '512-D Facenet & RetinaFace feature vector extraction',
    badge: 'FACENET 512-D',
    short: '01 Ingest',
  },
  {
    num: 2,
    title: 'Social Media & Web OSINT Search',
    sub: 'Multi-tiered Google Lens, Gemini 3.6 Vision & DDGS footprint discovery',
    badge: 'GEMINI 3.6 VISION',
    short: '02 OSINT',
  },
  {
    num: 3,
    title: 'Biometric Verification & Canonical Hash',
    sub: 'Cosine angle similarity scoring & RFC 8785 canonical digest',
    badge: 'KECCAK-256',
    short: '03 Match',
  },
  {
    num: 4,
    title: 'Pinata IPFS & Polygon Amoy Attestation',
    sub: 'Decentralized immutable anchoring to Polygon testnet (80002)',
    badge: 'POLYGON AMOY',
    short: '04 Anchor',
  },
  {
    num: 5,
    title: 'On-Chain Verification & Tamper Detection',
    sub: 'Live smart contract state query & cryptographic tamper attack simulation',
    badge: 'IMMUTABLE PROOF',
    short: '05 Verify',
  },
]

function App() {
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    carouselView,
    setCarouselView,
    soundEnabled,
    toggleSound,
    resetPipeline,
    faceCrop,
    similarity,
    txHash,
    chainVerified,
    tamperDemoActive,
  } = usePipelineStore()

  const [healthStatus, setHealthStatus] = useState<string>('CONNECTING...')
  const [openAccordionStep, setOpenAccordionStep] = useState<number>(1)

  useEffect(() => {
    healthCheck()
      .then(() => setHealthStatus('ONLINE // POLYGON AMOY 80002'))
      .catch(() => setHealthStatus('LOCAL SIMULATION ACTIVE'))
  }, [])

  const getStepStatus = (stepNum: number): 'pending' | 'active' | 'completed' | 'error' => {
    if (tamperDemoActive && stepNum === 5) return 'error'
    if (stepNum === 1) return faceCrop ? 'completed' : currentStep === 1 ? 'active' : 'pending'
    if (stepNum === 2) return similarity > 0 || currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending'
    if (stepNum === 3) return similarity > 0 ? 'completed' : currentStep === 3 ? 'active' : 'pending'
    if (stepNum === 4) return txHash ? 'completed' : currentStep === 4 ? 'active' : 'pending'
    if (stepNum === 5) return chainVerified ? 'completed' : currentStep === 5 ? 'active' : 'pending'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans overflow-x-hidden relative selection:bg-teal-400 selection:text-slate-950">
      {/* Soft Ambient Radial Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-20">
        <div className="absolute top-0 left-1/4 w-[700px] h-[500px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[500px] bg-purple-500/10 rounded-full blur-[160px]" />
      </div>

      {/* WebGL Matrix Particle Canvas */}
      <ParticleField />

      {/* Main Container */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
        {/* Top Floating Sleek Navigation Bar */}
        <header className="w-full mb-6 p-3.5 px-6 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4 shadow-xl border border-teal-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center font-extrabold text-slate-950 text-base shadow-md">
              ⌘
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">
                  THE IDENTITY
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 font-mono font-semibold border border-teal-500/30">
                  HACKERHOUSE GOA
                </span>
              </div>
            </div>
          </div>

          {/* Center Step Pills for Quick Jumper */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-900/60 border border-slate-800">
            {STEP_TITLES.map((step) => {
              const isActive = currentStep === step.num
              return (
                <button
                  key={step.num}
                  onClick={() => {
                    if (soundEnabled) cyberSound.playClick()
                    setCurrentStep(step.num)
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {step.short}
                </button>
              )
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <StatusIndicator status="online" label={healthStatus} />

            {/* Sound Toggle */}
            <button
              onClick={() => {
                toggleSound()
                cyberSound.playClick()
              }}
              title="Toggle Audio Feedback"
              className={`w-9 h-9 rounded-full glass-pill flex items-center justify-center text-sm transition-all ${
                soundEnabled
                  ? 'text-teal-300 border-teal-500/40 bg-teal-500/10'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* View Mode Toggle */}
            <button
              onClick={() => {
                if (soundEnabled) cyberSound.playClick()
                setCarouselView(!carouselView)
              }}
              title="Toggle View Mode"
              className="px-3.5 py-1.5 rounded-full glass-pill hover:border-slate-600 text-xs font-medium text-slate-300 transition-all flex items-center gap-1.5"
            >
              <span>{carouselView ? '📑' : '🎠'}</span>
              <span className="hidden sm:inline">{carouselView ? 'Stacked' : 'Carousel'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                if (soundEnabled) cyberSound.playClick()
                resetPipeline()
              }}
              title="Reset Protocol"
              className="px-3.5 py-1.5 rounded-full glass-pill hover:border-rose-500/40 text-xs font-medium text-slate-300 hover:text-rose-300 transition-all"
            >
              Reset
            </button>
          </div>
        </header>

        {/* 3D Hero Motion Centerpiece (Directly from small-thumbnail reference video) */}
        <GoaHeroMotion
          currentStep={currentStep}
          onNext={() => {
            if (soundEnabled) cyberSound.playClick()
            nextStep()
          }}
          onPrev={() => {
            if (soundEnabled) cyberSound.playClick()
            prevStep()
          }}
          onSelectStep={(step) => {
            if (soundEnabled) cyberSound.playClick()
            setCurrentStep(step)
          }}
        />

        {/* ================= CAROUSEL STEP DISPLAY ================= */}
        {carouselView ? (
          <div className="w-full max-w-[1550px] mx-auto my-8 space-y-6">
            {/* Step Card */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 border border-slate-700/60 shadow-2xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold flex items-center justify-center text-xs">
                      0{currentStep}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {STEP_TITLES[currentStep - 1].title}
                    </h2>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {STEP_TITLES[currentStep - 1].badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {STEP_TITLES[currentStep - 1].sub}
                  </p>
                </div>

                <span
                  className={`text-[11px] font-mono px-3 py-1 rounded-full font-bold tracking-wider ${
                    getStepStatus(currentStep) === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                  }`}
                >
                  {getStepStatus(currentStep) === 'completed' ? '✓ VERIFIED' : 'ACTIVE'}
                </span>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && <Step1FaceIngestion />}
                  {currentStep === 2 && <Step2SocialSearch />}
                  {currentStep === 3 && <Step3BiometricVerify />}
                  {currentStep === 4 && <Step4IPFSAnchor />}
                  {currentStep === 5 && <Step5ChainVerify />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          /* ================= STACKED ACCORDION VIEW ================= */
          <div className="w-full max-w-[1550px] mx-auto my-8 space-y-4">
            {STEP_TITLES.map((step) => {
              const isOpen = openAccordionStep === step.num
              const status = getStepStatus(step.num)
              return (
                <StepCard
                  key={step.num}
                  stepNumber={step.num}
                  title={step.title}
                  subtitle={step.sub}
                  status={status}
                  isOpen={isOpen}
                  onToggle={() => setOpenAccordionStep(isOpen ? 0 : step.num)}
                  badge={step.badge}
                >
                  {step.num === 1 && <Step1FaceIngestion />}
                  {step.num === 2 && <Step2SocialSearch />}
                  {step.num === 3 && <Step3BiometricVerify />}
                  {step.num === 4 && <Step4IPFSAnchor />}
                  {step.num === 5 && <Step5ChainVerify />}
                </StepCard>
              )
            })}
          </div>
        )}

        {/* Minimal Clean Footer */}
        <footer className="mt-14 text-center text-xs font-mono text-slate-500 space-y-1.5 py-6 border-t border-slate-800/80">
          <p>THE IDENTITY PROTOCOL • HACKERHOUSE GOA 2026 EDITION</p>
          <p className="text-[10px] text-slate-600">
            Polygon Amoy Chain ID 80002 • Contract: 0x8b32608447d2f97a8E5FF593B612E83Bf911aE5D
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
