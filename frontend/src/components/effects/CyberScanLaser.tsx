import React from 'react'
import { motion } from 'framer-motion'

interface CyberScanLaserProps {
  active?: boolean
  label?: string
  color?: 'cyan' | 'emerald' | 'purple' | 'pink'
}

export const CyberScanLaser: React.FC<CyberScanLaserProps> = ({
  active = true,
  label = 'BIOMETRIC SCANNING IN PROGRESS',
  color = 'cyan',
}) => {
  if (!active) return null

  const colorStyles = {
    cyan: {
      border: 'border-neon-cyan/40',
      bgGlow: 'from-neon-cyan/20 via-neon-cyan/10 to-transparent',
      line: 'bg-neon-cyan shadow-[0_0_15px_#00ffc8,0_0_30px_#00ffc8]',
      text: 'text-neon-cyan',
      reticle: '#00ffc8',
    },
    emerald: {
      border: 'border-neon-emerald/40',
      bgGlow: 'from-neon-emerald/20 via-neon-emerald/10 to-transparent',
      line: 'bg-neon-emerald shadow-[0_0_15px_#10b981,0_0_30px_#10b981]',
      text: 'text-neon-emerald',
      reticle: '#10b981',
    },
    purple: {
      border: 'border-neon-purple/40',
      bgGlow: 'from-neon-purple/20 via-neon-purple/10 to-transparent',
      line: 'bg-neon-purple shadow-[0_0_15px_#a855f7,0_0_30px_#a855f7]',
      text: 'text-neon-purple',
      reticle: '#a855f7',
    },
    pink: {
      border: 'border-neon-pink/40',
      bgGlow: 'from-neon-pink/20 via-neon-pink/10 to-transparent',
      line: 'bg-neon-pink shadow-[0_0_15px_#ec4899,0_0_30px_#ec4899]',
      text: 'text-neon-pink',
      reticle: '#ec4899',
    },
  }[color]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-20">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, ${colorStyles.reticle} 1px, transparent 1px), linear-gradient(to bottom, ${colorStyles.reticle} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Sweeping Laser Beam */}
      <motion.div
        className="absolute left-0 right-0 h-1 z-30"
        initial={{ top: '0%' }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className={`h-[2px] w-full ${colorStyles.line}`} />
        <div
          className={`h-16 w-full bg-gradient-to-b ${colorStyles.bgGlow} -mt-16 pointer-events-none`}
        />
      </motion.div>

      {/* Target Reticle in Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 border border-dashed rounded-full opacity-40 border-current text-neon-cyan"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute w-20 h-20 border border-dotted rounded-full opacity-60 border-current text-neon-emerald"
        />
        <div className="absolute w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00ffc8]" />
      </div>

      {/* Top Banner Status */}
      <div className="absolute top-2 left-2 right-2 flex justify-between items-center px-2 py-1 bg-cyber-darker/80 border border-neon-cyan/30 rounded text-[10px] tracking-wider">
        <span className={`font-bold flex items-center gap-1.5 ${colorStyles.text}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
          {label}
        </span>
        <span className="text-neon-cyan/60">SCAN_FREQ: 60Hz</span>
      </div>

      {/* Bottom Coordinates HUD */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-2 py-1 bg-cyber-darker/80 border border-neon-cyan/30 rounded text-[9px] text-neon-cyan/70 font-mono">
        <span>X: 1920.00 Y: 1080.00</span>
        <span className="animate-pulse">FPS: 60.0</span>
        <span>RES: 512-D</span>
      </div>
    </div>
  )
}
