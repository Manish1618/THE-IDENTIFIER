# ✦ THE IDENTITY ✦
> **Decentralized Biometric Attestation & Multimodal OSINT Protocol**  
> *HackerHouse Goa 2026 Edition*

---

## 🌟 Overview

**THE IDENTITY** is an end-to-end decentralized biometric attestation platform. It bridges real-time facial biometrics with Web3 cryptographic immutability:

1. **Biometric Face Ingestion**: Extracts a deterministic **512-D facial geometry vector** using DeepFace (`Facenet512`) and RetinaFace, rendering an animated biometric HUD overlay.
2. **Multimodal OSINT Search**: Leverages **Google Gemini 3.6 Flash Vision** and live web intelligence to discover public social footprints and handle profiles.
3. **Biometric Verification & Hasher**: Computes cosine angle similarity metrics and digests the biometric proof into **RFC 8785 Canonical JSON** with SHA-256 and EVM `bytes32` Keccak-256 hashes.
4. **IPFS & Polygon Amoy Attestation**: Pins canonical attestation metadata to **IPFS** via Pinata and immutably anchors the proof hash on the **Polygon Amoy Testnet (Chain ID: 80002)**.
5. **On-Chain Verification & Tamper Simulation**: Queries the live smart contract registry and features an interactive **1-byte tamper attack demo** proving mathematical immutability.

---

## ⚡ Quick Start

### Option 1: 1-Click Instant Launcher (Windows)
Double-click:
```cmd
START_THE_IDENTITY.bat
```
*This automatically launches both the backend and frontend servers and opens http://localhost:5173/ in your browser. *

---

### Option 2: Manual Setup

#### 1. Backend Setup (FastAPI + Python 3.11)
```bash
# Clone the repository
git clone https://github.com/Manish1618/THE-IDENTIFIER.git
cd THE-IDENTIFIER

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Run FastAPI backend
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
Backend API will be live at `http://localhost:8000` (Swagger UI at `/docs`).

#### 2. Frontend Setup (React + Vite + TailwindCSS)
```bash
cd frontend
npm install
npm run dev -- --port 5173
```
Web interface will be live at `http://localhost:5173`.

---

## 🔑 Environment Configuration

Copy `.env.example` to `.env` and provide your credentials:

```env
# Google Gemini Multimodal Vision API (Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# Pinata IPFS (Decentralized Pinning - Optional)
PINATA_JWT=your_pinata_jwt_here

# Polygon Amoy Testnet RPC
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_CHAIN_ID=80002
CONTRACT_ADDRESS=0x8b32608447d2f97a8E5FF593B612E83Bf911aE5D
PRIVATE_KEY=your_wallet_private_key_here

# Offline Demo Mode (Set true to test with fixtures without API keys)
DEMO_MODE=false
```

---

## 🛠️ Architecture & Tech Stack

| Component | Technologies Used |
|---|---|
| **Frontend UI** | React 18, Vite, TypeScript, TailwindCSS, Framer Motion, Lucide Icons |
| **Motion & 3D** | Three.js, React Three Fiber, Drei, Lottie Web Animation |
| **Biometric AI** | DeepFace (`Facenet512`), RetinaFace, OpenCV, PIL, NumPy |
| **Multimodal OSINT**| Google Gemini 3.6 Flash, DuckDuckGo OSINT Engine, Google Lens |
| **Cryptographic Digest** | RFC 8785 Canonical JSON, SHA-256, Keccak-256 (EVM `bytes32`) |
| **Decentralized Storage**| Pinata IPFS IPFS Gateway |
| **Smart Contract** | Solidity (`ProofRegistry.sol`), Polygon Amoy Testnet (`80002`), Web3.py |

---

## 📜 Smart Contract

- **Contract**: `ProofRegistry.sol`
- **Network**: Polygon Amoy Testnet (`Chain ID: 80002`)
- **Deployed Address**: [`0x8b32608447d2f97a8E5FF593B612E83Bf911aE5D`](https://amoy.polygonscan.com/address/0x8b32608447d2f97a8E5FF593B612E83Bf911aE5D)

---

## 🔒 Security Notice

- Real biometric raw vectors are hashed canonically using RFC 8785 standards before being stored.
- Private keys and API keys are strictly excluded from version control via `.gitignore`. Never commit `.env` files.

---

## 👤 Author & Sole Contributor

- **Team Name**: THE HELLFIRE CLUB
- **Project**: THE IDENTITY — HackerHouse Goa 2026

