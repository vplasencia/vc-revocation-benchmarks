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
