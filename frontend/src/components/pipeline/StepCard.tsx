import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cyberSound } from '@/utils/cyberSound'

export interface StepCardProps {
  stepNumber: number
  title: string
  subtitle: string
  status: 'pending' | 'active' | 'completed' | 'error'
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: string
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNumber,
  title,
  subtitle,
  status,
  isOpen,
  onToggle,
  children,
  badge,
}) => {
  const statusStyles = {
    pending: {
      border: 'border-cyber-light/30 hover:border-neon-cyan/40',
      badgeBg: 'bg-cyber-dark/80 text-neon-cyan/60 border-cyber-light/40',
      numBg: 'bg-cyber-darker text-neon-cyan/50 border-cyber-light/40',
      glow: '',
      titleColor: 'text-neon-cyan/70',
      label: 'PENDING',
    },
    active: {
      border: 'border-neon-cyan shadow-[0_0_20px_rgba(0,255,200,0.25)]',
      badgeBg: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/60 shadow-[0_0_10px_rgba(0,255,200,0.3)]',
      numBg: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan shadow-[0_0_12px_rgba(0,255,200,0.4)]',
      glow: 'shadow-[0_0_30px_rgba(0,255,200,0.1)_inset]',
      titleColor: 'text-neon-cyan',
      label: 'IN PROGRESS',
    },
    completed: {
      border: 'border-neon-emerald/70 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      badgeBg: 'bg-neon-emerald/15 text-neon-emerald border-neon-emerald/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
      numBg: 'bg-neon-emerald/20 text-neon-emerald border-neon-emerald shadow-[0_0_12px_rgba(16,185,129,0.4)]',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.05)_inset]',
      titleColor: 'text-neon-emerald',
      label: 'VERIFIED',
    },
    error: {
      border: 'border-neon-pink/80 shadow-[0_0_20px_rgba(236,72,153,0.3)]',
      badgeBg: 'bg-neon-pink/15 text-neon-pink border-neon-pink/60 shadow-[0_0_10px_rgba(236,72,153,0.4)]',
      numBg: 'bg-neon-pink/20 text-neon-pink border-neon-pink',
      glow: 'shadow-[0_0_30px_rgba(236,72,153,0.1)_inset]',
      titleColor: 'text-neon-pink',
      label: 'FAILED',
    },
  }[status]

  const handleHeaderClick = () => {
    cyberSound.playClick()
    onToggle()
  }

  return (
    <div
      className={`relative rounded-xl bg-cyber-dark/85 backdrop-blur-md border transition-all duration-300 ${statusStyles.border} ${statusStyles.glow} overflow-hidden mb-6`}
    >
      {/* Corner Bracket Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan/60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-cyan/60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-cyan/60 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-cyan/60 pointer-events-none" />

      {/* Header Bar */}
      <div
        onClick={handleHeaderClick}
        className="cursor-pointer p-5 flex items-center justify-between select-none hover:bg-cyber-light/10 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Step Number Badge */}
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-black text-base border transition-all ${statusStyles.numBg}`}
          >
            {status === 'completed' ? '✓' : `0${stepNumber}`}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold font-mono tracking-wider ${statusStyles.titleColor}`}>
                {title}
              </h2>
              {badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-neon-purple/50 bg-neon-purple/10 text-neon-purple">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-neon-cyan/50 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Status indicator pill & collapse chevron */}
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded border tracking-wider uppercase font-semibold ${statusStyles.badgeBg}`}
          >
            {statusStyles.label}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-7 h-7 rounded flex items-center justify-center text-neon-cyan/70 hover:text-neon-cyan"
          >
            ▼
          </motion.div>
        </div>
      </div>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-cyber-light/20"
          >
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
