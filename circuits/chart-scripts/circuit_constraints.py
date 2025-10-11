import matplotlib.pyplot as plt
from utils.read_json_data import read_json_data

data = read_json_data('./data/circuit-constraints.json')

# ----- Data -----
tree_depth = list(range(2, 33))
leanimt = data["leanimt"]
smt = data["smt"]

# ----- Derived metrics -----
diff = [b - a for a, b in zip(leanimt, smt)]               # SMT - LeanIMT
ratio = [b / a for a, b in zip(leanimt, smt)]              # SMT / LeanIMT

# ===== Chart 1: Absolute constraints (LeanIMT vs SMT) =====
plt.figure(figsize=(9, 5))
plt.plot(tree_depth, leanimt, marker='o', label="LeanIMT", color="#22c55e")
plt.plot(tree_depth, smt, marker='s', label="SMT", color="#3b82f6")
# Visualize the gap (defaults to a neutral fill color)
plt.fill_between(tree_depth, leanimt, smt, alpha=0.2, label="Difference")
plt.title("LeanIMT vs SMT: Number of Constraints Across Tree Depth")
plt.xlabel("Tree Depth")
plt.ylabel("Number of Constraints")
plt.legend()
plt.grid(True, linestyle="--", alpha=0.6)
# Save image (uncomment next line to save)
# plt.savefig("./chart-images/constraints_absolute.png", dpi=300, bbox_inches="tight")
plt.show()

# ===== Chart 2: Relative efficiency (ratio SMT / LeanIMT) =====
plt.figure(figsize=(9, 4.5))
plt.plot(tree_depth, ratio, marker='d', label="SMT / LeanIMT", color="#3b82f6")
plt.axhline(1.0, linestyle="--", alpha=0.7, color="#22c55e")  # reference line
plt.title("Relative Efficiency: Ratio of Constraints (SMT ÷ LeanIMT)")
plt.xlabel("Tree Depth")
plt.ylabel("Ratio (SMT ÷ LeanIMT)")
plt.legend()
plt.grid(True, linestyle="--", alpha=0.6)
# Save image (uncomment next line to save)
# plt.savefig("./chart-images/constraints_ratio.png", dpi=300, bbox_inches="tight")
plt.show()
