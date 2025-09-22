import { mkdirSync, writeFileSync } from "fs"
import { createCircuitCode, createInput } from "./utils/leanimt-generate-text"

if (process.argv.length === 4) {
  const start = Number(process.argv[2])
  const end = Number(process.argv[3])

  for (let i = start; i <= end; i += 1) {
    mkdirSync(`./circuits/leanimt-${i}`, { recursive: true })
    writeFileSync(
      `circuits/leanimt-${i}/leanimt-${i}.circom`,
      createCircuitCode(i)
    )
    writeFileSync(`circuits/leanimt-${i}/input.json`, createInput(i))
  }
} else {
  console.error("Expected one argument!")
  process.exit(1)
}
