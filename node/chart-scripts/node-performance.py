import matplotlib.pyplot as plt
from utils.read_json_data import read_json_data

# ===== Load data =====
data = read_json_data("./data/merkle-tree-benchmarks-1024.json")

# ===== Prepare lists =====
functions = [item["Function"] for item in data]
smt_times = [item["SMT (ms)"] for item in data]
leanimt_times = [item["LeanIMT (ms)"] for item in data]

# ===== Plot =====
plt.figure(figsize=(9, 5))
bar_width = 0.35
x = range(len(functions))

plt.bar(x, leanimt_times, width=bar_width, label="LeanIMT", color="#22c55e")
plt.bar([i + bar_width for i in x], smt_times, width=bar_width, label="SMT", color="#3b82f6")

# Logarithmic scale to show wide range of values
plt.yscale("log")

# Labels and styling
plt.xticks([i + bar_width / 2 for i in x], functions, rotation=25, ha="right")
plt.ylabel("Average Time (ms, log scale)")
plt.title("LeanIMT vs SMT: Node.js Performance (1024 Members)")
plt.legend()
plt.grid(axis="y", linestyle="--", alpha=0.6)

# Save image (optional)
# plt.savefig("./chart-images/nodejs-benchmark.png", dpi=300, bbox_inches="tight")

plt.tight_layout()
plt.show()
