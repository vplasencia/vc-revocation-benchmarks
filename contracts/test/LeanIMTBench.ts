import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import {
  time,
  loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { expect } from "chai"
import hre from "hardhat"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"

describe("LeanIMTBench", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLeanIMTBenchFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners()

    // PoseidonT3 is for arity 2
    const Poseidon = await hre.ethers.getContractFactory("PoseidonT3")
    const poseidon = await Poseidon.deploy()
    const poseidonAddress = await poseidon.getAddress()

    const LeanIMTBench = await hre.ethers.getContractFactory("LeanIMTBench", {
      libraries: {
        ["PoseidonT3"]: poseidonAddress
      }
    })
    const leanIMTBench = await LeanIMTBench.deploy()

    return { leanIMTBench, owner, otherAccount }
  }

  let jsLeanIMT: LeanIMT
  beforeEach(async () => {
    jsLeanIMT = new LeanIMT((a, b) => poseidon2([a, b]))
  })

  describe("LeanIMTBench", function () {
    describe("Insert", function () {
      it("Insert an element in the tree", async function () {
        const { leanIMTBench } = await loadFixture(deployLeanIMTBenchFixture)

        jsLeanIMT.insert(BigInt(1))

        await leanIMTBench.insert(1)

        const root = await leanIMTBench.root()

        await expect(root).to.equal(jsLeanIMT.root)
      })
    })

    describe("Update", function () {
      it("Update an element in the tree", async function () {
        const { leanIMTBench } = await loadFixture(deployLeanIMTBenchFixture)

        await leanIMTBench.insertMany([1])

        jsLeanIMT.insert(BigInt(1))
        jsLeanIMT.update(0, BigInt(2))

        const { siblings } = jsLeanIMT.generateProof(0)

        await leanIMTBench.update(1, 2, siblings)

        const root = await leanIMTBench.root()

        expect(root).to.equal(jsLeanIMT.root)
      })
    })
  })
})
