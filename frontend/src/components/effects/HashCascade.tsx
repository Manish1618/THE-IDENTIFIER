import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cyberSound } from '@/utils/cyberSound'

interface HashCascadeProps {
  label: string
  hash: string
  algorithm?: 'sha256' | 'keccak256' | 'bytes32' | 'ipfs' | 'hex'
  animated?: boolean
}

export const HashCascade: React.FC<HashCascadeProps> = ({
  label,
  hash,
  algorithm = 'sha256',
  animated = true,
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!hash) return
    navigator.clipboard.writeText(hash)
    cyberSound.playLock()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const badgeStyles = {
    sha256: 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10',
    keccak256: 'text-neon-emerald border-neon-emerald/40 bg-neon-emerald/10',
    bytes32: 'text-neon-purple border-neon-purple/40 bg-neon-purple/10',
    ipfs: 'text-neon-pink border-neon-pink/40 bg-neon-pink/10',
    hex: 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10',
  }[algorithm]

  return (
    <div className="group relative rounded-lg bg-cyber-dark/80 border border-cyber-light/40 p-3 hover:border-neon-cyan/50 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-wider text-neon-cyan uppercase">
            {label}
          </span>
          <span
            className={`text-[9px] font-mono px-1.5 py-0.5 border rounded uppercase ${badgeStyles}`}
          >
            {algorithm}
          </span>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="text-xs font-mono px-2 py-0.5 rounded border border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/20 text-neon-cyan transition-all flex items-center gap-1"
        >
          {copied ? (
            <span className="text-neon-emerald">✓ COPIED</span>
          ) : (
            <span>COPY</span>
          )}
        </button>
      </div>

      {/* Hash Content with animated cascade stream */}
      <div className="relative font-mono text-xs bg-cyber-darker/90 p-2.5 rounded border border-cyber-light/20 overflow-x-auto whitespace-pre-wrap break-all text-neon-cyan/90 select-all">
        {animated ? (
          <AnimatePresence mode="wait">
            <motion.span
              key={hash}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {hash || '0x0000000000000000000000000000000000000000000000000000000000000000'}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span>{hash || '0x0000000000000000000000000000000000000000000000000000000000000000'}</span>
        )}
      </div>
    </div>
  )
}
