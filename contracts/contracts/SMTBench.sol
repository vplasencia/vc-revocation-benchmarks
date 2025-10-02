// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {SmtLib} from "@iden3/contracts/lib/SmtLib.sol";

contract SMTBench {
    using SmtLib for SmtLib.Data;
    
    SmtLib.Data internal tree;

    constructor(uint256 maxDepth) {
        tree.initialize(maxDepth);
    }

    function insert(uint256 i, uint256 v) external {
        tree.addLeaf(i, v);
    }

    function root() public view returns (uint256) {
        return tree.getRoot();
    }
}
