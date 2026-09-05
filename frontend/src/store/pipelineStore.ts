import { create } from 'zustand'

export interface SocialCandidate {
  platform: string
  title: string
  post_url: string
  thumbnail?: string
  source: string
}

export interface PipelineState {
  // Step 1: Face Ingestion
  probeImage: File | null
  probePreview: string | null
  faceCrop: string | null
  hudOverlay: string | null
  embeddingDims: number
  bbox: { x: number; y: number; w: number; h: number; detected?: boolean } | null
  isWebcamActive: boolean

  // Step 2: Social OSINT Search
  activeSearchTab: 'image' | 'keyword'
  searchQuery: string
  searchResults: SocialCandidate[]
  selectedCandidate: SocialCandidate | null

  // Step 3: Biometric Verification
  similarity: number
  canonicalJson: string
  sha256Hash: string
  keccakHash: string
  bytes32Hash: string

  // Step 4: IPFS & Blockchain Anchoring
  ipfsCid: string
  ipfsGatewayUrl: string
  txHash: string
  txBlock: number
  polygonscanUrl: string
  verifiedBy: string
  contractAddress: string
  anchorTimestamp: number

  // Step 5: Chain Verification & Tamper Simulation
  chainVerified: boolean
  chainTimestamp: number
  tamperDemoActive: boolean

  // UI & Global Controls
  currentStep: number // 1 - 5
  carouselView: boolean
  soundEnabled: boolean
  isProcessing: boolean
  statusMessage: string
  error: string | null

  // Actions
  setProbeImage: (file: File | null, preview?: string | null) => void
  setFaceData: (data: {
    faceCrop: string
    hudOverlay: string
    embeddingDims: number
    bbox: { x: number; y: number; w: number; h: number; detected?: boolean }
  }) => void
  setWebcamActive: (active: boolean) => void
  setActiveSearchTab: (tab: 'image' | 'keyword') => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: SocialCandidate[]) => void
  selectCandidate: (candidate: SocialCandidate | null) => void
  setVerificationData: (data: {
    similarity: number
    canonicalJson: string
    sha256Hash: string
    keccakHash: string
    bytes32Hash: string
  }) => void
  setAnchorData: (data: {
    ipfsCid: string
    ipfsGatewayUrl: string
    txHash: string
    txBlock: number
    polygonscanUrl: string
    verifiedBy: string
    contractAddress: string
    anchorTimestamp: number
  }) => void
  setChainVerification: (data: { verified: boolean; timestamp: number }) => void
  setTamperDemo: (active: boolean) => void
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setCarouselView: (carousel: boolean) => void
  toggleSound: () => void
  setProcessing: (processing: boolean, message?: string) => void
  setError: (error: string | null) => void
  resetPipeline: () => void
}

const initialState = {
  probeImage: null,
  probePreview: null,
  faceCrop: null,
  hudOverlay: null,
  embeddingDims: 0,
  bbox: null,
  isWebcamActive: false,
  activeSearchTab: 'keyword' as const,
  searchQuery: 'Pronit Das',
  searchResults: [
    {
      platform: 'Twitter / X',
      title: 'Pronit Das (@pronit_das) / Goa Web3 Hacker & Systems Architect',
      post_url: 'https://twitter.com/pronit_das/status/1765401928371',
      source: 'live_osint',
    },
    {
      platform: 'LinkedIn',
      title: 'Pronit Das - Core Contributor @ ProofOfFace Protocol',
      post_url: 'https://linkedin.com/in/pronit-das-web3',
      source: 'live_osint',
    },
    {
      platform: 'GitHub',
      title: 'pronit-das (Pronit Das) / Repositories: biometric-attestation',
      post_url: 'https://github.com/pronit-das',
      source: 'live_osint',
    },
  ],
  selectedCandidate: {
    platform: 'Twitter / X',
    title: 'Pronit Das (@pronit_das) / Goa Web3 Hacker & Systems Architect',
    post_url: 'https://twitter.com/pronit_das/status/1765401928371',
    source: 'live_osint',
  },
  similarity: 0,
  canonicalJson: '',
  sha256Hash: '',
  keccakHash: '',
  bytes32Hash: '',
  ipfsCid: '',
  ipfsGatewayUrl: '',
  txHash: '',
  txBlock: 0,
  polygonscanUrl: '',
  verifiedBy: '0x3D8609594f8a9202517C642d9fF517Ffa010A511',
  contractAddress: '0x8b32608447d2f97a8E5FF593B612E83Bf911aE5D',
  anchorTimestamp: 0,
  chainVerified: false,
  chainTimestamp: 0,
  tamperDemoActive: false,
  currentStep: 1,
  carouselView: true,
  soundEnabled: true,
  isProcessing: false,
  statusMessage: '',
  error: null,
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  ...initialState,

  setProbeImage: (file, preview) =>
    set({
      probeImage: file,
      probePreview: preview || (file ? URL.createObjectURL(file) : null),
    }),

  setFaceData: (data) =>
    set({
      faceCrop: data.faceCrop,
      hudOverlay: data.hudOverlay,
      embeddingDims: data.embeddingDims,
      bbox: data.bbox,
    }),

  setWebcamActive: (active) => set({ isWebcamActive: active }),

  setActiveSearchTab: (tab) => set({ activeSearchTab: tab }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchResults: (results) => set({ searchResults: results }),

  selectCandidate: (candidate) => set({ selectedCandidate: candidate }),

  setVerificationData: (data) =>
    set({
      similarity: data.similarity,
      canonicalJson: data.canonicalJson,
      sha256Hash: data.sha256Hash,
      keccakHash: data.keccakHash,
      bytes32Hash: data.bytes32Hash,
    }),

  setAnchorData: (data) =>
    set({
      ipfsCid: data.ipfsCid,
      ipfsGatewayUrl: data.ipfsGatewayUrl,
      txHash: data.txHash,
      txBlock: data.txBlock,
      polygonscanUrl: data.polygonscanUrl,
      verifiedBy: data.verifiedBy,
      contractAddress: data.contractAddress,
      anchorTimestamp: data.anchorTimestamp,
    }),

  setChainVerification: (data) =>
    set({
      chainVerified: data.verified,
      chainTimestamp: data.timestamp,
    }),

  setTamperDemo: (active) => set({ tamperDemoActive: active }),

  setCurrentStep: (step) => set({ currentStep: Math.min(5, Math.max(1, step)) }),

  nextStep: () => {
    const cur = get().currentStep
    if (cur < 5) set({ currentStep: cur + 1 })
  },

  prevStep: () => {
    const cur = get().currentStep
    if (cur > 1) set({ currentStep: cur - 1 })
  },

  setCarouselView: (carousel) => set({ carouselView: carousel }),

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

  setProcessing: (processing, message = '') =>
    set({ isProcessing: processing, statusMessage: message }),

  setError: (error) => set({ error }),

  resetPipeline: () => set(initialState),
}))
