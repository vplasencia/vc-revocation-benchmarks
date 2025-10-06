import { Bench, Task } from "tinybench"
import { LeanIMT, type LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import {
  Merkletree,
  InMemoryDB,
  str2Bytes,
  CircomVerifierProof
} from "@iden3/js-merkletree"
import { groth16 } from "snarkjs"
import "ffjavascript"
import { generateTable } from "utils/generate-table"
import { addComparisonColumn } from "utils/add-comparison-column"

/**
 * Depths per SMT tree size:
 * 100 members - 9
 * 500 members - 11
 * 1000 members - 12
 * 2000 members - 13
 */

const getWasmPath = (tree: string, depth: number): string => {
  return `./artifacts/${tree}-${depth}.wasm`
}

const getZkeyPath = (tree: string, depth: number): string => {
  return `./artifacts/${tree}-${depth}.zkey`
}

const main = async () => {
  const bench = new Bench({
    name: "Merkle Tree Benchmarks",
    time: 0,
    iterations: 10,
    warmup: false
  })

  let leanIMT: LeanIMT
  let leanIMTProof: LeanIMTMerkleProof
  let leanIMTDepth: number

  const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

  let smt: Merkletree
  let smtCircomProof: CircomVerifierProof
  let smtMaxDepth: number

  bench
    .add(
      "SMT - Generate ZK Proof 100 Members",
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
          const size = 100
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
      "LeanIMT - Generate ZK Proof 100 Members",
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
          leanIMT.insertMany(
            Array.from({ length: 100 }, (_, i) => BigInt(i + 1))
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
      "SMT - Generate ZK Proof 500 Members",
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
          const size = 500
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
      "LeanIMT - Generate ZK Proof 500 Members",
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
          leanIMT.insertMany(
            Array.from({ length: 500 }, (_, i) => BigInt(i + 1))
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
      "SMT - Generate ZK Proof 1000 Members",
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
          const size = 1000
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
      "LeanIMT - Generate ZK Proof 1000 Members",
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
          leanIMT.insertMany(
            Array.from({ length: 1000 }, (_, i) => BigInt(i + 1))
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
      "SMT - Generate ZK Proof 2000 Members",
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
          const size = 2000
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
      "LeanIMT - Generate ZK Proof 2000 Members",
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
          leanIMT.insertMany(
            Array.from({ length: 2000 }, (_, i) => BigInt(i + 1))
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

  await bench.run()

  const table = bench.table((task: Task) => generateTable(task))

  addComparisonColumn(table, bench)

  console.table(table)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
