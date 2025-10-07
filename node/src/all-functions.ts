import { Bench, Task } from "tinybench"
import { LeanIMT, type LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import {
  Merkletree,
  Proof,
  verifyProof,
  InMemoryDB,
  str2Bytes
} from "@iden3/js-merkletree"
import { generateTable } from "utils/generate-table"
import { addComparisonColumn } from "utils/add-comparison-column"
import { generateMarkdown } from "utils/generate-markdown"

const main = async () => {
  const bench = new Bench({
    name: "Merkle Tree Benchmarks",
    time: 0,
    iterations: 30,
    warmup: false
  })

  let leanIMT: LeanIMT

  let leanIMTProof: LeanIMTMerkleProof

  const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

  let smt: Merkletree

  let smtProof: Proof

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

  await bench.run()

  const table = bench.table((task: Task) => generateTable(task))
  addComparisonColumn(table, bench)
  console.table(table)
  generateMarkdown(table, "merkle-tree-benchmarks.md")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
