import { Task } from "tinybench"

/**
 * Generates a table row for the given benchmark task.
 * @param task - The benchmark task to generate the table row for.
 * @returns An object representing a row in the benchmark results table.
 */
export function generateTable(task: Task): Record<string, string | number> {
  return {
    Function: task.name,
    "ops/sec":
      !task.result || task.result.error
        ? "NaN"
        : parseInt(task.result.throughput.mean.toString(), 10).toLocaleString(),
    "Average Time (ms)":
      !task.result || task.result.error
        ? "NaN"
        : task.result.latency.mean.toFixed(5),
    Samples:
      !task.result || task.result.error
        ? "NaN"
        : task.result.latency.samples.length
  }
}
