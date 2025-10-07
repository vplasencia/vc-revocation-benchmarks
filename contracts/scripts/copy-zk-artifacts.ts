import { mkdirSync, copyFileSync } from "fs"

const args = process.argv.slice(2)

if (args.length < 1) {
  console.error("Expected at least one argument!")
  process.exit(1)
}

let numbers: number[] = []

console.log(args)

if (args.length === 1 && args[0].startsWith("[")) {
  // Handle list input like '[1,3,7,10]'
  try {
    // Safely parse JSON array (after ensuring format)
    numbers = JSON.parse(args[0])

    if (!Array.isArray(numbers) || numbers.some(isNaN)) {
      throw new Error("Invalid list format.")
    }
  } catch {
    console.error("Invalid list format. Use syntax like: '[1,3,7,10]'")
    process.exit(1)
  }
} else if (args.length === 2) {
  // Handle range input like 1 3
  const start = Number(args[0])
  const end = Number(args[1])

  if (isNaN(start) || isNaN(end)) {
    console.error("Both arguments must be numbers.")
    process.exit(1)
  }

  numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)
} else {
  console.error("Invalid arguments. Use either:")
  console.error("  1 3      # range")
  console.error("  '[1,3,7]'  # list")
  process.exit(1)
}

mkdirSync(`./zk-artifacts`, { recursive: true })

for (const i of numbers) {
  // Copy LeanIMT zk artifacts
  copyFileSync(
    `../circuits/build/leanimt-${i}/groth16/leanimt-${i}_js/leanimt-${i}.wasm`,
    `./zk-artifacts/leanimt-${i}.wasm`
  )
  copyFileSync(
    `../circuits/build/leanimt-${i}/groth16/leanimt-${i}_final.zkey`,
    `./zk-artifacts/leanimt-${i}.zkey`
  )
  copyFileSync(
    `../circuits/build/leanimt-${i}/groth16/verification_key.json`,
    `./zk-artifacts/leanimt-${i}.json`
  )

  // Copy SMT zk artifacts
  copyFileSync(
    `../circuits/build/smt-${i}/groth16/smt-${i}_js/smt-${i}.wasm`,
    `./zk-artifacts/smt-${i}.wasm`
  )
  copyFileSync(
    `../circuits/build/smt-${i}/groth16/smt-${i}_final.zkey`,
    `./zk-artifacts/smt-${i}.zkey`
  )
  copyFileSync(
    `../circuits/build/smt-${i}/groth16/verification_key.json`,
    `./zk-artifacts/smt-${i}.json`
  )
}
