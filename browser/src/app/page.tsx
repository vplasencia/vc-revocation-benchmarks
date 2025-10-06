"use client"

import { useCallback, useState } from "react"
import { LeanIMT, LeanIMTMerkleProof } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
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
  "Generate Proof",
  "Verify Proof",
  "Insert member",
  "Update Member"
]

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
    for (let i = 0; i < smtLeaves - 1; i++) {
      await smt.add(BigInt(i + 1), BigInt(i + 1))
    }
    await smt.add(commitment0, commitment0)

    const [proof, time0] = await run(
      async () => await smt.generateProof(commitment0)
    )

    timeValues.push(time0)

    setSMTTimes(timeValues.slice())

    const [, time1] = await run(
      async () =>
        await verifyProof(
          await smt.root(),
          proof.proof as Proof,
          commitment0,
          commitment0
        )
    )

    timeValues.push(time1)

    setSMTTimes(timeValues.slice())

    const { commitment: commitment1 } = new Identity()

    const [, time2] = await run(
      async () => await smt.add(commitment1, commitment1)
    )

    timeValues.push(time2)

    setSMTTimes(timeValues.slice())

    const { commitment: commitment2 } = new Identity()

    const [, time3] = await run(
      async () => await smt.update(commitment0, commitment2)
    )

    timeValues.push(time3)

    setSMTTimes(timeValues.slice())
  }, [smtMaxLevels, smtLeaves])

  const runLeanIMTFunctions = useCallback(async () => {
    const timeValues = []

    const { commitment: commitment0 } = new Identity()

    const leanIMTHash = (a: bigint, b: bigint) => poseidon2([a, b])
    // const leanIMTHash = (a: bigint, b: bigint) => poseidon.hash([a, b])
    const leanIMT = new LeanIMT(leanIMTHash)
    leanIMT.insertMany(
      Array.from({ length: leanIMTLeaves - 1 }, (_, i) => BigInt(i + 1))
    )
    leanIMT.insert(commitment0)

    const [proof, time0] = await run(() =>
      leanIMT.generateProof(leanIMTLeaves - 1)
    )

    timeValues.push(time0)

    setLeanIMTTimes(timeValues.slice())

    const [, time1] = await run(() =>
      leanIMT.verifyProof(proof as LeanIMTMerkleProof)
    )

    timeValues.push(time1)

    setLeanIMTTimes(timeValues.slice())

    const { commitment: commitment1 } = new Identity()

    const [, time2] = await run(() => leanIMT.insert(commitment1))

    timeValues.push(time2)

    setLeanIMTTimes(timeValues.slice())

    const { commitment: commitment2 } = new Identity()

    const [, time3] = await run(
      async () => await leanIMT.update(leanIMTLeaves - 1, commitment2)
    )

    timeValues.push(time3)

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
                      {fn}
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
                      {fn}
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
