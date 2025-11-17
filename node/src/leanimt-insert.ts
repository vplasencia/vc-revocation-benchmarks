import { Bench, Task } from "tinybench"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import { Merkletree } from "@iden3/js-merkletree"
import { generateTable } from "utils/generate-table"
import { generateMarkdownTable } from "utils/generate-markdown-table"

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
    iterations: 1,
    warmup: false
  })

  let leanIMT: LeanIMT

  const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

  let smt: Merkletree

  bench
    .add(
      "LeanIMT - Add Member 10 000 Members",
      () => {
        leanIMT.insert(20000n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 10000
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "LeanIMT - Add Member 100 000 Members",
      () => {
        leanIMT.insert(200000n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 100000
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "LeanIMT - Add Member 1 000 000 Members",
      () => {
        leanIMT.insert(2000000n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          const size = 1000000
          leanIMT.insertMany(
            Array.from({ length: size }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )

  await bench.run()

  const table = bench.table((task: Task) => generateTable(task))

  generateMarkdownTable(table, "leanimt-insert.md")

  console.table(table)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
