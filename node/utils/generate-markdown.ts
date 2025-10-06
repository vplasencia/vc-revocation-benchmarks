import { getMarkdownTable } from "markdown-table-ts"
import { writeFileSync } from "fs"
import { resolve } from "path"

export function generateMarkdown(table: any, filename = "table.md"): void {
  const functions = Object.keys(table[0])
  const rows = table.map((obj: any) => functions.map((k) => String(obj[k])))
  const tableMarkdown = getMarkdownTable({
    table: {
      head: functions,
      body: rows
    }
  })

  // Resolve file path
  const filePath = resolve(process.cwd(), filename)

  // Always overwrite the file with new content
  const content = `# Generated Table\n\n${tableMarkdown}\n`
  writeFileSync(filePath, content, "utf-8")

  console.log(`✅ Markdown table written to ${filePath}`)
}
