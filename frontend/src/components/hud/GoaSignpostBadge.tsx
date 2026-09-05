import React from 'react'
import { motion } from 'framer-motion'

export const GoaSignpostBadge: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-6">
      {/* Wooden / Cyber Post Pole */}
      <div className="relative flex flex-col items-center w-full max-w-md">
        {/* Post Pole */}
        <div className="absolute top-0 bottom-0 w-4 bg-gradient-to-b from-yellow-700 via-amber-800 to-amber-950 rounded border border-yellow-500/40 shadow-[0_0_10px_rgba(250,204,21,0.2)] z-0" />

        {/* Sign 1: 6800+ REGISTRATIONS (Bright Yellow Arrow) */}
        <motion.div
          whileHover={{ scale: 1.04, x: 4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative z-10 w-full mb-3 cursor-default"
        >
          <div
            className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-gray-950 font-black font-mono border-2 border-yellow-100 shadow-[0_4px_20px_rgba(250,204,21,0.4)] rounded-l-md"
            style={{
              clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
            }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight">6800+</span>
              <span className="text-xs uppercase tracking-widest font-bold">REGISTRATIONS</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-950 text-yellow-300 font-mono font-bold mr-6">
              2026
            </span>
          </div>
        </motion.div>

        {/* Sign 2: 390+ HACKERS (Electric Pink Arrow) */}
        <motion.div
          whileHover={{ scale: 1.04, x: -4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative z-10 w-full mb-3 cursor-default"
        >
          <div
            className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-600 text-white font-black font-mono border-2 border-pink-300 shadow-[0_4px_20px_rgba(236,72,153,0.5)] rounded-l-md"
            style={{
              clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
            }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight">390+</span>
              <span className="text-xs uppercase tracking-widest font-bold">ELITE HACKERS</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white font-mono font-bold mr-6">
              GOA
            </span>
          </div>
        </motion.div>

        {/* Sign 3: 100 PROJECTS (Goa Sun Gold Arrow) */}
        <motion.div
          whileHover={{ scale: 1.04, x: 4 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative z-10 w-full cursor-default"
        >
          <div
            className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-gray-950 font-black font-mono border-2 border-amber-200 shadow-[0_4px_20px_rgba(251,191,36,0.4)] rounded-l-md"
            style={{
              clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
            }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight">100</span>
              <span className="text-xs uppercase tracking-widest font-bold">PROJECTS</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold mr-6">
              POLYGON
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
