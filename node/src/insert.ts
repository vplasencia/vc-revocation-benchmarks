import { Bench, Task } from "tinybench"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import { Merkletree, InMemoryDB, str2Bytes } from "@iden3/js-merkletree"
import { generateTable } from "utils/generate-table"
import { addComparisonColumn } from "utils/add-comparison-column"

/**
 * Depths per SMT tree size:
 * 128 members (2^7) - 9
 * 512 members (2^9) - 11
 * 1024 members (2^10) - 12
 * 2048 members (2^11) - 13
 */

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
