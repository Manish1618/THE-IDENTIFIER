"""
Blockchain and IPFS Attestation Module.
Handles IPFS metadata pinning via Pinata and cryptographic proof recording/verification
on the Polygon Amoy Testnet (EVM) via Web3.py, with seamless local simulation for hackathon demo mode.
"""

import os
import json
import time
import hashlib
import requests
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

# Minimal ABI for ProofRegistry.sol
PROOF_REGISTRY_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
            {"internalType": "string", "name": "ipfsCid", "type": "string"}
        ],
        "name": "recordProof",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"}
        ],
        "name": "verifyProof",
        "outputs": [
            {"internalType": "bool", "name": "exists", "type": "bool"},
            {"internalType": "string", "name": "ipfsCid", "type": "string"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
            {"internalType": "address", "name": "verifiedBy", "type": "address"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# In-memory registry simulation for demo/offline fallback mode
_LOCAL_DEMO_REGISTRY = {}


def is_blockchain_configured():
    """Checks if valid private key and contract address are available."""
    pk = os.getenv("PRIVATE_KEY", "").strip()
    contract = os.getenv("CONTRACT_ADDRESS", "").strip()
    rpc = os.getenv("POLYGON_RPC_URL", "").strip()
    demo = os.getenv("DEMO_MODE", "false").lower() in ("true", "1", "yes")

    if demo or not pk or not contract or pk.startswith("your_") or contract.startswith("0x_"):
        return False
    return bool(rpc and pk and contract)


def compute_canonical_hashes(metadata_dict):
    """
    Computes deterministic SHA-256 and Keccak-256 hashes of verification metadata.
    Returns: (canonical_json_str, sha256_hex, keccak256_hex, bytes32_hex)
    """
    canonical_json = json.dumps(metadata_dict, sort_keys=True, separators=(',', ':'))
    sha256_hex = "0x" + hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()
    
    # Web3 Keccak-256
    keccak_bytes = Web3.keccak(text=canonical_json)
    keccak_hex = keccak_bytes.hex()
    if not keccak_hex.startswith("0x"):
        keccak_hex = "0x" + keccak_hex
    
    return canonical_json, sha256_hex, keccak_hex, keccak_hex


def upload_metadata_to_ipfs(metadata_dict):
    """
    Uploads metadata JSON to Pinata IPFS.
    Falls back to deterministic mock IPFS CID if Pinata JWT is missing or in demo mode.
    """
    pinata_jwt = os.getenv("PINATA_JWT", "").strip()
    
    # Use real Pinata if JWT is provided and not demo placeholder
    if pinata_jwt and not pinata_jwt.startswith("your_") and os.getenv("DEMO_MODE", "false").lower() not in ("true", "1"):
        try:
            headers = {
                "Authorization": f"Bearer {pinata_jwt}",
                "Content-Type": "application/json"
            }
            payload = {
                "pinataContent": metadata_dict,
                "pinataMetadata": {
                    "name": f"face_proof_{int(time.time())}.json"
                }
            }
            res = requests.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                json=payload,
                headers=headers,
                timeout=15
            )
            if res.status_code == 200:
                cid = res.json().get("IpfsHash")
                return {
                    "success": True,
                    "cid": cid,
                    "gateway_url": f"https://gateway.pinata.cloud/ipfs/{cid}",
                    "mode": "live_pinata"
                }
        except Exception:
            pass

    # Fallback / Demo CID generation
    canonical_json = json.dumps(metadata_dict, sort_keys=True)
    mock_hash = hashlib.sha256(canonical_json.encode('utf-8')).hexdigest()[:32]
    mock_cid = f"bafybeig{mock_hash}proof"
    
    # Cache locally in memory
    _LOCAL_DEMO_REGISTRY[mock_cid] = metadata_dict

    return {
        "success": True,
        "cid": mock_cid,
        "gateway_url": f"https://ipfs.io/ipfs/{mock_cid}",
        "mode": "demo_simulated"
    }


def anchor_proof_on_chain(content_hash_hex, ipfs_cid):
    """
    Records (contentHash, ipfsCid) on the Polygon Amoy blockchain.
    Falls back to simulated attestation if keys are not configured.
    """
    # Ensure bytes32 format
    if not content_hash_hex.startswith("0x"):
        content_hash_hex = "0x" + content_hash_hex
    content_hash_bytes32 = bytes.fromhex(content_hash_hex[2:])

    if is_blockchain_configured():
        rpc_url = os.getenv("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology")
        private_key = os.getenv("PRIVATE_KEY")
        contract_address = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))

        w3 = Web3(Web3.HTTPProvider(rpc_url))
        account = Account.from_key(private_key)

        contract = w3.eth.contract(address=contract_address, abi=PROOF_REGISTRY_ABI)

        nonce = w3.eth.get_transaction_count(account.address)
        chain_id = w3.eth.chain_id

        # Estimate gas or use conservative limit
        tx = contract.functions.recordProof(content_hash_bytes32, ipfs_cid).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': 200000,
            'maxFeePerGas': w3.to_wei(35, 'gwei'),
            'maxPriorityFeePerGas': w3.to_wei(30, 'gwei'),
            'chainId': chain_id
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
        tx_hash_bytes = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash_bytes, timeout=75)
        tx_hash = receipt.transactionHash.hex()

        return {
            "success": True,
            "mode": "live_amoy",
            "content_hash": content_hash_hex,
            "tx_hash": tx_hash,
            "block_number": receipt.blockNumber,
            "explorer_url": f"https://amoy.polygonscan.com/tx/{tx_hash}",
            "verified_by": account.address,
            "contract_address": contract_address,
            "timestamp": int(time.time())
        }

    # Simulated on-chain recording for zero-config hackathon demo
    simulated_tx = "0x" + hashlib.sha256(f"{content_hash_hex}:{ipfs_cid}:{time.time()}".encode()).hexdigest()
    simulated_signer = "0x71C...AmoyTestWallet"
    recorded_time = int(time.time())

    _LOCAL_DEMO_REGISTRY[content_hash_hex.lower()] = {
        "content_hash": content_hash_hex,
        "ipfs_cid": ipfs_cid,
        "timestamp": recorded_time,
        "verified_by": simulated_signer,
        "tx_hash": simulated_tx,
        "block_number": 8941203
    }

    return {
        "success": True,
        "mode": "demo_simulated",
        "content_hash": content_hash_hex,
        "tx_hash": simulated_tx,
        "block_number": 8941203,
        "explorer_url": f"https://amoy.polygonscan.com/tx/{simulated_tx}",
        "verified_by": simulated_signer,
        "contract_address": "0x7896d88f6B58F0d6118f6d63AcDb615F493aD502",
        "timestamp": recorded_time
    }


def verify_proof_on_chain(content_hash_hex):
    """
    Queries the blockchain to verify if the given content hash has a valid attestation.
    Returns proof existence, IPFS CID, timestamp, and recorder address.
    """
    if not content_hash_hex.startswith("0x"):
        content_hash_hex = "0x" + content_hash_hex
    content_hash_bytes32 = bytes.fromhex(content_hash_hex[2:])

    if is_blockchain_configured():
        try:
            rpc_url = os.getenv("POLYGON_RPC_URL", "https://rpc-amoy.polygon.technology")
            contract_address = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            contract = w3.eth.contract(address=contract_address, abi=PROOF_REGISTRY_ABI)

            exists, cid, ts, verified_by = contract.functions.verifyProof(content_hash_bytes32).call()
            return {
                "exists": exists,
                "ipfs_cid": cid,
                "timestamp": ts,
                "verified_by": verified_by,
                "mode": "live_amoy"
            }
        except Exception as e:
            # Fall back to checking local demo registry
            pass

    # Check local demo registry
    record = _LOCAL_DEMO_REGISTRY.get(content_hash_hex.lower())
    if record:
        return {
            "exists": True,
            "ipfs_cid": record["ipfs_cid"],
            "timestamp": record["timestamp"],
            "verified_by": record["verified_by"],
            "mode": "demo_simulated"
        }

    return {
        "exists": False,
        "ipfs_cid": "",
        "timestamp": 0,
        "verified_by": "0x0000000000000000000000000000000000000000",
        "mode": "demo_simulated"
    }


def generate_certificate_data(metadata, ipfs_cid, tx_receipt):
    """
    Generates a standardized cryptographic proof certificate JSON format.
    """
    tx_hash = tx_receipt.get("tx_hash", "0x000000000000")
    short_hash = tx_hash[-10:].upper().replace("0X", "")
    return {
        "$schema": "https://proofofface.io/schemas/v1/attestation-certificate.json",
        "certificate_id": f"CERT-POF-{short_hash}",
        "protocol": "ProofOfFace v1.0",
        "issued_at": int(time.time()),
        "network": {
            "name": "Polygon Amoy Testnet",
            "chain_id": 80002,
            "contract_address": tx_receipt.get("contract_address"),
            "transaction_hash": tx_hash,
            "block_number": tx_receipt.get("block_number"),
            "explorer_url": tx_receipt.get("explorer_url")
        },
        "decentralized_storage": {
            "protocol": "IPFS",
            "cid": ipfs_cid,
            "gateway_url": f"https://gateway.pinata.cloud/ipfs/{ipfs_cid}"
        },
        "attestation_payload": metadata,
        "verification_signature": {
            "signer": tx_receipt.get("verified_by"),
            "hash_algorithm": "Keccak-256 (EVM Canonical)",
            "content_hash": tx_receipt.get("content_hash") or metadata.get("canonical_keccak", "")
        }
    }

