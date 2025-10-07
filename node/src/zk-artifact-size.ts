import fs from "fs"
import { filesize } from "filesize"
import { generateMarkdownTable } from "utils/generate-markdown-table"

function getFileSizeSync(filePath: string): number {
  const stats = fs.statSync(filePath)
  return stats.size // size in bytes
}

const ARTIFACTS_DIR = "./artifacts"

const generateTable = () => {
  const data = []
  for (let i = 2; i < 33; i++) {
    data.push({
      Tree: "SMT",
      Depth: i,
      WASM: filesize(getFileSizeSync(`${ARTIFACTS_DIR}/smt-${i}.wasm`), {
        round: 1
      }),
      ZKEY: filesize(getFileSizeSync(`${ARTIFACTS_DIR}/smt-${i}.zkey`), {
        round: 1
      }),
      JSON: filesize(getFileSizeSync(`${ARTIFACTS_DIR}/smt-${i}.json`), {
        round: 1
      })
    })
    data.push({
      Tree: "LeanIMT",
      Depth: i,
      WASM: filesize(getFileSizeSync(`${ARTIFACTS_DIR}/leanimt-${i}.wasm`), {
        round: 1
      }),
      ZKEY: filesize(getFileSizeSync(`${ARTIFACTS_DIR}/leanimt-${i}.zkey`), {
        round: 1
      }),
      JSON: filesize(getFileSizeSync(`${ARTIFACTS_DIR}/leanimt-${i}.json`), {
        round: 1
      })
    })
  }
  return data
}

const main = async () => {
  const table = generateTable()

  console.table(table)
  generateMarkdownTable(table, "zk-artifact-size.md")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
