import { motion } from 'framer-motion'

interface StatusIndicatorProps {
  status: 'online' | 'processing' | 'success' | 'error'
  label?: string
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const statusConfig = {
    online: { color: 'text-neon-emerald', pulse: true, icon: '●' },
    processing: { color: 'text-neon-cyan', pulse: true, icon: '◌' },
    success: { color: 'text-neon-emerald', pulse: false, icon: '✓' },
    error: { color: 'text-neon-pink', pulse: true, icon: '✗' },
  }

  const config = statusConfig[status]

  return (
    <motion.div
      className="flex items-center gap-2 text-sm font-mono"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className={`${config.color} text-xl`}
        animate={config.pulse ? { opacity: [1, 0.5, 1] } : {}}
        transition={config.pulse ? { duration: 1.5, repeat: Infinity } : {}}
      >
        {config.icon}
      </motion.span>
      {label && <span className={config.color}>{label}</span>}
    </motion.div>
  )
}
