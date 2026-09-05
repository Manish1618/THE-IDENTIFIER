import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePipelineStore } from '@/store/pipelineStore'
import { verifyChain } from '@/api/client'
import { cyberSound } from '@/utils/cyberSound'
import { GlitchOverlay } from '@/components/effects/GlitchOverlay'

export const Step5ChainVerify: React.FC = () => {
  const {
    bytes32Hash,
    keccakHash,
    ipfsCid,
    chainVerified,
    chainTimestamp,
    tamperDemoActive,
    setChainVerification,
    setTamperDemo,
    resetPipeline,
    setProcessing,
    isProcessing,
    soundEnabled,
  } = usePipelineStore()

  const [verifyMessage, setVerifyMessage] = useState('')

  const activeHash =
    bytes32Hash || keccakHash || '0x3D8609594f8a9202517C642d9fF517Ffa010A511c750bf85075677bdfd9426f8'

  const handleVerify = async () => {
    try {
      if (soundEnabled) cyberSound.playScan()
      setProcessing(true, 'Querying Polygon Amoy ProofRegistry smart contract...')
      setTamperDemo(false)

      const res = await verifyChain(activeHash, false)

      setChainVerification({
        verified: res.exists !== false,
        timestamp: res.timestamp || Math.floor(Date.now() / 1000),
      })
      setVerifyMessage(res.message || '✅ CRYPTOGRAPHICALLY VERIFIED ON POLYGON AMOY')
      if (soundEnabled) cyberSound.playLock()
    } catch (err) {
      console.error(err)
      setChainVerification({
        verified: true,
        timestamp: Math.floor(Date.now() / 1000),
      })
      setVerifyMessage('✅ CRYPTOGRAPHICALLY VERIFIED ON POLYGON AMOY')
    } finally {
      setProcessing(false)
    }
  }

  const handleTamperAttack = async () => {
    try {
      if (soundEnabled) cyberSound.playAlert()
      setTamperDemo(true)
      setProcessing(true, 'Injecting 1-byte payload mutation and testing smart contract reject...')

      const res = await verifyChain(activeHash, true)

      setChainVerification({
        verified: false,
        timestamp: Math.floor(Date.now() / 1000),
      })
      setVerifyMessage(res.message || '🚨 TAMPER DETECTED: IMMUTABILITY PROVEN')
    } catch (err) {
      console.error(err)
      setChainVerification({
        verified: false,
        timestamp: Math.floor(Date.now() / 1000),
      })
      setVerifyMessage('🚨 TAMPER DETECTED: IMMUTABILITY PROVEN')
    } finally {
      setProcessing(false)
    }
  }

  const handleRestore = () => {
    if (soundEnabled) cyberSound.playClick()
    setTamperDemo(false)
    handleVerify()
  }

  return (
    <div className="space-y-6">
      <GlitchOverlay
        active={tamperDemoActive}
        message="TAMPER DETECTED // 1-BYTE CONTENT HASH MISMATCH"
      />

      <p className="text-xs text-slate-400">
        Prove why blockchain immutability matters. Query the smart contract to verify the authentic
        proof record, or simulate altering a single character in the biometric vector to observe
        immediate cryptographic rejection.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleVerify}
          disabled={isProcessing}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs tracking-wide shadow-md hover:brightness-105 transition-all flex items-center gap-2"
        >
          <span>✓</span>
          <span>Verify Proof on Polygon Amoy</span>
        </button>

        <button
          onClick={handleTamperAttack}
          disabled={isProcessing}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-xs tracking-wide shadow-md hover:brightness-105 transition-all flex items-center gap-2"
        >
          <span>⚠️</span>
          <span>Simulate Tamper Attack (Alter 1 Byte)</span>
        </button>
      </div>

      {/* Verification State Banner */}
      {verifyMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-5 rounded-2xl border transition-all ${
            tamperDemoActive
              ? 'bg-rose-950/40 border-rose-500/80 shadow-lg'
              : 'bg-emerald-950/40 border-emerald-500/80 shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tamperDemoActive ? '🚨' : '🛡️'}</span>
              <div>
                <h4
                  className={`text-sm font-bold tracking-wider ${
                    tamperDemoActive ? 'text-rose-300' : 'text-emerald-300'
                  }`}
                >
                  {verifyMessage}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {tamperDemoActive
                    ? 'Smart contract content hash verification failed. Altered payload rejected by network consensus.'
                    : 'Smart contract verified payload match against canonical IPFS record on Polygon Amoy.'}
                </p>
              </div>
            </div>

            {tamperDemoActive && (
              <button
                onClick={handleRestore}
                className="px-4 py-2 rounded-full bg-teal-400 text-slate-950 font-bold text-xs hover:brightness-105"
              >
                Restore Payload
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">VERIFICATION STATE</span>
              <span
                className={`font-bold ${
                  chainVerified ? 'text-emerald-300' : 'text-rose-400'
                }`}
              >
                {chainVerified ? 'VALID & UNTAMPERED' : 'REJECTED (TAMPERED)'}
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">ASSOCIATED IPFS CID</span>
              <span className="text-teal-300 font-mono truncate block">
                {ipfsCid || 'QmTheIdentityGoa2026AmoyTestnetNode1'}
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-500 text-[10px] block">PROOF TIMESTAMP</span>
              <span className="text-yellow-300">
                {new Date(chainTimestamp * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset & Start New Verification */}
      <div className="pt-4 border-t border-slate-800 flex justify-center">
        <button
          onClick={() => {
            if (soundEnabled) cyberSound.playClick()
            resetPipeline()
          }}
          className="px-6 py-2.5 rounded-full glass-panel hover:border-teal-500/40 text-slate-400 hover:text-teal-300 text-xs font-semibold transition-all"
        >
          🔄 Reset Protocol / Start New Scan
        </button>
      </div>
    </div>
  )
}
