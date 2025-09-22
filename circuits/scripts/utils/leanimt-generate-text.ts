import { Identity } from "@semaphore-protocol/identity"
import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"

export function createCircuitCode(num: number) {
  return `pragma circom 2.1.5;\n\ninclude "binary-merkle-root.circom";\n\ncomponent main = BinaryMerkleRoot(${num});`
}

export function createInput(maxDepth: number) {
  const { commitment } = new Identity()

  const tree = new LeanIMT((a, b) => poseidon2([a, b]), [commitment, 1n])

  const { siblings: merkleProofSiblings, index: merkleProofIndex } =
    tree.generateProof(0)

  for (let i = 0; i < maxDepth; i += 1) {
    if (merkleProofSiblings[i] === undefined) {
      merkleProofSiblings[i] = BigInt(0)
    }
  }

  const input = {
    leaf: commitment,
    depth: merkleProofSiblings.length,
    index: merkleProofIndex,
    siblings: merkleProofSiblings
  }

  return JSON.stringify(input, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  )
}
