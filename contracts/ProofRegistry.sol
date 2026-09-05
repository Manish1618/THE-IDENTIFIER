// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofRegistry
 * @dev Anchors biometric identity verification proofs to the blockchain.
 * Allows tamper-evident attestation of social media reverse-search records and biometric hashes.
 */
contract ProofRegistry {
    struct Attestation {
        bytes32 contentHash;
        string ipfsCid;
        uint256 timestamp;
        address verifiedBy;
    }

    // Mapping from contentHash (keccak256 or sha256) to its Attestation record
    mapping(bytes32 => Attestation) public attestations;

    // Event emitted when a proof is recorded on-chain
    event AttestationRecorded(
        bytes32 indexed contentHash,
        string ipfsCid,
        uint256 timestamp,
        address indexed verifiedBy
    );

    /**
     * @notice Records a new proof on-chain
     * @param contentHash The cryptographic hash of the verification payload
     * @param ipfsCid The IPFS CID pointing to the full metadata JSON
     */
    function recordProof(bytes32 contentHash, string calldata ipfsCid) external {
        require(attestations[contentHash].timestamp == 0, "Error: Proof already exists on-chain");
        
        attestations[contentHash] = Attestation({
            contentHash: contentHash,
            ipfsCid: ipfsCid,
            timestamp: block.timestamp,
            verifiedBy: msg.sender
        });

        emit AttestationRecorded(contentHash, ipfsCid, block.timestamp, msg.sender);
    }

    /**
     * @notice Verifies if a proof exists on-chain and returns details
     * @param contentHash The cryptographic hash to check
     * @return exists True if proof exists on-chain
     * @return ipfsCid IPFS CID of the metadata
     * @return timestamp Block timestamp when recorded
     * @return verifiedBy Wallet address that submitted the proof
     */
    function verifyProof(bytes32 contentHash) external view returns (
        bool exists,
        string memory ipfsCid,
        uint256 timestamp,
        address verifiedBy
    ) {
        Attestation memory record = attestations[contentHash];
        if (record.timestamp == 0) {
            return (false, "", 0, address(0));
        }
        return (true, record.ipfsCid, record.timestamp, record.verifiedBy);
    }
}
