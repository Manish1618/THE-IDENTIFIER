"""
Pydantic v2 schemas for ProofOfFace Cyberpunk UI API.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


# ===== Step 1: Face Ingestion =====
class FaceIngestResponse(BaseModel):
    """Response from /api/ingest-face"""
    face_crop_base64: str = Field(..., description="Base64-encoded face crop image")
    hud_image_base64: str = Field(..., description="Base64-encoded HUD overlay image")
    embedding_dims: int = Field(..., description="Number of dimensions in face embedding (512)")
    bbox: Dict[str, int] = Field(..., description="Face bounding box: {x, y, w, h}")
    message: str = Field(default="Face successfully ingested with biometric HUD overlay")


# ===== Step 2: Social Search =====
class SocialMatch(BaseModel):
    """Single social media or web match"""
    platform: str = Field(..., description="Platform name (Twitter/X, Reddit, LinkedIn, Web, etc.)")
    title: str = Field(..., description="Match title or description")
    post_url: str = Field(..., description="URL to the social post or web page")
    thumbnail: Optional[str] = Field(None, description="Thumbnail image URL")
    source: str = Field(..., description="Source attribution")


class SocialSearchRequest(BaseModel):
    query: Optional[str] = Field(None, description="Search query or name")
    image_url: Optional[str] = Field(None, description="Public image URL")
    image_bytes_b64: Optional[str] = Field(None, description="Base64-encoded image data")


class SocialSearchResponse(BaseModel):
    """Response from /api/search-social"""
    matches: List[SocialMatch] = Field(default_factory=list, description="List of social/web matches")
    total: int = Field(..., description="Total number of matches found")
    query_time_ms: int = Field(..., description="Query execution time in milliseconds")
    source: str = Field(..., description="Search strategy used (vision, serpapi, osint, demo)")
    message: str = Field(default="Social media search completed")


# ===== Step 3: Biometric Verification & Hash Digester =====
class BiometricVerifyResponse(BaseModel):
    """Response from /api/verify-biometric"""
    similarity_pct: float = Field(..., description="Cosine similarity percentage (0-100)")
    canonical_json: str = Field(..., description="RFC 8785 canonical JSON metadata")
    sha256_hash: str = Field(..., description="SHA-256 hash (0x-prefixed)")
    keccak_hash: str = Field(..., description="Keccak-256 hash (0x-prefixed)")
    bytes32_hash: str = Field(..., description="EVM bytes32 content hash (0x-prefixed)")
    message: str = Field(default="Biometric verification and hash generation complete")


# ===== Step 4: IPFS & Blockchain Anchoring =====
class IPFSAnchorResponse(BaseModel):
    """Response from /api/anchor-proof"""
    ipfs_cid: str = Field(..., description="IPFS CID (Content Identifier)")
    ipfs_gateway_url: str = Field(..., description="Public IPFS gateway URL")
    tx_hash: str = Field(..., description="Blockchain transaction hash (0x-prefixed)")
    tx_block: int = Field(..., description="Block number where transaction was mined")
    polygonscan_url: str = Field(..., description="Polygonscan explorer link")
    verified_by: str = Field(..., description="Wallet address that signed the transaction")
    contract_address: str = Field(..., description="ProofRegistry contract address")
    timestamp: int = Field(..., description="Unix timestamp of anchoring")
    mode: str = Field(..., description="Execution mode: live_amoy or demo_simulated")
    message: str = Field(default="Proof anchored on Polygon Amoy testnet")


# ===== Step 5: Chain Verification =====
class ChainVerifyResponse(BaseModel):
    """Response from /api/verify-chain/{content_hash}"""
    exists: bool = Field(..., description="Whether the content hash exists on-chain")
    ipfs_cid: str = Field(default="", description="Associated IPFS CID")
    timestamp: int = Field(default=0, description="Unix timestamp of original anchoring")
    verified_by: str = Field(default="0x0000000000000000000000000000000000000000", description="Original recorder address")
    tamper_detected: bool = Field(default=False, description="Whether tamper simulation was triggered")
    mode: str = Field(..., description="Verification mode: live_amoy or demo_simulated")
    message: str = Field(default="On-chain verification complete")


# ===== Health Check =====
class ServiceStatus(BaseModel):
    """Individual service health status"""
    service: str = Field(..., description="Service name")
    available: bool = Field(..., description="Whether the service is available")
    message: str = Field(default="", description="Status message or error")


class HealthResponse(BaseModel):
    """Response from /api/health"""
    status: str = Field(default="healthy", description="Overall system status")
    services: List[ServiceStatus] = Field(default_factory=list, description="Individual service statuses")
    timestamp: int = Field(..., description="Current Unix timestamp")
