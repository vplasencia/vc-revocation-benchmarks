"use client"

import { useState } from "react"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
// import { poseidon } from "@iden3/js-crypto"
import { Merkletree, str2Bytes, InMemoryDB } from "@iden3/js-merkletree"
import { Bench, Task } from "tinybench"
import { addComparisonColumn } from "@/utils/add-comparison-column"
import { generateTable } from "@/utils/generate-table"
import Table from "@/components/Table"
import { generateMarkdownTable } from "@/utils/generate-markdown-table"

export default function Benchmark() {
  const [dataTable, setDataTabe] = useState<
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

      const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

      let smt: Merkletree

      await new Promise(requestAnimationFrame)

      bench
        .add(
          "SMT - Generate Merkle Proof 100 Members",
          async () => {
            await smt.generateProof(2n)
          },
          {
            beforeEach: async () => {
              smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 9)
              const size = 100
              for (let i = 0; i < size; i++) {
                await smt.add(BigInt(i + 1), BigInt(i + 1))
              }
            }
          }
        )
        .add(
          "LeanIMT - Generate Merkle Proof 100 Members",
          () => {
            leanIMT.generateProof(1)
          },
          {
            beforeAll: () => {
              leanIMT = new LeanIMT(leanIMTHash)
              leanIMT.insertMany(
                Array.from({ length: 100 }, (_, i) => BigInt(i + 1))
              )
            }
          }
        )
        .add(
          "SMT - Generate Merkle Proof 500 Members",
          async () => {
            await smt.generateProof(2n)
          },
          {
            beforeEach: async () => {
              smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 11)
              const size = 500
              for (let i = 0; i < size; i++) {
                await smt.add(BigInt(i + 1), BigInt(i + 1))
              }
            }
          }
        )
        .add(
          "LeanIMT - Generate Merkle Proof 500 Members",
          () => {
            leanIMT.generateProof(1)
          },
          {
            beforeAll: () => {
              leanIMT = new LeanIMT(leanIMTHash)
              leanIMT.insertMany(
                Array.from({ length: 500 }, (_, i) => BigInt(i + 1))
              )
            }
          }
        )
        .add(
          "SMT - Generate Merkle Proof 1000 Members",
          async () => {
            await smt.generateProof(2n)
          },
          {
            beforeEach: async () => {
              smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 12)
              const size = 1000
              for (let i = 0; i < size; i++) {
                await smt.add(BigInt(i + 1), BigInt(i + 1))
              }
            }
          }
        )
        .add(
          "LeanIMT - Generate Merkle Proof 1000 Members",
          () => {
            leanIMT.generateProof(1)
          },
          {
            beforeAll: () => {
              leanIMT = new LeanIMT(leanIMTHash)
              leanIMT.insertMany(
                Array.from({ length: 1000 }, (_, i) => BigInt(i + 1))
              )
            }
          }
        )
        .add(
          "SMT - Generate Merkle Proof 2000 Members",
          async () => {
            await smt.generateProof(2n)
          },
          {
            beforeEach: async () => {
              smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 13)
              const size = 2000
              for (let i = 0; i < size; i++) {
                await smt.add(BigInt(i + 1), BigInt(i + 1))
              }
            }
          }
        )
        .add(
          "LeanIMT - Generate Merkle Proof 2000 Members",
          () => {
            leanIMT.generateProof(1)
          },
          {
            beforeAll: () => {
              leanIMT = new LeanIMT(leanIMTHash)
              leanIMT.insertMany(
                Array.from({ length: 2000 }, (_, i) => BigInt(i + 1))
              )
            }
          }
        )

      await bench.run()
      const table = bench.table((task: Task) => generateTable(task))
      addComparisonColumn(table, bench)
      setDataTabe(table)
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
                  "merkle-tree-benchmarks.md"
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
