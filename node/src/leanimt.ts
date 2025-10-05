import { Bench } from "tinybench"
import { LeanIMT, type LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"

const main = async () => {
  const bench = new Bench({
    name: "Merkle Tree Benchmarks",
    time: 0,
    iterations: 100,
    warmup: false
  })

  let leanIMT: LeanIMT

  let leanIMTProof: LeanIMTMerkleProof

  const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])

  bench
    .add(
      "LeanIMT - Insert",
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
      "LeanIMT - Update",
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
      "LeanIMT - Generate Proof",
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
      "LeanIMT - Verify Proof",
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
