import { Bench, Task } from "tinybench"
import { LeanIMT, type LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import {
  Merkletree,
  Proof,
  verifyProof,
  InMemoryDB,
  str2Bytes,
  CircomVerifierProof
} from "@iden3/js-merkletree"
import { groth16, type Groth16Proof, type PublicSignals } from "snarkjs"
import { readFileSync } from "fs"
import { generateTable } from "utils/generate-table"
import { addComparisonColumn } from "utils/add-comparison-column"
import { generateMarkdownTable } from "utils/generate-markdown-table"

const getWasmPath = (tree: string, depth: number): string => {
  return `./artifacts/${tree}-${depth}.wasm`
}

const getZkeyPath = (tree: string, depth: number): string => {
  return `./artifacts/${tree}-${depth}.zkey`
}

const getVerificationKey = (tree: string, depth: number): any => {
  const rawData = readFileSync(`./artifacts/${tree}-${depth}.json`, "utf-8")
  const data = JSON.parse(rawData)
  return data
}

/**
 * Depths per SMT tree size:
 * 128 members (2^7) - 9
 * 512 members (2^9) - 11
 * 1024 members (2^10) - 12
 * 2048 members (2^11) - 13
 */

/** Benchmark to compare LeanIMT and SMT performance for:
 * - Adding a member
 * - Updating a member
 * - Generating a Merkle Proof
 * - Verifying a Merkle Proof
 * - Generating a ZK Proof of Membership
 * - Verifying a ZK Proof of Membership
 * Each function is benchmarked for tree sizes of 128, 512, 1024, and 2048 members.
 * The benchmarks are run using tinybench and the results are outputted in a markdown table.
 * The comparison column shows the performance difference between LeanIMT and SMT.
 */

const main = async () => {
  const bench = new Bench({
    name: "Merkle Tree Benchmarks",
    time: 0,
    iterations: 30, // The benchmarks are run for 30 iterations to get a more accurate measurement.
    warmup: false
  })

  let leanIMT: LeanIMT
  let leanIMTProof: LeanIMTMerkleProof
  let leanIMTDepth: number
  let leanIMTZKProof: {
    proof: Groth16Proof
    publicSignals: PublicSignals
  }

  const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

  let smt: Merkletree
  let smtProof: Proof
  let smtCircomProof: CircomVerifierProof
  let smtMaxDepth: number
  let smtZKProof: {
    proof: Groth16Proof
    publicSignals: PublicSignals
  }

  bench
    // SMT and LeanIMT - Add Member
    .add(
      "SMT - Add Member Empty Tree",
      async () => {
        await smt.add(200n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 2)
        }
      }
    )
    .add(
      "LeanIMT - Add Member Empty Tree",
      () => {
        leanIMT.insert(200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
        }
      }
    )
    .add(
      "SMT - Add Member 128 Members",
      async () => {
        await smt.add(200n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 9)
          const size = 128
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Add Member 128 Members",
      () => {
        leanIMT.insert(200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 128
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Add Member 512 Members",
      async () => {
        await smt.add(600n, 600n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 11)
          const size = 512
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Add Member 512 Members",
      () => {
        leanIMT.insert(600n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 512
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Add Member 1024 Members",
      async () => {
        await smt.add(2000n, 2000n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 12)
          const size = 1024
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Add Member 1024 Members",
      () => {
        leanIMT.insert(2000n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1024
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Add Member 2048 Members",
      async () => {
        await smt.add(3000n, 3000n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 13)
          const size = 2048
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Add Member 2048 Members",
      () => {
        leanIMT.insert(3000n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 2048
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    // SMT and LeanIMT - Update Member
    .add(
      "SMT - Update Member 128 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 9)
          const size = 128
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 128 Members",
      () => {
        leanIMT.update(1, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 128
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Update Member 512 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 11)
          const size = 512
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 512 Members",
      () => {
        leanIMT.update(1, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 512
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Update Member 1024 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 12)
          const size = 1024
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 1024 Members",
      () => {
        leanIMT.update(1, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1024
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Update Member 2048 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 13)
          const size = 2048
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 2048 Members",
      () => {
        leanIMT.update(1, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 2048
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    // SMT and LeanIMT - Generate Merkle Proof
    .add(
      "SMT - Generate Merkle Proof 128 Members",
      async () => {
        await smt.generateProof(2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 9)
          const size = 128
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Generate Merkle Proof 128 Members",
      () => {
        leanIMT.generateProof(1)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 128
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Generate Merkle Proof 512 Members",
      async () => {
        await smt.generateProof(2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 11)
          const size = 512
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Generate Merkle Proof 512 Members",
      () => {
        leanIMT.generateProof(1)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 512
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Generate Merkle Proof 1024 Members",
      async () => {
        await smt.generateProof(2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 12)
          const size = 1024
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Generate Merkle Proof 1024 Members",
      () => {
        leanIMT.generateProof(1)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1024
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Generate Merkle Proof 2048 Members",
      async () => {
        await smt.generateProof(2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 13)
          const size = 2048
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Generate Merkle Proof 2048 Members",
      () => {
        leanIMT.generateProof(1)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 2048
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    // SMT and LeanIMT - Verify Merkle Proof
    .add(
      "SMT - Verify Merkle Proof 128 Members",
      async () => {
        await verifyProof(await smt.root(), smtProof, 2n, 2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 9)
          const size = 128
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtProof = (await smt.generateProof(2n)).proof
        }
      }
    )
    .add(
      "LeanIMT - Verify Merkle Proof 128 Members",
      () => {
        leanIMT.verifyProof(leanIMTProof)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 128
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
        }
      }
    )
    .add(
      "SMT - Verify Merkle Proof 512 Members",
      async () => {
        await verifyProof(await smt.root(), smtProof, 2n, 2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 11)
          const size = 512
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtProof = (await smt.generateProof(2n)).proof
        }
      }
    )
    .add(
      "LeanIMT - Verify Merkle Proof 512 Members",
      () => {
        leanIMT.verifyProof(leanIMTProof)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 512
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
        }
      }
    )
    .add(
      "SMT - Verify Merkle Proof 1024 Members",
      async () => {
        await verifyProof(await smt.root(), smtProof, 2n, 2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 12)
          const size = 1024
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtProof = (await smt.generateProof(2n)).proof
        }
      }
    )
    .add(
      "LeanIMT - Verify Merkle Proof 1024 Members",
      () => {
        leanIMT.verifyProof(leanIMTProof)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1024
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
        }
      }
    )
    .add(
      "SMT - Verify Merkle Proof 2048 Members",
      async () => {
        await verifyProof(await smt.root(), smtProof, 2n, 2n)
      },
      {
        beforeAll: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 13)
          const size = 2048
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtProof = (await smt.generateProof(2n)).proof
        }
      }
    )
    .add(
      "LeanIMT - Verify Merkle Proof 2048 Members",
      () => {
        leanIMT.verifyProof(leanIMTProof)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 2048
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
        }
      }
    )
    // SMT and LeanIMT - Generate ZK Proof of Membership
    .add(
      "SMT - Generate ZK Proof 128 Members",
      async () => {
        await groth16.fullProve(
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
          getWasmPath("smt", smtMaxDepth),
          getZkeyPath("smt", smtMaxDepth)
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 9
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 128
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
        }
      }
    )
    .add(
      "LeanIMT - Generate ZK Proof 128 Members",
      async () => {
        await groth16.fullProve(
          {
            leaf: 2n,
            depth: leanIMTDepth,
            index: leanIMTProof.index,
            siblings: leanIMTProof.siblings
          },
          getWasmPath("leanimt", leanIMTDepth),
          getZkeyPath("leanimt", leanIMTDepth)
        )
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 128
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
        }
      }
    )
    .add(
      "SMT - Generate ZK Proof 512 Members",
      async () => {
        await groth16.fullProve(
          {
            enabled: 1,
            fnc: 0, // 0 for membership proofs, 1 for non-membership proofs
            root: smtCircomProof.root.string(),
            siblings: smtCircomProof.siblings.map((s) => s.string()),
            oldKey: smtCircomProof.oldKey.string(),
            oldValue: smtCircomProof.oldValue.string(),
            isOld0: smtCircomProof.isOld0 ? 1 : 0,
            key: smtCircomProof.key.string(),
            value: smtCircomProof.value.string()
          },
          getWasmPath("smt", smtMaxDepth),
          getZkeyPath("smt", smtMaxDepth)
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 11
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 512
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
        }
      }
    )
    .add(
      "LeanIMT - Generate ZK Proof 512 Members",
      async () => {
        await groth16.fullProve(
          {
            leaf: 2n,
            depth: leanIMTDepth,
            index: leanIMTProof.index,
            siblings: leanIMTProof.siblings
          },
          getWasmPath("leanimt", leanIMTDepth),
          getZkeyPath("leanimt", leanIMTDepth)
        )
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 512
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
        }
      }
    )
    .add(
      "SMT - Generate ZK Proof 1024 Members",
      async () => {
        await groth16.fullProve(
          {
            enabled: 1,
            fnc: 0, // 0 for membership proofs, 1 for non-membership proofs
            root: smtCircomProof.root.string(),
            siblings: smtCircomProof.siblings.map((s) => s.string()),
            oldKey: smtCircomProof.oldKey.string(),
            oldValue: smtCircomProof.oldValue.string(),
            isOld0: smtCircomProof.isOld0 ? 1 : 0,
            key: smtCircomProof.key.string(),
            value: smtCircomProof.value.string()
          },
          getWasmPath("smt", smtMaxDepth),
          getZkeyPath("smt", smtMaxDepth)
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 12
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 1024
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
        }
      }
    )
    .add(
      "LeanIMT - Generate ZK Proof 1024 Members",
      async () => {
        await groth16.fullProve(
          {
            leaf: 2n,
            depth: leanIMTDepth,
            index: leanIMTProof.index,
            siblings: leanIMTProof.siblings
          },
          getWasmPath("leanimt", leanIMTDepth),
          getZkeyPath("leanimt", leanIMTDepth)
        )
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1024
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
        }
      }
    )
    .add(
      "SMT - Generate ZK Proof 2048 Members",
      async () => {
        await groth16.fullProve(
          {
            enabled: 1,
            fnc: 0, // 0 for membership proofs, 1 for non-membership proofs
            root: smtCircomProof.root.string(),
            siblings: smtCircomProof.siblings.map((s) => s.string()),
            oldKey: smtCircomProof.oldKey.string(),
            oldValue: smtCircomProof.oldValue.string(),
            isOld0: smtCircomProof.isOld0 ? 1 : 0,
            key: smtCircomProof.key.string(),
            value: smtCircomProof.value.string()
          },
          getWasmPath("smt", smtMaxDepth),
          getZkeyPath("smt", smtMaxDepth)
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 13
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 2048
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
        }
      }
    )
    .add(
      "LeanIMT - Generate ZK Proof 2048 Members",
      async () => {
        await groth16.fullProve(
          {
            leaf: 2n,
            depth: leanIMTDepth,
            index: leanIMTProof.index,
            siblings: leanIMTProof.siblings
          },
          getWasmPath("leanimt", leanIMTDepth),
          getZkeyPath("leanimt", leanIMTDepth)
        )
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 2048
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
        }
      }
    )
    // SMT and LeanIMT - Verify ZK Proof of Membership
    .add(
      "SMT - Verify ZK Proof 128 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("smt", smtMaxDepth),
          smtZKProof.publicSignals,
          smtZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 9
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 128
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
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
            getWasmPath("smt", smtMaxDepth),
            getZkeyPath("smt", smtMaxDepth)
          )
        }
      }
    )
    .add(
      "LeanIMT - Verify ZK Proof 128 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("leanimt", leanIMTDepth),
          leanIMTZKProof.publicSignals,
          leanIMTZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 128
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
          leanIMTZKProof = await groth16.fullProve(
            {
              leaf: 2n,
              depth: leanIMTDepth,
              index: leanIMTProof.index,
              siblings: leanIMTProof.siblings
            },
            getWasmPath("leanimt", leanIMTDepth),
            getZkeyPath("leanimt", leanIMTDepth)
          )
        }
      }
    )
    .add(
      "SMT - Verify ZK Proof 512 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("smt", smtMaxDepth),
          smtZKProof.publicSignals,
          smtZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 11
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 512
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
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
            getWasmPath("smt", smtMaxDepth),
            getZkeyPath("smt", smtMaxDepth)
          )
        }
      }
    )
    .add(
      "LeanIMT - Verify ZK Proof 512 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("leanimt", leanIMTDepth),
          leanIMTZKProof.publicSignals,
          leanIMTZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 512
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
          leanIMTZKProof = await groth16.fullProve(
            {
              leaf: 2n,
              depth: leanIMTDepth,
              index: leanIMTProof.index,
              siblings: leanIMTProof.siblings
            },
            getWasmPath("leanimt", leanIMTDepth),
            getZkeyPath("leanimt", leanIMTDepth)
          )
        }
      }
    )
    .add(
      "SMT - Verify ZK Proof 1024 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("smt", smtMaxDepth),
          smtZKProof.publicSignals,
          smtZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 12
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 1024
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
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
            getWasmPath("smt", smtMaxDepth),
            getZkeyPath("smt", smtMaxDepth)
          )
        }
      }
    )
    .add(
      "LeanIMT - Verify ZK Proof 1024 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("leanimt", leanIMTDepth),
          leanIMTZKProof.publicSignals,
          leanIMTZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1024
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
          leanIMTZKProof = await groth16.fullProve(
            {
              leaf: 2n,
              depth: leanIMTDepth,
              index: leanIMTProof.index,
              siblings: leanIMTProof.siblings
            },
            getWasmPath("leanimt", leanIMTDepth),
            getZkeyPath("leanimt", leanIMTDepth)
          )
        }
      }
    )
    .add(
      "SMT - Verify ZK Proof 2048 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("smt", smtMaxDepth),
          smtZKProof.publicSignals,
          smtZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          smtMaxDepth = 13
          smt = new Merkletree(
            new InMemoryDB(str2Bytes("Tree")),
            true,
            smtMaxDepth
          )
          const size = 2048
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtCircomProof = await smt.generateCircomVerifierProof(
            2n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
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
            getWasmPath("smt", smtMaxDepth),
            getZkeyPath("smt", smtMaxDepth)
          )
        }
      }
    )
    .add(
      "LeanIMT - Verify ZK Proof 2048 Members",
      async () => {
        await groth16.verify(
          getVerificationKey("leanimt", leanIMTDepth),
          leanIMTZKProof.publicSignals,
          leanIMTZKProof.proof
        )
      },
      {
        beforeAll: async () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 2048
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(1)
          leanIMTDepth =
            leanIMTProof.siblings.length !== 0
              ? leanIMTProof.siblings.length
              : 1
          for (let i = 0; i < leanIMT.depth; i += 1) {
            if (leanIMTProof.siblings[i] === undefined) {
              leanIMTProof.siblings[i] = 0n
            }
          }
          leanIMTZKProof = await groth16.fullProve(
            {
              leaf: 2n,
              depth: leanIMTDepth,
              index: leanIMTProof.index,
              siblings: leanIMTProof.siblings
            },
            getWasmPath("leanimt", leanIMTDepth),
            getZkeyPath("leanimt", leanIMTDepth)
          )
        }
      }
    )

  await bench.run()

  const table = bench.table((task: Task) => generateTable(task))
  addComparisonColumn(table, bench)
  console.table(table)
  generateMarkdownTable(table, "merkle-tree-benchmarks.md")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
