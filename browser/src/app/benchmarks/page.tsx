"use client"

import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

import { useEffect, useState } from "react"
import { Bench, Task } from "tinybench"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import { Merkletree, str2Bytes, IndexedDBStorage } from "@iden3/js-merkletree"
import { ApexOptions } from "apexcharts"
import Table from "@/components/Table"
import { generateTable } from "@/utils/generate-table"
import { addComparisonColumn } from "@/utils/add-comparison-column"

export type ChartProps = {
  options: ApexOptions
  series: ApexAxisChartSeries
}

export default function Benchmarks() {
  const [insertConfig, setInsertConfig] = useState({
    options: {
      chart: {
        id: "line-insert"
      },
      xaxis: {
        categories: [1, 2, 3]
      }
    },
    series: [
      {
        name: "series-1",
        data: [1, 2, 3]
      }
    ]
  })
  const [tableInfo, setTableInfo] = useState([
    {
      Function: "-",
      "ops/sec": "-",
      "Average Time (ms)": "-",
      Samples: "-",
      "Relative to SMT": "-"
    }
  ])

  const generateBenchmarks = async () => {
    const bench = new Bench({
      name: "Merkle Tree Benchmarks",
      time: 0,
      iterations: 1
    })

    let leanIMT: LeanIMT

    const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

    let smt: Merkletree

    bench
      .add(
        "SMT - Add Member Empty Tree",
        async () => {
          await smt.add(200n, 200n)
        },
        {
          beforeEach: async () => {
            smt = new Merkletree(
              new IndexedDBStorage(str2Bytes("Tree")),
              true,
              10
            )
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
        "SMT - Add Member 100 Members",
        async () => {
          await smt.add(200n, 200n)
        },
        {
          beforeEach: async () => {
            smt = new Merkletree(
              new IndexedDBStorage(str2Bytes("Tree")),
              true,
              10
            )
            const size = 100
            for (let i = 0; i < size; i++) {
              await smt.add(BigInt(i + 1), BigInt(i + 1))
            }
          }
        }
      )
      .add(
        "LeanIMT - Add Member 100 Members",
        () => {
          leanIMT.insert(200n)
        },
        {
          beforeEach: () => {
            leanIMT = new LeanIMT(leanIMTHash)
            const size = 100
            leanIMT.insertMany(
              Array.from({ length: size }, (_, i) => BigInt(i + 1))
            )
          }
        }
      )
    // .add(
    //   "SMT - Add Member 500 Members",
    //   async () => {
    //     await smt.add(600n, 600n)
    //   },
    //   {
    //     beforeEach: async () => {
    //       smt = new Merkletree(
    //         new IndexedDBStorage(str2Bytes("Tree")),
    //         true,
    //         20
    //       )
    //       const size = 500
    //       for (let i = 0; i < size; i++) {
    //         await smt.add(BigInt(i + 1), BigInt(i + 1))
    //       }
    //     }
    //   }
    // )
    // .add(
    //   "LeanIMT - Add Member 500 Members",
    //   () => {
    //     leanIMT.insert(600n)
    //   },
    //   {
    //     beforeEach: () => {
    //       leanIMT = new LeanIMT(leanIMTHash)
    //       const size = 500
    //       leanIMT.insertMany(
    //         Array.from({ length: size }, (_, i) => BigInt(i + 1))
    //       )
    //     }
    //   }
    // )
    // .add(
    //   "SMT - Add Member 1000 Members",
    //   async () => {
    //     await smt.add(2000n, 2000n)
    //   },
    //   {
    //     beforeEach: async () => {
    //       smt = new Merkletree(
    //         new IndexedDBStorage(str2Bytes("Tree")),
    //         true,
    //         20
    //       )
    //       const size = 1000
    //       for (let i = 0; i < size; i++) {
    //         await smt.add(BigInt(i + 1), BigInt(i + 1))
    //       }
    //     }
    //   }
    // )
    // .add(
    //   "LeanIMT - Add Member 1000 Members",
    //   () => {
    //     leanIMT.insert(2000n)
    //   },
    //   {
    //     beforeEach: () => {
    //       leanIMT = new LeanIMT(leanIMTHash)
    //       const size = 1000
    //       leanIMT.insertMany(
    //         Array.from({ length: size }, (_, i) => BigInt(i + 1))
    //       )
    //     }
    //   }
    // )
    // .add(
    //   "SMT - Add Member 2000 Members",
    //   async () => {
    //     await smt.add(3000n, 3000n)
    //   },
    //   {
    //     beforeEach: async () => {
    //       smt = new Merkletree(
    //         new IndexedDBStorage(str2Bytes("Tree")),
    //         true,
    //         20
    //       )
    //       const size = 2000
    //       for (let i = 0; i < size; i++) {
    //         await smt.add(BigInt(i + 1), BigInt(i + 1))
    //       }
    //     }
    //   }
    // )
    // .add(
    //   "LeanIMT - Add Member 2000 Members",
    //   () => {
    //     leanIMT.insert(3000n)
    //   },
    //   {
    //     beforeEach: () => {
    //       leanIMT = new LeanIMT(leanIMTHash)
    //       const size = 2000
    //       leanIMT.insertMany(
    //         Array.from({ length: size }, (_, i) => BigInt(i + 1))
    //       )
    //     }
    //   }
    // )

    await bench.run()

    const table = bench.table((task: Task) => generateTable(task))

    // addComparisonColumn(table, bench)

    // console.log(bench.results)
    // console.table(table)
    setTableInfo(
      table
        .filter(
          (row): row is Record<string, string | number | undefined> =>
            row !== null
        )
        .map((row) => ({
          Function: String(row["Function"] ?? "-"),
          "ops/sec": String(row["ops/sec"] ?? "-"),
          "Average Time (ms)": String(row["Average Time (ms)"] ?? "-"),
          Samples: String(row["Samples"] ?? "-"),
          "Relative to SMT": String(row["Relative to SMT"] ?? "-")
        }))
    )
  }

  return (
    <div className="app">
      {/* <div className="w-90 h-auto">
        <div className="font-medium text-2xl">Insert members</div>
        <Chart
          options={insertConfig.options}
          series={insertConfig.series}
          type="line"
          width="800"
          height="500"
        />
      </div> */}
      <div>
        <Table data={tableInfo} />
      </div>
      {/* <div className="mt-10">
        <button onClick={downloadData}>Download Function Benchmarks</button>
      </div> */}
      <div className="mt-10">
        <button onClick={generateBenchmarks}>
          Generate Function Benchmarks
        </button>
      </div>
    </div>
  )
}
