import { mkdirSync, writeFileSync } from "fs"
import { createCircuitCode, createInput } from "./utils/smt-generate-text"

async function main() {
  if (process.argv.length === 4) {
    const start = Number(process.argv[2])
    const end = Number(process.argv[3])

    for (let i = start; i <= end; i += 1) {
      mkdirSync(`./circuits/smt-${i}`, { recursive: true })
      writeFileSync(`circuits/smt-${i}/smt-${i}.circom`, createCircuitCode(i))
      writeFileSync(`circuits/smt-${i}/input.json`, await createInput(i))
    }
  } else {
    console.error("Expected one argument!")
    process.exit(1)
  }
}

main()
