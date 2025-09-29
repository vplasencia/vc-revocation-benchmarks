import { Bench } from "tinybench"
import { LeanIMT, type LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import {
  Merkletree,
  Proof,
  verifyProof,
  InMemoryDB,
  str2Bytes
} from "@iden3/js-merkletree"

const main = async () => {
  const bench = new Bench({
    name: "Merkle Tree Benchmarks",
    time: 0,
    iterations: 1
  })

  let leanIMT: LeanIMT

  let leanIMTProof: LeanIMTMerkleProof

  const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

  let smt: Merkletree

  let smtProof: Proof

  bench
    .add(
      "LeanIMT - Add Member 10 Members",
      () => {
        leanIMT.insert(200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          leanIMT.insertMany(
            Array.from({ length: 10 }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Add Member 10 Members",
      async () => {
        await smt.add(200n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Update Member 10 Members",
      () => {
        leanIMT.update(0, 200n)
      },
      {
        beforeEach: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          leanIMT.insertMany(
            Array.from({ length: 10 }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Update Member 10 Members",
      async () => {
        await smt.update(2n, 2n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Generate Proof 10 Members",
      () => {
        leanIMT.generateProof(0)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          leanIMT.insertMany(
            Array.from({ length: 10 }, (_, i) => BigInt(i + 1))
          )
        }
      }
    )
    .add(
      "SMT - Generate Proof",
      async () => {
        await smt.generateProof(2n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "LeanIMT - Verify Proof 10 Members",
      () => {
        leanIMT.verifyProof(leanIMTProof)
      },
      {
        beforeAll: () => {
          leanIMT = new LeanIMT(leanIMTHash)
          leanIMT.insertMany(
            Array.from({ length: 10 }, (_, i) => BigInt(i + 1))
          )
          leanIMTProof = leanIMT.generateProof(0)
        }
      }
    )
    .add(
      "SMT - Verify Proof",
      async () => {
        await verifyProof(await smt.root(), smtProof, 2n, 2n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 20)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtProof = (await smt.generateProof(2n)).proof
        }
      }
    )

  await bench.run()

  console.log(bench.results)
  console.table(bench.table())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
