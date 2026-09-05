import React from 'react'
import { Lottie } from 'lottie-react'
import { motion } from 'framer-motion'
import faceScanAnim from '@/assets/face-scanning.json'

interface FaceScannerLottieProps {
  imageSrc?: string | null
  scanning?: boolean
  label?: string
  width?: number | string
  height?: number | string
}

export const FaceScannerLottie: React.FC<FaceScannerLottieProps> = ({
  imageSrc,
  scanning = true,
  label = 'AI FACIAL RECOGNITION & EMBEDDING SCAN',
  width = '100%',
  height = 280,
}) => {
  return (
    <div
      style={{ width }}
      className="relative rounded-xl overflow-hidden bg-cyber-darker/90 border border-neon-cyan/40 shadow-[0_0_25px_rgba(0,255,200,0.15)] flex flex-col items-center justify-center p-2"
    >
      {/* Corner Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />

      {/* Cyber Grid Background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00ffc8 1px, transparent 1px), linear-gradient(to bottom, #00ffc8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Banner Readout */}
      <div className="w-full flex items-center justify-between px-4 py-1.5 bg-cyber-dark/80 border-b border-neon-cyan/30 text-[11px] font-mono tracking-wider z-10">
        <div className="flex items-center gap-2 text-neon-cyan font-bold">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-3 text-neon-cyan/70 text-[10px]">
          <span className="text-neon-emerald">● MODEL: FACENET-512</span>
          <span>FPS: 60</span>
        </div>
      </div>

      {/* Center Display: User Image + Lottie Vector Animation */}
      <div
        className="relative flex items-center justify-center my-2 overflow-hidden rounded-lg w-full"
        style={{ height }}
      >
        {/* Background Image if available */}
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Biometric Scan Target"
            className="absolute inset-0 w-full h-full object-contain filter contrast-125 opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div className="w-48 h-48 rounded-full border border-dashed border-neon-cyan/40 animate-spin" />
          </div>
        )}

        {/* The Vector Lottie Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
          <Lottie
            src={faceScanAnim}
            loop={scanning}
            autoplay={scanning}
            style={{ width: '100%', height: '100%', maxWidth: 420 }}
          />
        </div>

        {/* Sweeping Laser Line when scanning */}
        {scanning && (
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_#00ffc8]"
            initial={{ top: '5%' }}
            animate={{ top: ['5%', '95%', '5%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="w-full flex items-center justify-between px-4 py-1.5 bg-cyber-dark/80 border-t border-neon-cyan/30 text-[10px] font-mono text-neon-cyan/80 z-10">
        <span>X: 160.00 Y: 150.00</span>
        <span className="text-neon-emerald font-semibold animate-pulse">
          STATUS: {scanning ? 'ACQUIRING RETINAFACE VECTORS' : 'LOCKED'}
        </span>
        <span className="text-neon-purple">HASH: KECCAK-256</span>
      </div>
    </div>
  )
}
