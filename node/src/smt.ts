import { Bench } from "tinybench"
import {
  Merkletree,
  Proof,
  verifyProof,
  InMemoryDB,
  str2Bytes
} from "@iden3/js-merkletree"

const main = async () => {
  const bench = new Bench({
    name: "Revocation Merkle Tree Benchmarks",
    time: 0,
    iterations: 100,
    warmup: false
  })

  let smt: Merkletree

  let smtProof: Proof

  bench
    .add(
      "SMT - Insert",
      async () => {
        await smt.add(200n, 200n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 140)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
        }
      }
    )
    .add(
      "SMT - Update",
      async () => {
        await smt.update(2n, 2n)
      },
      {
        beforeEach: async () => {
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 140)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
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
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 140)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
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
          smt = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, 140)
          const size = 10
          for (let i = 0; i < size; i++) {
            await smt.add(BigInt(i + 1), BigInt(i + 1))
          }
          smtProof = (await smt.generateProof(2n)).proof
        }
      }
    )

  await bench.run()

  console.log(bench.name)
  console.table(bench.table())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
