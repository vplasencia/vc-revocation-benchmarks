// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {SmtLib} from "@iden3/contracts/lib/SmtLib.sol";

struct SMTProof {
    uint256 root;
    uint256[8] points;
}

interface ISMTVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) external view returns (bool);
}

event SMTProofVerified(
    uint256 indexed root,
    uint256[8] points
);

error SMT__InvalidProof();

contract SMTBench {
    using SmtLib for SmtLib.Data;

    ISMTVerifier public verifier;
    
    SmtLib.Data internal tree;

    constructor(uint256 maxDepth, ISMTVerifier _verifier) {
        tree.initialize(maxDepth);
        verifier = _verifier;
    }

    function insert(uint256 i, uint256 v) external {
        tree.addLeaf(i, v);
    }

    function verifyZkProof(SMTProof calldata proof) public returns (bool) {
        if (!verifier.verifyProof(
            [proof.points[0], proof.points[1]],
            [
                [proof.points[2], proof.points[3]],
                [proof.points[4], proof.points[5]]
            ],
            [proof.points[6], proof.points[7]],
            [
                proof.root
            ]
        )){
            revert SMT__InvalidProof();
        }

        emit SMTProofVerified(proof.root, proof.points);
    }

    function root() public view returns (uint256) {
        return tree.getRoot();
    }
}
