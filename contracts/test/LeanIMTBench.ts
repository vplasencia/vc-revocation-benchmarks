import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import hre from "hardhat"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import { groth16 } from "snarkjs"
import { packGroth16Proof } from "@zk-kit/utils"

const getWasmPath = (tree: string, depth: number): string => {
  return `./zk-artifacts/${tree}-${depth}.wasm`
}

const getZkeyPath = (tree: string, depth: number): string => {
  return `./zk-artifacts/${tree}-${depth}.zkey`
}

describe("LeanIMTBench", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLeanIMTBenchFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners()

    // PoseidonT3 is for arity 2
    const Poseidon = await hre.ethers.getContractFactory("PoseidonT3")
    const poseidon = await Poseidon.deploy()
    const poseidonAddress = await poseidon.getAddress()

    // LeanIMT Verifier
    const LeanIMTVerifier =
      await hre.ethers.getContractFactory("LeanIMTVerifier")
    const leanIMTVerifier = await LeanIMTVerifier.deploy()
    const leanIMTVerifierAddress = await leanIMTVerifier.getAddress()

    const LeanIMTBench = await hre.ethers.getContractFactory("LeanIMTBench", {
      libraries: {
        ["PoseidonT3"]: poseidonAddress
      }
    })
    const leanIMTBench = await LeanIMTBench.deploy(leanIMTVerifierAddress)

    return { leanIMTBench, owner, otherAccount }
  }

  let jsLeanIMT: LeanIMT
  beforeEach(async () => {
    jsLeanIMT = new LeanIMT((a, b) => poseidon2([a, b]))
  })

  describe("LeanIMTBench", function () {
    describe("Insert", function () {
      it("Should insert an element in the tree", async function () {
        const { leanIMTBench } = await loadFixture(deployLeanIMTBenchFixture)

        jsLeanIMT.insert(BigInt(1))

        await leanIMTBench.insert(1)

        const root = await leanIMTBench.root()

        await expect(root).to.equal(jsLeanIMT.root)
      })
    })

    describe("Verify ZK Proof", function () {
      it("Should verify a ZK Proof", async function () {
        const { leanIMTBench } = await loadFixture(deployLeanIMTBenchFixture)

        const depth = 10

        const size = 10

        for (let i = 0; i < size; i++) {
          await leanIMTBench.insert(BigInt(i + 1))
          jsLeanIMT.insert(BigInt(i + 1))
        }

        const merkleProof = jsLeanIMT.generateProof(1)

        const merkleProofLength = merkleProof.siblings.length

        for (let i = 0; i < depth; i += 1) {
          if (merkleProof.siblings[i] === undefined) {
            merkleProof.siblings[i] = 0n
          }
        }

        const { proof: leanIMTZKProof, publicSignals } =
          await groth16.fullProve(
            {
              leaf: 2n,
              depth: merkleProofLength,
              index: merkleProof.index,
              siblings: merkleProof.siblings
            },
            getWasmPath("leanimt", depth),
            getZkeyPath("leanimt", depth)
          )

        const zkProofPoints = packGroth16Proof(leanIMTZKProof)

        const transaction = leanIMTBench.verifyZkProof({
          root: merkleProof.root.toString(),
          points: zkProofPoints
        })

        await expect(transaction)
          .to.emit(leanIMTBench, "LeanIMTProofVerified")
          .withArgs(merkleProof.root.toString(), zkProofPoints)
      })
    })
  })
})
