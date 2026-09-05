import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cyberSound } from '@/utils/cyberSound'

interface GlitchOverlayProps {
  active?: boolean
  message?: string
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({
  active = false,
  message = 'SECURITY BREACH DETECTED // TAMPER COMPROMISE',
}) => {
  useEffect(() => {
    if (active) {
      cyberSound.playAlert()
    }
  }, [active])

  if (!active) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.4, 1, 0.7] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: 'mirror' }}
        className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center bg-red-950/20 backdrop-blur-[1px]"
      >
        {/* Red Warning Border */}
        <div className="absolute inset-0 border-4 border-neon-pink/80 shadow-[0_0_50px_rgba(236,72,153,0.8)_inset]" />

        {/* Diagonal Hazard Stripes */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #ec4899, #ec4899 15px, transparent 15px, transparent 30px)',
          }}
        />

        {/* Center Alert Banner */}
        <motion.div
          animate={{ x: [-4, 4, -2, 2, 0], y: [2, -2, 1, -1, 0] }}
          transition={{ duration: 0.15, repeat: Infinity }}
          className="px-8 py-4 bg-cyber-darker/95 border-2 border-neon-pink rounded-lg shadow-[0_0_30px_#ec4899] text-center"
        >
          <div className="text-neon-pink font-mono font-black text-2xl tracking-widest flex items-center justify-center gap-3">
            <span className="animate-ping">⚠️</span>
            <span>{message}</span>
            <span className="animate-ping">⚠️</span>
          </div>
          <p className="text-xs font-mono text-neon-pink/70 mt-1">
            CRYPTOGRAPHIC ATTESTATION MISMATCH // INVESTIGATION REQUIRED
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
