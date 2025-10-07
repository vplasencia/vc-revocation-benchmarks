import { getMarkdownTable } from "markdown-table-ts"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { resolve } from "path"

export function generateMarkdownTable(table: any, filename = "table.md"): void {
  const functions = Object.keys(table[0])
  const rows = table.map((obj: any) => functions.map((k) => String(obj[k])))
  const tableMarkdown = getMarkdownTable({
    table: {
      head: functions,
      body: rows
    }
  })

  // Ensure the "tables" directory exists
  const tablesDir = resolve(process.cwd(), "tables")
  if (!existsSync(tablesDir)) {
    mkdirSync(tablesDir)
  }

  // Resolve file path inside "tables" folder
  const filePath = resolve(tablesDir, filename)

  // Always overwrite the file with new content
  const content = `# Generated Table\n\n${tableMarkdown}\n`
  writeFileSync(filePath, content, "utf-8")

  console.log(`✅ Markdown table written to ${filePath}`)
}
