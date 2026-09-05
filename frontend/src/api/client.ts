import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} (${response.status})`)
    return response
  },
  (error) => {
    console.error('⚠️ API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// ===== API Methods =====

export const ingestFace = async (file?: File, imageB64?: string) => {
  if (file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/ingest-face', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } else if (imageB64) {
    const response = await apiClient.post('/api/ingest-face', { image_b64: imageB64 })
    return response.data
  } else {
    const response = await apiClient.post('/api/ingest-face')
    return response.data
  }
}

export const loadDemoFace = async (name: string = 'Pronit Das') => {
  const response = await apiClient.post('/api/demo-face', null, {
    params: { name },
  })
  return response.data
}

export const searchSocial = async (query?: string, imageUrl?: string, imageBytesB64?: string) => {
  const payload: any = {}
  if (query) payload.query = query
  if (imageUrl) payload.image_url = imageUrl
  if (imageBytesB64) payload.image_bytes_b64 = imageBytesB64

  // Send in JSON request body so large base64 image strings are not truncated by HTTP URL limits
  const response = await apiClient.post('/api/search-social', payload)
  return response.data
}

export const verifyBiometric = async (
  probeImage?: File | null,
  candidateUrl: string = 'https://twitter.com/identity/status/1',
  similarityOverride?: number
) => {
  const params: any = { candidate_url: candidateUrl }
  if (similarityOverride !== undefined) {
    params.similarity_override = similarityOverride
  }

  if (probeImage) {
    const formData = new FormData()
    formData.append('probe_image', probeImage)
    const response = await apiClient.post('/api/verify-biometric', formData, {
      params,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  } else {
    const response = await apiClient.post('/api/verify-biometric', null, {
      params,
    })
    return response.data
  }
}

export const anchorProof = async (contentHash: string, metadata?: any) => {
  const response = await apiClient.post('/api/anchor-proof', metadata || null, {
    params: { content_hash: contentHash },
  })
  return response.data
}

export const verifyChain = async (contentHash: string, tamper: boolean = false) => {
  const response = await apiClient.get(`/api/verify-chain/${contentHash}`, {
    params: { tamper },
  })
  return response.data
}

export const healthCheck = async () => {
  const response = await apiClient.get('/api/health')
  return response.data
}
