"use client"

import { useState } from "react"
import { LeanIMT, LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
// import { poseidon } from "@iden3/js-crypto"
import {
  Merkletree,
  str2Bytes,
  InMemoryDB,
  CircomVerifierProof
} from "@iden3/js-merkletree"
import { Bench, Task } from "tinybench"
import { groth16 } from "snarkjs"
import { addComparisonColumn } from "@/utils/add-comparison-column"
import { generateTable } from "@/utils/generate-table"
import Table from "@/components/Table"
import { generateMarkdownTable } from "@/utils/generate-markdown-table"

/**
 * Depth SMT tree size:
 * 1024 members (2^10) - 12
 */

const getWasmPath = (tree: string, depth: number): string => {
  return `/zk-artifacts/${tree}-${depth}.wasm`
}

const getZkeyPath = (tree: string, depth: number): string => {
  return `/zk-artifacts/${tree}-${depth}.zkey`
}

export default function Benchmark() {
  const [dataTable, setDataTable] = useState<
    (Record<string, string | number | undefined> | null)[]
  >([])
  const [loading, setLoading] = useState(false)

  const generateBenchmarkTable = async () => {
    setLoading(true)

    try {
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

      await new Promise(requestAnimationFrame)

      bench
        // SMT and LeanIMT - Add Member
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
        // SMT and LeanIMT - Generate Merkle Proof
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
        // SMT and LeanIMT - Generate ZK Proof of Membership
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

      await bench.run()
      const table = bench.table((task: Task) => generateTable(task))
      addComparisonColumn(table, bench)
      setDataTable(table)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col my-10 mx-10">
      <div className="flex flex-col gap-10 mt-10 justify-center items-center">
        <div className="flex gap-5">
          <button
            onClick={generateBenchmarkTable}
            disabled={loading}
            className="flex justify-center items-center cursor-pointer disabled:cursor-not-allowed space-x-3 font-medium rounded-md px-3 py-2 bg-blue-200 hover:bg-blue-300 transition-colors duration-300 ease-in-out"
          >
            Generate Benchmark Table
          </button>
          {dataTable.length > 0 && !loading && (
            <button
              onClick={() =>
                generateMarkdownTable(
                  dataTable as Record<string, string | number>[],
                  "merkle-tree-benchmarks-browser.md"
                )
              }
              disabled={loading}
              className="flex justify-center items-center cursor-pointer disabled:cursor-not-allowed space-x-3 font-medium rounded-md px-3 py-2 bg-blue-200 hover:bg-blue-300 transition-colors duration-300 ease-in-out"
            >
              Download Markdown Table
            </button>
          )}
        </div>

        {loading && <div className="loader"></div>}
        {!loading && dataTable.length > 0 && (
          <div>
            <Table data={dataTable} />
          </div>
        )}
      </div>
    </div>
  )
}
