import { getMarkdownTable } from "markdown-table-ts"

const downloadData = async (content: string, filename: string) => {
  const dataUri = `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`
  const link = document.createElement("a")
  link.href = dataUri
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function generateMarkdown(
  table: Record<string, string | number>[],
  filename = "table.md"
): Promise<void> {
  const functions = Object.keys(table[0])
  const rows = table.map((obj) => functions.map((k) => String(obj[k])))
  const tableMarkdown = getMarkdownTable({
    table: {
      head: functions,
      body: rows
    }
  })

  await downloadData(tableMarkdown, filename)
}
