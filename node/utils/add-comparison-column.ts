import { Bench } from "tinybench"

/**
 * Adds a comparison column to the benchmark results table, comparing LeanIMT performance to SMT.
 * @param table - The benchmark results table to modify.
 * @param bench - The benchmark instance containing the tasks and their results.
 */
export function addComparisonColumn(
  table: Array<Record<string, string | number | undefined> | null>,
  bench: Bench
): void {
  table.map((rowInfo, i) => {
    if (rowInfo && !(rowInfo["Function"] as string).includes("LeanIMT")) {
      rowInfo["Relative to SMT"] = ""
    } else if (rowInfo) {
      const smtAvgExecTime = bench.tasks[i - 1].result?.latency.mean

      const leanIMTAvgExecTime = bench.tasks[i]!.result?.latency.mean

      if (smtAvgExecTime === undefined || leanIMTAvgExecTime === undefined)
        return

      if (smtAvgExecTime > leanIMTAvgExecTime) {
        rowInfo["Relative to SMT"] =
          `${(smtAvgExecTime / leanIMTAvgExecTime).toFixed(2)} x faster`
      } else {
        rowInfo["Relative to SMT"] =
          `${(leanIMTAvgExecTime / smtAvgExecTime).toFixed(2)} x slower`
      }
    }
  })
}
