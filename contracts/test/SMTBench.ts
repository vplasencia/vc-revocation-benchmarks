import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import hre from "hardhat"
import { Merkletree, InMemoryDB, str2Bytes } from "@iden3/js-merkletree"
import { poseidonContract } from "circomlibjs"
import { groth16 } from "snarkjs"
import { packGroth16Proof } from "@zk-kit/utils"

const getWasmPath = (tree: string, depth: number): string => {
  return `./zk-artifacts/${tree}-${depth}.wasm`
}

const getZkeyPath = (tree: string, depth: number): string => {
  return `./zk-artifacts/${tree}-${depth}.zkey`
}

async function deployPoseidon(nInputs: number) {
  const abi = poseidonContract.generateABI(nInputs)
  const bytecode = poseidonContract.createCode(nInputs)

  const Poseidon = await hre.ethers.getContractFactory(abi, bytecode)
  const poseidon = await Poseidon.deploy()
  await poseidon.waitForDeployment()
  return poseidon
}

const MAX_SMT_LEVELS = 10

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

    // SMT Verifier
    const SMTVerifier = await hre.ethers.getContractFactory("SMTVerifier")
    const smtVerifier = await SMTVerifier.deploy()
    const smtVerifierAddress = await smtVerifier.getAddress()

    const SMTBench = await hre.ethers.getContractFactory("SMTBench", {
      libraries: {
        SmtLib: smtAddress
      }
    })
    const smtBench = await SMTBench.deploy(
      MAX_SMT_LEVELS - 1,
      smtVerifierAddress
    )

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
      it("Should insert an element in the tree", async function () {
        const { smtBench } = await loadFixture(deploySMTBenchFixture)

        const size = 100

        for (let i = 0; i < size; i++) {
          await jsSMT.add(BigInt(i + 1), BigInt(i + 1))
          await smtBench.insert(i + 1, i + 1)
        }

        const root = await smtBench.root()

        const jsRoot = (await jsSMT.root()).bigInt()

        await expect(root).to.equal(jsRoot)
      })
    })

    describe("Verify ZK Proof", function () {
      it("Should verify a ZK Proof", async function () {
        const { smtBench } = await loadFixture(deploySMTBenchFixture)

        const depth = 10

        const size = 100

        for (let i = 0; i < size; i++) {
          await jsSMT.add(BigInt(i + 1), BigInt(i + 1))
          await smtBench.insert(1, 1)
        }
        const smtCircomProof = await jsSMT.generateCircomVerifierProof(
          2n,
          await jsSMT.root()
        )
        const { proof: smtZKProof, publicSignals } = await groth16.fullProve(
          {
            enabled: 1, // check if roots are equal
            fnc: 0, // 0 for membership proofs, 1 for non-membership proofs
            root: smtCircomProof.root.string(),
            siblings: smtCircomProof.siblings.map((s) => s.string()),
            oldKey: smtCircomProof.oldKey.string(),
            oldValue: smtCircomProof.oldValue.string(),
            isOld0: smtCircomProof.isOld0 ? 1 : 0,
            key: smtCircomProof.key.string(),
            value: smtCircomProof.value.string()
          },
          getWasmPath("smt", depth),
          getZkeyPath("smt", depth)
        )

        const zkProofPoints = packGroth16Proof(smtZKProof)

        const transaction = smtBench.verifyZkProof({
          root: (await jsSMT.root()).bigInt(),
          points: zkProofPoints
        })

        await expect(transaction)
          .to.emit(smtBench, "SMTProofVerified")
          .withArgs((await jsSMT.root()).bigInt(), zkProofPoints)
      })
    })
  })
})
