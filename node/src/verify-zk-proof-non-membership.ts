import { Bench, Task } from "tinybench"
import {
  Merkletree,
  InMemoryDB,
  str2Bytes,
  CircomVerifierProof
} from "@iden3/js-merkletree"
import { groth16, type Groth16Proof, type PublicSignals } from "snarkjs"
import { readFileSync } from "fs"
import { generateTable } from "utils/generate-table"
import { generateMarkdown } from "utils/generate-markdown"

/**
 * Depths per SMT tree size:
 * 128 members (2^7) - 9
 * 512 members (2^9) - 11
 * 1024 members (2^10) - 12
 * 2048 members (2^11) - 13
 */

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

const main = async () => {
  const bench = new Bench({
    name: "Merkle Tree Benchmarks",
    time: 0,
    iterations: 30,
    warmup: false
  })

  let smt: Merkletree
  let smtCircomProof: CircomVerifierProof
  let smtMaxDepth: number
  let smtZKProof: {
    proof: Groth16Proof
    publicSignals: PublicSignals
  }

  bench
    .add(
      "SMT - Generate ZK Proof 128 Members",
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
            200n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
            {
              enabled: 1, // check if roots are equal
              fnc: 1, // 0 for membership proofs, 1 for non-membership proofs
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
      "SMT - Generate ZK Proof 512 Members",
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
            550n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
            {
              enabled: 1, // check if roots are equal
              fnc: 1, // 0 for membership proofs, 1 for non-membership proofs
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
      "SMT - Generate ZK Proof 1024 Members",
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
            1500n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
            {
              enabled: 1, // check if roots are equal
              fnc: 1, // 0 for membership proofs, 1 for non-membership proofs
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
      "SMT - Generate ZK Proof 2048 Members",
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
            2500n,
            await smt.root()
          )
          smtZKProof = await groth16.fullProve(
            {
              enabled: 1, // check if roots are equal
              fnc: 1, // 0 for membership proofs, 1 for non-membership proofs
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

  await bench.run()

  const table = bench.table((task: Task) => generateTable(task))

  console.table(table)

  generateMarkdown(table, "verify-zk-proof-non-membership.md")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
