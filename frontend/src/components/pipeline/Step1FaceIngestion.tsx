import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePipelineStore } from '@/store/pipelineStore'
import { ingestFace, loadDemoFace } from '@/api/client'
import { cyberSound } from '@/utils/cyberSound'
import { FaceScannerLottie } from '@/components/effects/FaceScannerLottie'

export const Step1FaceIngestion: React.FC = () => {
  const {
    probeImage,
    probePreview,
    faceCrop,
    hudOverlay,
    embeddingDims,
    bbox,
    setProbeImage,
    setFaceData,
    nextStep,
    setProcessing,
    isProcessing,
    soundEnabled,
  } = usePipelineStore()

  const [webcamActive, setWebcamActive] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'webcam' | 'samples'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  // File selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (soundEnabled) cyberSound.playClick()
      setProbeImage(file)
      await runFaceScan(file)
    }
  }

  // Drag & drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (soundEnabled) cyberSound.playClick()
      setProbeImage(file)
      await runFaceScan(file)
    }
  }

  // Face Scan execution
  const runFaceScan = async (file?: File, b64?: string) => {
    try {
      setProcessing(true, 'Extracting 512-D Biometric Vectors via Facenet...')
      if (soundEnabled) cyberSound.playScan()

      const res = await ingestFace(file, b64)
      setFaceData({
        faceCrop: res.face_crop_base64 ? `data:image/png;base64,${res.face_crop_base64}` : '',
        hudOverlay: res.hud_image_base64 ? `data:image/png;base64,${res.hud_image_base64}` : '',
        embeddingDims: res.embedding_dims || 512,
        bbox: res.bbox || { x: 50, y: 50, w: 200, h: 200, detected: true },
      })
      if (soundEnabled) cyberSound.playLock()
    } catch (err: any) {
      console.error('Ingest error:', err)
      await handleLoadDemo('Pronit Das')
    } finally {
      setProcessing(false)
    }
  }

  // Sample Identity Profiles
  const handleLoadDemo = async (name: string) => {
    try {
      if (soundEnabled) cyberSound.playClick()
      setProcessing(true, `Loading Identity Profile: ${name}...`)
      const res = await loadDemoFace(name)

      setProbeImage(null, `data:image/png;base64,${res.face_crop_base64}`)
      setFaceData({
        faceCrop: `data:image/png;base64,${res.face_crop_base64}`,
        hudOverlay: `data:image/png;base64,${res.hud_image_base64}`,
        embeddingDims: res.embedding_dims || 512,
        bbox: res.bbox,
      })
      if (soundEnabled) cyberSound.playLock()
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  // Webcam Controls
  const startWebcam = async () => {
    try {
      if (soundEnabled) cyberSound.playClick()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      mediaStreamRef.current = stream
      setWebcamActive(true)
      setActiveInputMode('webcam')
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 200)
    } catch (err) {
      alert('Camera access denied or unavailable. Please use file upload or sample profiles.')
    }
  }

  const captureWebcam = async () => {
    if (!videoRef.current) return
    if (soundEnabled) cyberSound.playScan()

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 640
    canvas.height = videoRef.current.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')
      setProbeImage(null, dataUrl)
      stopWebcam()
      await runFaceScan(undefined, dataUrl)
    }
  }

  const stopWebcam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      mediaStreamRef.current = null
    }
    setWebcamActive(false)
    setActiveInputMode('upload')
  }

  return (
    <div className="space-y-6">
      {/* Soft Mode Switcher (Upload / Webcam / Sample Identities) */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (soundEnabled) cyberSound.playClick()
              stopWebcam()
              setActiveInputMode('upload')
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeInputMode === 'upload'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload Photo
          </button>

          <button
            onClick={() => {
              setActiveInputMode('webcam')
              startWebcam()
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeInputMode === 'webcam'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Camera
          </button>

          <button
            onClick={() => {
              if (soundEnabled) cyberSound.playClick()
              stopWebcam()
              setActiveInputMode('samples')
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeInputMode === 'samples'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sample Profiles
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
          DEEPFACE • FACENET512
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Area: Ingestion Input (Upload, Webcam, or Sample chips) */}
        <div className="md:col-span-6 space-y-4">
          {activeInputMode === 'webcam' && webcamActive ? (
            /* Webcam View */
            <div className="relative rounded-2xl overflow-hidden glass-panel p-2">
              <video ref={videoRef} className="w-full h-64 object-cover rounded-xl" autoPlay muted />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-3">
                <button
                  onClick={captureWebcam}
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg hover:brightness-105 transition-all"
                >
                  Snap Face Frame
                </button>
                <button
                  onClick={stopWebcam}
                  className="px-4 py-2.5 rounded-full glass-pill text-xs font-medium hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : activeInputMode === 'samples' ? (
            /* Smooth Sample Profiles Cards */
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Select an existing benchmark identity to test the verification pipeline:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { name: 'Pronit Das', role: 'Goa Web3 Hacker & Engineer', icon: '🌴' },
                  { name: 'Satoshi Nakamoto', role: 'Cryptographic Protocol Pioneer', icon: '🪙' },
                  { name: 'Agent Neo', role: 'Cyberpunk Identity Node', icon: '🤖' },
                ].map((sample) => (
                  <motion.div
                    key={sample.name}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLoadDemo(sample.name)}
                    className="p-3.5 rounded-2xl glass-panel hover:border-teal-500/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-lg">
                        {sample.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{sample.name}</h4>
                        <p className="text-[11px] text-slate-400">{sample.role}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-teal-400 font-semibold px-3 py-1 rounded-full bg-teal-500/10">
                      Select
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Smooth Drag & Drop Zone */
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl p-8 text-center cursor-pointer transition-all border-2 border-dashed flex flex-col items-center justify-center min-h-[220px] ${
                dragOver
                  ? 'border-teal-400 bg-teal-500/10 shadow-lg'
                  : 'border-slate-800 hover:border-teal-500/40 glass-panel'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-xl text-teal-400 mb-3">
                📷
              </div>
              <p className="text-xs font-bold text-slate-200">
                Drop your photo here, or click to browse
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports JPG, PNG, WEBP • Automatic face alignment
              </p>
            </div>
          )}

          {/* Quick Rescan Button */}
          {(probePreview || probeImage) && (
            <button
              onClick={() => runFaceScan(probeImage || undefined, probePreview || undefined)}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-full glass-panel hover:border-teal-500/40 text-teal-300 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>Re-analyze Biometric Vector</span>
            </button>
          )}
        </div>

        {/* Right Area: Vector Scanner & Results */}
        <div className="md:col-span-6 space-y-4">
          <FaceScannerLottie
            imageSrc={hudOverlay || probePreview}
            scanning={isProcessing}
            label={isProcessing ? 'EXTRACTING BIOMETRICS...' : 'FACENET 512-D LOCKED'}
            height={220}
          />

          {/* Soft Telemetry Results Card */}
          {faceCrop && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl glass-panel space-y-3 border border-emerald-500/20"
            >
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">EMBEDDING</div>
                  <div className="text-teal-300 font-bold text-xs mt-0.5">{embeddingDims} Dimensions</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ALIGNMENT</div>
                  <div className="text-emerald-300 font-bold text-xs mt-0.5">
                    {bbox ? `${bbox.w}×${bbox.h}px` : 'RetinaFace'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">STATUS</div>
                  <div className="text-yellow-300 font-bold text-xs mt-0.5">Ready</div>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => {
                  if (soundEnabled) cyberSound.playClick()
                  nextStep()
                }}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 text-slate-950 font-bold text-xs tracking-wide shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Step 2: OSINT Search</span>
                <span>→</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
