// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {InternalLeanIMT, LeanIMTData} from "@zk-kit/lean-imt.sol/InternalLeanIMT.sol";

contract LeanIMTBench {
    using InternalLeanIMT for LeanIMTData;

    LeanIMTData internal tree;

    function insert(uint256 leaf) external returns (uint256) {
        return tree._insert(leaf);
    }

    function insertMany(uint256[] calldata leaves) external returns (uint256) {
        return tree._insertMany(leaves);
    }

    function update(
        uint256 oldLeaf,
        uint256 newLeaf,
        uint256[] calldata merkleProofSiblings
    ) external {
        tree._update(oldLeaf, newLeaf, merkleProofSiblings);
    }

    function root() public view returns (uint256) {
        return tree._root();
    }
}
