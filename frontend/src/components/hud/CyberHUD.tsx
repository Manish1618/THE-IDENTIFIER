import { motion } from 'framer-motion'
import { useMotionPreference } from '@/hooks/useMotionPreference'

interface CyberHUDProps {
  children?: React.ReactNode
  className?: string
}

export function CyberHUD({ children, className = '' }: CyberHUDProps) {
  const prefersReducedMotion = useMotionPreference()

  const cornerVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: prefersReducedMotion ? 0 : 0.8, ease: 'easeInOut' },
        opacity: { duration: prefersReducedMotion ? 0 : 0.3 },
      },
    },
  }

  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
      >
        <motion.path
          d="M 20 0 L 0 0 L 0 20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          variants={cornerVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M calc(100% - 20) 0 L 100% 0 L 100% 20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          variants={cornerVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M 0 calc(100% - 20) L 0 100% L 20 100%"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          variants={cornerVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.path
          d="M calc(100% - 20) 100% L 100% 100% L 100% calc(100% - 20)"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          variants={cornerVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
      <div className="relative p-6">{children}</div>
    </div>
  )
}
