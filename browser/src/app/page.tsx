"use client"

import { useCallback, useState } from "react"
import { LeanIMT, LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import { groth16 } from "snarkjs"
// import { poseidon } from "@iden3/js-crypto"
import {
  Merkletree,
  str2Bytes,
  InMemoryDB,
  verifyProof,
  Proof
} from "@iden3/js-merkletree"
import { Identity } from "@semaphore-protocol/identity"
import prettyMilliseconds from "pretty-ms"
import { run } from "@/utils/run-function"
import InputNumber from "@/components/InputNumber"

const functions = [
  "Recreate Tree",
  "Generate Merkle Proof",
  "Verify Merkle Proof",
  "Generate ZK Proof",
  "Recreate + Generate MP + ZKP",
  "Insert member",
  "Update Member"
]

const getWasmPath = (tree: string, depth: number): string => {
  return `/zk-artifacts/${tree}-${depth}.wasm`
}

const getZkeyPath = (tree: string, depth: number): string => {
  return `/zk-artifacts/${tree}-${depth}.zkey`
}

export default function Home() {
  const [smtMaxLevels, setSMTMaxLevels] = useState<number>(20)
  const [smtLeaves, setSMTLeaves] = useState<number>(100)
  const [leanIMTLeaves, setLeanIMTLeaves] = useState<number>(100)
  const [smtTimes, setSMTTimes] = useState<number[]>([])
  const [leanIMTTimes, setLeanIMTTimes] = useState<number[]>([])

  const runSMTFunctions = useCallback(async () => {
    const timeValues = []

    const { commitment: commitment0 } = new Identity()

    const smt = new Merkletree(
      new InMemoryDB(str2Bytes("Tree")),
      true,
      smtMaxLevels
    )

    const members = Array.from({ length: smtLeaves - 1 }, (_, i) => ({
      key: BigInt(i + 1),
      value: BigInt(i + 1)
    }))

    members.push({ key: commitment0, value: commitment0 })

    const [, time0] = await run(async () => {
      for (let i = 0; i < members.length; i++) {
        await smt.add(members[i].key, members[i].value)
      }
    })
    timeValues.push(time0)
    setSMTTimes(timeValues.slice())

    const [proof, time1] = await run(
      async () => await smt.generateProof(commitment0)
    )

    timeValues.push(time1)

    setSMTTimes(timeValues.slice())

    const [, time2] = await run(
      async () =>
        await verifyProof(
          await smt.root(),
          proof.proof as Proof,
          commitment0,
          commitment0
        )
    )

    timeValues.push(time2)

    setSMTTimes(timeValues.slice())

    const smtCircomProof = await smt.generateCircomVerifierProof(
      BigInt(smtLeaves + 100),
      await smt.root()
    )

    const [, time3] = await run(
      async () =>
        await groth16.fullProve(
          {
            enabled: 1,
            fnc: 1, // 0 for membership proofs, 1 for non-membership proofs
            root: smtCircomProof.root.string(),
            siblings: smtCircomProof.siblings.map((s) => s.string()),
            oldKey: smtCircomProof.oldKey.string(),
            oldValue: smtCircomProof.oldValue.string(),
            isOld0: smtCircomProof.isOld0 ? 1 : 0,
            key: smtCircomProof.key.string(),
            value: smtCircomProof.value.string()
          },
          getWasmPath("smt", smtMaxLevels),
          getZkeyPath("smt", smtMaxLevels)
        )
    )

    timeValues.push(time3)

    setSMTTimes(timeValues.slice())

    timeValues.push(time0 + time1 + time3)

    setSMTTimes(timeValues.slice())

    const { commitment: commitment1 } = new Identity()

    const [, time4] = await run(
      async () => await smt.add(commitment1, commitment1)
    )

    timeValues.push(time4)

    setSMTTimes(timeValues.slice())

    const { commitment: commitment2 } = new Identity()

    const [, time5] = await run(
      async () => await smt.update(commitment0, commitment2)
    )

    timeValues.push(time5)

    setSMTTimes(timeValues.slice())
  }, [smtMaxLevels, smtLeaves])

  const runLeanIMTFunctions = useCallback(async () => {
    const timeValues = []

    const { commitment: commitment0 } = new Identity()

    const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])
    // const leanIMTHash = (a: bigint, b: bigint) => poseidon.hash([a, b])
    const leanIMT = new LeanIMT(leanIMTHash)

    const members = Array.from({ length: leanIMTLeaves - 1 }, (_, i) =>
      BigInt(i + 1)
    )

    members.push(commitment0)

    const [, time0] = await run(async () => await leanIMT.insertMany(members))

    timeValues.push(time0)

    setLeanIMTTimes(timeValues.slice())

    const [proof, time1] = await run(() =>
      leanIMT.generateProof(leanIMTLeaves - 1)
    )

    timeValues.push(time1)

    setLeanIMTTimes(timeValues.slice())

    const [, time2] = await run(() =>
      leanIMT.verifyProof(proof as LeanIMTMerkleProof)
    )

    timeValues.push(time2)

    setLeanIMTTimes(timeValues.slice())

    const leanIMTDepth = proof.siblings.length !== 0 ? proof.siblings.length : 1
    for (let i = 0; i < leanIMTDepth; i += 1) {
      if (proof.siblings[i] === undefined) {
        proof.siblings[i] = 0n
      }
    }

    const [, time3] = await run(
      async () =>
        await groth16.fullProve(
          {
            leaf: 2n,
            depth: leanIMTDepth,
            index: proof.index,
            siblings: proof.siblings
          },
          getWasmPath("leanimt", leanIMTDepth),
          getZkeyPath("leanimt", leanIMTDepth)
        )
    )

    timeValues.push(time3)

    setLeanIMTTimes(timeValues.slice())

    timeValues.push(time0 + time1 + time3)

    setLeanIMTTimes(timeValues.slice())

    const { commitment: commitment1 } = new Identity()

    const [, time4] = await run(() => leanIMT.insert(commitment1))

    timeValues.push(time4)

    setLeanIMTTimes(timeValues.slice())

    const { commitment: commitment2 } = new Identity()

    const [, time5] = await run(
      async () => await leanIMT.update(leanIMTLeaves - 1, commitment2)
    )

    timeValues.push(time5)

    setLeanIMTTimes(timeValues.slice())
  }, [leanIMTLeaves])

  return (
    <div className="flex flex-col my-10 mx-10">
      <div className="flex flex-wrap gap-y-20 justify-around w-full">
        {/* SMT */}
        <div className="flex flex-col gap-6 justify-end items-start">
          <div className="text-2xl font-bold">SMT</div>
          <div className="flex flex-col gap-4">
            <InputNumber
              title="Max Levels"
              defaultValue={20}
              onChange={setSMTMaxLevels}
            />
            <InputNumber
              title="Tree Leaves"
              defaultValue={100}
              onChange={setSMTLeaves}
            />
            <button
              onClick={runSMTFunctions}
              className="flex justify-center items-center cursor-pointer disabled:cursor-not-allowed space-x-3 font-medium rounded-md px-3 py-2 w-full bg-blue-200 hover:bg-blue-300 transition-colors duration-300 ease-in-out"
            >
              Run Functions
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              {functions.map((fn, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="flex gap-6 py-2">
                    <div className="flex font-semibold sm:w-96 md:w-72 w-40">
                      {fn.includes("Generate ZK Proof")
                        ? "Generate Non-Membership ZK Proof"
                        : fn}
                    </div>
                    <div className="font-normal">
                      {smtTimes[i]
                        ? `${prettyMilliseconds(smtTimes[i], { millisecondsDecimalDigits: 1 })}`
                        : "0ms"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* LeanIMT */}
        <div className="flex flex-col gap-6 justify-end items-start">
          <div className="text-2xl font-bold mb-14">LeanIMT</div>
          <div className="flex flex-col gap-4">
            <InputNumber
              title="Tree Leaves"
              defaultValue={100}
              onChange={setLeanIMTLeaves}
            />
            <button
              onClick={runLeanIMTFunctions}
              className="flex justify-center items-center cursor-pointer disabled:cursor-not-allowed space-x-3 font-medium rounded-md px-3 py-2 w-full bg-blue-200 hover:bg-blue-300 transition-colors duration-300 ease-in-out"
            >
              Run Functions
            </button>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              {functions.map((fn, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="flex gap-6 py-2">
                    <div className="flex font-semibold sm:w-96 md:w-72 w-40">
                      {fn.includes("Generate ZK Proof")
                        ? "Generate Membership ZK Proof"
                        : fn}
                    </div>
                    <div className="font-normal">
                      {leanIMTTimes[i]
                        ? `${prettyMilliseconds(leanIMTTimes[i], { millisecondsDecimalDigits: 1 })}`
                        : "0ms"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
