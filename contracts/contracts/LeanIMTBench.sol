// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {InternalLeanIMT, LeanIMTData} from "@zk-kit/lean-imt.sol/InternalLeanIMT.sol";

struct LeanIMTProof {
    uint256 root;
    uint256[8] points;
}

interface ILeanIMTVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) external view returns (bool);
}

event LeanIMTProofVerified(
    uint256 indexed root,
    uint256[8] points
);

error LeanIMT__InvalidProof();

contract LeanIMTBench {
    using InternalLeanIMT for LeanIMTData;

    ILeanIMTVerifier public verifier;

    LeanIMTData internal tree;

    constructor(ILeanIMTVerifier _verifier) {
        verifier = _verifier;
    }

    function insert(uint256 leaf) external {
        tree._insert(leaf);
    }

    function verifyZkProof(LeanIMTProof calldata proof) public {
        if (!verifier.verifyProof(
            [proof.points[0], proof.points[1]],
            [
                [proof.points[2], proof.points[3]],
                [proof.points[4], proof.points[5]]
            ],
            [proof.points[6], proof.points[7]],
            [proof.root]
        )) {
            revert LeanIMT__InvalidProof();
        }

        emit LeanIMTProofVerified(proof.root, proof.points);
    }

    function root() public view returns (uint256) {
        return tree._root();
    }
}
