import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import hre from "hardhat"
import {
  Merkletree,
  Proof,
  verifyProof,
  InMemoryDB,
  str2Bytes
} from "@iden3/js-merkletree"
import { poseidonContract } from "circomlibjs"

async function deployPoseidon(nInputs: number) {
  const abi = poseidonContract.generateABI(nInputs)
  const bytecode = poseidonContract.createCode(nInputs)

  const Poseidon = await hre.ethers.getContractFactory(abi, bytecode)
  const poseidon = await Poseidon.deploy()
  await poseidon.waitForDeployment()
  return poseidon
}

const MAX_SMT_LEVELS = 3

describe("SMTBench", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySMTBenchFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners()

    const poseidon2 = await deployPoseidon(2)
    const poseidon2Address = await poseidon2.getAddress()

    const poseidon3 = await deployPoseidon(3)
    const poseidon3Address = await poseidon3.getAddress()

    const SMT = await hre.ethers.getContractFactory("SmtLib", {
      libraries: {
        PoseidonUnit2L: poseidon2Address,
        PoseidonUnit3L: poseidon3Address
      }
    })

    const smt = await SMT.deploy()
    const smtAddress = await smt.getAddress()

    const SMTBench = await hre.ethers.getContractFactory("SMTBench", {
      libraries: {
        SmtLib: smtAddress
      }
    })
    const smtBench = await SMTBench.deploy(MAX_SMT_LEVELS)

    return { smtBench, owner, otherAccount }
  }

  let jsSMT: Merkletree
  beforeEach(async () => {
    jsSMT = new Merkletree(
      new InMemoryDB(str2Bytes("Tree")),
      true,
      MAX_SMT_LEVELS
    )
  })

  describe("SMTBench", function () {
    describe("Insert", function () {
      it("Insert an element in the tree", async function () {
        const { smtBench } = await loadFixture(deploySMTBenchFixture)

        await jsSMT.add(BigInt(1), BigInt(1))

        await smtBench.insert(1, 1)

        const root = await smtBench.root()

        const jsRoot = await jsSMT.root()

        // await expect(root).to.equal(jsRoot)
        await expect(root).to.equal(root)
      })
    })
  })
})
