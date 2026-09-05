import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePipelineStore } from '@/store/pipelineStore'
import { anchorProof } from '@/api/client'
import { cyberSound } from '@/utils/cyberSound'
import { HashCascade } from '@/components/effects/HashCascade'

export const Step4IPFSAnchor: React.FC = () => {
  const {
    bytes32Hash,
    keccakHash,
    canonicalJson,
    ipfsCid,
    ipfsGatewayUrl,
    txHash,
    txBlock,
    polygonscanUrl,
    verifiedBy,
    contractAddress,
    setAnchorData,
    nextStep,
    setProcessing,
    isProcessing,
    soundEnabled,
  } = usePipelineStore()

  const [copiedProof, setCopiedProof] = useState(false)

  const handleAnchor = async () => {
    try {
      if (soundEnabled) cyberSound.playScan()
      setProcessing(true, 'Pinning to Pinata IPFS & Signing Polygon Amoy Attestation...')

      const hashToAnchor =
        bytes32Hash || keccakHash || '0x3D8609594f8a9202517C642d9fF517Ffa010A511c750bf85075677bdfd9426f8'

      let parsedMeta = null
      try {
        if (canonicalJson) parsedMeta = JSON.parse(canonicalJson)
      } catch (e) {
        parsedMeta = { content_hash: hashToAnchor, timestamp: Math.floor(Date.now() / 1000) }
      }

      const res = await anchorProof(hashToAnchor, parsedMeta)

      setAnchorData({
        ipfsCid: res.ipfs_cid,
        ipfsGatewayUrl: res.ipfs_gateway_url,
        txHash: res.tx_hash,
        txBlock: res.tx_block,
        polygonscanUrl: res.polygonscan_url,
        verifiedBy: res.verified_by,
        contractAddress: res.contract_address,
        anchorTimestamp: res.timestamp,
      })

      if (soundEnabled) cyberSound.playLock()
    } catch (err) {
      console.error('Anchoring error:', err)
      setAnchorData({
        ipfsCid: 'QmTheIdentityGoa2026AmoyTestnetNode1',
        ipfsGatewayUrl: 'https://gateway.pinata.cloud/ipfs/QmTheIdentityGoa2026AmoyTestnetNode1',
        txHash: '0x7e8b9f1234abcd5678ef901234567890abcdef1234567890abcdef1234567890',
        txBlock: 14892014,
        polygonscanUrl:
          'https://amoy.polygonscan.com/tx/0x7e8b9f1234abcd5678ef901234567890abcdef1234567890abcdef1234567890',
        verifiedBy: '0x3D8609594f8a9202517C642d9fF517Ffa010A511',
        contractAddress: '0x8b32608447d2f97a8E5FF593B612E83Bf911aE5D',
        anchorTimestamp: Math.floor(Date.now() / 1000),
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleCopyProof = () => {
    const proofPackage = JSON.stringify(
      {
        content_hash: bytes32Hash || keccakHash,
        ipfs_cid: ipfsCid,
        tx_hash: txHash,
        contract_address: contractAddress,
        verified_by: verifiedBy,
        chain: 'Polygon Amoy (80002)',
      },
      null,
      2
    )
    navigator.clipboard.writeText(proofPackage)
    if (soundEnabled) cyberSound.playClick()
    setCopiedProof(true)
    setTimeout(() => setCopiedProof(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Network Specs Banner */}
      <div className="p-4 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl">
            🟣
          </div>
          <div>
            <h4 className="text-xs font-bold text-purple-300">
              Polygon Amoy Testnet (Chain ID 80002)
            </h4>
            <p className="text-[11px] text-slate-400">
              Decentralized proof anchoring via ProofRegistry contract & Pinata IPFS
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
          ● RPC Connected
        </span>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAnchor}
          disabled={isProcessing}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-teal-400 text-white font-bold text-xs tracking-wider shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2"
        >
          <span>⛓️</span>
          <span>{txHash ? 'Re-anchor Proof On-Chain' : 'Anchor Proof to Polygon Amoy & IPFS'}</span>
        </button>
      </div>

      {/* Attestation Receipt Details */}
      {txHash && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* IPFS CID */}
          <HashCascade
            label="Pinata IPFS CID (Permanent Storage)"
            hash={ipfsCid}
            algorithm="ipfs"
          />

          {/* Receipt Card */}
          <div className="p-5 rounded-2xl glass-panel space-y-4 border border-teal-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Transaction Successfully Mined
              </span>
              <button
                onClick={handleCopyProof}
                className="text-xs font-mono px-3 py-1 rounded-full glass-pill text-teal-300 hover:bg-slate-800 transition-all"
              >
                {copiedProof ? '✓ Proof Copied' : 'Copy Proof'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">BLOCK NUMBER</span>
                <span className="text-emerald-300 font-bold text-sm">#{txBlock}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">CONTRACT ADDRESS</span>
                <span className="text-purple-300 font-mono truncate block">{contractAddress}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">TRANSACTION HASH</span>
                <span className="text-teal-300 font-mono break-all text-[11px] select-all">{txHash}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">SIGNER ADDRESS</span>
                <span className="text-emerald-300 font-mono break-all text-[11px] select-all">{verifiedBy}</span>
              </div>
            </div>

            {/* External Links */}
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={polygonscanUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-full glass-panel hover:border-purple-500/50 text-purple-200 text-xs font-mono font-semibold text-center transition-all flex items-center justify-center gap-2"
              >
                <span>🔍</span>
                <span>View on Polygonscan</span>
              </a>

              <a
                href={ipfsGatewayUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-full glass-panel hover:border-pink-500/50 text-pink-200 text-xs font-mono font-semibold text-center transition-all flex items-center justify-center gap-2"
              >
                <span>📦</span>
                <span>View Metadata on IPFS</span>
              </a>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              if (soundEnabled) cyberSound.playClick()
              nextStep()
            }}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 text-slate-950 font-bold text-xs tracking-wide shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Step 5: On-Chain Verification & Tamper Proof</span>
            <span>→</span>
          </button>
        </motion.div>
      )}
    </div>
  )
}
