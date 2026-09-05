import React from 'react'
import { motion } from 'framer-motion'

interface SimilarityGaugeProps {
  score: number // 0 - 100
  threshold?: number // default 75
  size?: number
}

export const SimilarityGauge: React.FC<SimilarityGaugeProps> = ({
  score,
  threshold = 75,
  size = 180,
}) => {
  const isMatch = score >= threshold
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const primaryColor = isMatch ? '#10b981' : '#ec4899' // Emerald vs Pink
  const glowColor = isMatch ? 'rgba(16, 185, 129, 0.4)' : 'rgba(236, 72, 153, 0.4)'

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer Rotating Cyber Ring */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius + 8}
            fill="none"
            stroke="#00ffc8"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.3"
          />
        </motion.svg>

        {/* SVG Circular Progress Bar */}
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#0a0e27"
            strokeWidth="10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f293d"
            strokeWidth="8"
            strokeDasharray="2 4"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={primaryColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Content readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <span
              className="text-4xl font-black font-mono tracking-tighter"
              style={{
                color: primaryColor,
                textShadow: `0 0 15px ${glowColor}`,
              }}
            >
              {score.toFixed(1)}%
            </span>
          </motion.div>
          <span className="text-[10px] uppercase tracking-widest text-neon-cyan/70 font-mono mt-1">
            {isMatch ? 'BIOMETRIC MATCH' : 'IDENTITY MISMATCH'}
          </span>
        </div>
      </div>

      {/* Threshold indicator pill */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-cyber-dark/80 border border-neon-cyan/20 rounded-full text-xs font-mono">
        <span className="text-neon-cyan/60">THRESHOLD:</span>
        <span className="text-neon-cyan font-bold">{threshold}%</span>
        <span
          className={`w-2 h-2 rounded-full ${
            isMatch ? 'bg-neon-emerald animate-pulse' : 'bg-neon-pink'
          }`}
        />
      </div>
    </div>
  )
}
