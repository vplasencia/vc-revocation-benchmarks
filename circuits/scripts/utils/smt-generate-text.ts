import { Merkletree, InMemoryDB, str2Bytes, Hash } from "@iden3/js-merkletree"

export function createCircuitCode(num: number) {
  return `pragma circom 2.1.5;\n\ninclude "smt/smtverifier.circom";\n\ncomponent main = SMTVerifier(${num});`
}

export async function createInput(maxDepth: number) {
  const numStr = (n: number) =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 8) + 1).join("")

  const tree = new Merkletree(new InMemoryDB(str2Bytes("Tree")), true, maxDepth)

  const commitment = BigInt(numStr(maxDepth - 1))

  await tree.add(commitment, 1n)

  const { proof } = await tree.generateProof(BigInt("9".repeat(maxDepth - 1)))

  let siblings = proof.toJSON().siblings

  for (let i = 0; i < maxDepth; i += 1) {
    if (siblings[i] === undefined) {
      siblings[i] = BigInt(0).toString()
    }
  }

  const input = {
    enabled: 0,
    fnc: 0,
    root: (await tree.root()).bigInt().toString(),
    siblings: siblings,
    oldKey: 0,
    oldValue: 0,
    isOld0: 0,
    key: commitment,
    value: 0
  }

  return JSON.stringify(input, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  )
}
