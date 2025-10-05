import { Bench, Task } from "tinybench"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import { Merkletree, InMemoryDB, str2Bytes } from "@iden3/js-merkletree"
import { generateTable } from "utils/generate-table"
import { addComparisonColumn } from "utils/add-comparison-column"

const main = async () => {
  const bench = new Bench({
    name: "Merkle Tree Benchmarks",
    time: 0,
    iterations: 10,
    warmup: false
  })

  let leanIMT: LeanIMT

  const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

  let smt: Merkletree

  bench
    .add(
      "SMT - Update Member 100 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 100
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 100 Members",
      () => {
        leanIMT.update(1, 200n)
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
    .add(
      "SMT - Update Member 500 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 500
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 500 Members",
      () => {
        leanIMT.update(1, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 500
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Update Member 1000 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 1000
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 1000 Members",
      () => {
        leanIMT.update(1, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1000
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Update Member 2000 Members",
      async () => {
        await smt.update(1n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 2000
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 2000 Members",
      () => {
        leanIMT.update(1, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 2000
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
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
