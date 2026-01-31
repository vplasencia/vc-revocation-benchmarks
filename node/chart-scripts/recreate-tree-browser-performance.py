import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from utils.read_json_data import read_json_data

data = read_json_data('../data/recreate-tree-browser.json')

# ----- Data -----
leaves = [128, 512, 1024, 2048]
leanimt = data["leanimt"]
smt = data["smt"]
leaves_revocation = ["10K", "100K", "1M"]
leanimt_revocation = data["leanimt-revocation"]

plt.figure(figsize=(9, 5))

plt.plot(leaves, leanimt, marker='o', label="LeanIMT", color="#22c55e")
plt.plot(leaves, smt, marker='s', label="SMT", color="#3b82f6")

# Add horizontal threshold lines
for leaf, y in zip(leaves_revocation, leanimt_revocation):
    plt.axhline(y=y, linestyle='--', alpha=0.7, color="#9333ea")
    plt.text(
        x=max(leaves) * 1.05,
        y=y,
        s=f"{leaf} leaves",
        va='center',
        fontsize=8,
        color="#9333ea"
    )

# Create a custom line for the legend
legend_line = Line2D([0], [0], color="#9333ea", linestyle='--')

plt.yscale('log')
plt.title("LeanIMT vs SMT: Recreate Tree Browser")
plt.xlabel("Leaves")
plt.ylabel("Time (ms)")
plt.legend(handles=[plt.Line2D([], [], color="#22c55e", marker='o', label="LeanIMT"),
                    plt.Line2D([], [], color="#3b82f6", marker='s', label="SMT"),
                    legend_line], labels=["LeanIMT", "SMT", "LeanIMT (Revocation)"])

plt.grid(True, linestyle="--", alpha=0.6)
# Save image (uncomment next line to save)
plt.savefig("../chart-images/recreate-tree-browser.png", dpi=300, bbox_inches="tight")
plt.show()

