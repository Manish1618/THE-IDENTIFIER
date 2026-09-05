import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { usePipelineStore, SocialCandidate } from '@/store/pipelineStore'
import { searchSocial } from '@/api/client'
import { cyberSound } from '@/utils/cyberSound'
import { FaceScannerLottie } from '@/components/effects/FaceScannerLottie'

export const Step2SocialSearch: React.FC = () => {
  const {
    activeSearchTab,
    setActiveSearchTab,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    selectedCandidate,
    selectCandidate,
    faceCrop,
    probePreview,
    nextStep,
    setProcessing,
    isProcessing,
    soundEnabled,
  } = usePipelineStore()

  const [customQuery, setCustomQuery] = useState(searchQuery || 'Pronit Das')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  // Switch tabs & clear stale previous search results
  const handleTabChange = (tab: 'keyword' | 'image') => {
    if (soundEnabled) cyberSound.playClick()
    setActiveSearchTab(tab)
    // Clear previous search results so reverse image starts completely clean without recent searches
    setSearchResults([])
    selectCandidate(null)
    setStatusMessage(null)
  }

  const handleClearResults = () => {
    if (soundEnabled) cyberSound.playClick()
    setSearchResults([])
    selectCandidate(null)
    setStatusMessage(null)
  }

  const handleSearch = async () => {
    try {
      if (soundEnabled) cyberSound.playScan()
      const isImg = activeSearchTab === 'image'
      
      // CRITICAL FIX: Clear recent/previous search results immediately so they don't linger
      setSearchResults([])
      selectCandidate(null)
      setStatusMessage(null)

      setProcessing(
        true,
        isImg
          ? 'Scanning biometric facial features with Gemini 3.6 Multimodal Vision & Google Lens...'
          : `Running Multi-Tier OSINT Engine for "${customQuery}"...`
      )

      let res
      if (activeSearchTab === 'keyword') {
        res = await searchSocial(customQuery)
      } else {
        const rawImg = faceCrop || probePreview
        let b64: string | undefined = undefined
        if (rawImg) {
          b64 = rawImg.includes(',') ? rawImg.split(',')[1] : rawImg
        }
        res = await searchSocial(undefined, undefined, b64)
      }

      if (res && res.matches && res.matches.length > 0) {
        setSearchResults(res.matches)
        selectCandidate(res.matches[0])
        setStatusMessage(res.message || `Discovered ${res.matches.length} matching footprints.`)
      } else {
        setStatusMessage('No direct matches found. Try entering keywords above.')
      }
      if (soundEnabled) cyberSound.playLock()
    } catch (err: any) {
      console.error('OSINT Search error:', err)
      setStatusMessage(err?.response?.data?.message || err?.message || 'Search encountered an issue. Using cached intelligence.')
    } finally {
      setProcessing(false)
    }
  }

  const handleSelect = (candidate: SocialCandidate) => {
    if (soundEnabled) cyberSound.playClick()
    selectCandidate(candidate)
  }

  return (
    <div className="space-y-6">
      {/* Search Mode Tabs (Soft Pills) */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange('keyword')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeSearchTab === 'keyword'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔍</span>
            <span>OSINT Keyword / Handle Search</span>
          </button>

          <button
            onClick={() => handleTabChange('image')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
              activeSearchTab === 'image'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📸</span>
            <span>Reverse Image Search (Gemini 3.6 Vision)</span>
          </button>
        </div>

        {/* Clear Search Results Button */}
        {searchResults.length > 0 && (
          <button
            onClick={handleClearResults}
            className="px-3 py-1 rounded-full glass-pill hover:border-slate-600 text-[10px] font-mono text-slate-400 hover:text-slate-200 transition-all"
          >
            ✕ Clear Results
          </button>
        )}
      </div>

      {/* Search Controls */}
      {activeSearchTab === 'keyword' ? (
        <div className="space-y-2">
          <label className="block text-xs text-slate-400">
            Enter username, real name, or keywords:
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => {
                setCustomQuery(e.target.value)
                setSearchQuery(e.target.value)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Pronit Das, @pronit_das, HackerHouse Goa"
              className="flex-1 px-4 py-3 rounded-full glass-panel text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400 font-mono"
            />
            <button
              onClick={handleSearch}
              disabled={isProcessing}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center gap-2"
            >
              <span>🔎</span>
              <span>Search Footprint</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 flex-shrink-0 relative shadow-md">
              {faceCrop || probePreview ? (
                <img src={(faceCrop || probePreview) || undefined} alt="Probe" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                  NO PROBE
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-200">
                  Multimodal Visual Identity Match
                </h4>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  FRESH SCAN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dispatches 512-D crop to Gemini 3.6 Flash & Google Lens (stale results cleared)
              </p>
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-md hover:brightness-105 transition-all flex items-center gap-2"
          >
            <span>📸</span>
            <span>Run Visual Search</span>
          </button>
        </div>
      )}

      {/* Dynamic Status Message */}
      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2 font-mono shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
          <span className="flex-1">{statusMessage}</span>
        </motion.div>
      )}

      {/* Lottie Scanner when querying */}
      {isProcessing && (
        <div className="max-w-md mx-auto my-4">
          <FaceScannerLottie
            imageSrc={(probePreview || faceCrop) ? (probePreview || faceCrop)! : undefined}
            scanning={true}
            label={
              activeSearchTab === 'image'
                ? "DISCOVERING MULTIMODAL OSINT WITH GEMINI 3.6 VISION..."
                : "DISCOVERING OSINT FOOTPRINT..."
            }
            height={180}
          />
        </div>
      )}

      {/* Discovered Candidates or Clean Empty State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">
            Discovered Footprints ({searchResults.length} found)
          </span>
          <span className="text-slate-500">
            {searchResults.length > 0 ? "Select candidate to verify" : "No recent results cached"}
          </span>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((cand, idx) => {
              const isSelected = selectedCandidate?.post_url === cand.post_url
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleSelect(cand)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'glass-card border-teal-500/60 shadow-lg ring-1 ring-teal-400/40'
                      : 'glass-panel border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        {cand.platform}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {cand.source}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                        SELECTED
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 mt-2 line-clamp-2">
                    {cand.title}
                  </h4>

                  <div className="flex items-center justify-between mt-3 text-[11px] font-mono">
                    <a
                      href={cand.post_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-teal-400/70 hover:text-teal-300 underline truncate max-w-[200px]"
                    >
                      {cand.post_url}
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(cand)
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-semibold transition-all ${
                        isSelected
                          ? 'bg-teal-400 text-slate-950'
                          : 'glass-pill text-teal-300 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ Active' : 'Select'}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : !isProcessing ? (
          <div className="p-8 rounded-2xl glass-panel text-center space-y-2 border border-dashed border-slate-800">
            <div className="text-2xl">📸</div>
            <div className="text-xs font-bold text-slate-300">
              {activeSearchTab === 'image'
                ? 'Ready for Fresh Reverse Visual Search'
                : 'Enter Keywords to Discover Web Footprint'}
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              {activeSearchTab === 'image'
                ? 'Previous results cleared. Click "Run Visual Search" above to analyze the face crop with Gemini 3.6 Vision.'
                : 'Type a name, username, or event in the search box above to start.'}
            </p>
          </div>
        ) : null}
      </div>

      {/* Proceed */}
      {selectedCandidate && (
        <div className="pt-2">
          <button
            onClick={() => {
              if (soundEnabled) cyberSound.playClick()
              nextStep()
            }}
            className="w-full py-3 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 text-slate-950 font-bold text-xs tracking-wide shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Step 3: Biometric Verification</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  )
}
