| Function                                     | ops/sec | Average Time (ms) | Samples | Relative to SMT |
| -------------------------------------------- | ------- | ----------------- | ------- | --------------- |
| SMT - Add Member 1024 Members                | 374     | 2.67000           | 10      |                 |
| LeanIMT - Add Member 1024 Members            | 8,333   | 0.12000           | 10      | 22.25 x faster  |
| SMT - Generate Merkle Proof 1024 Members     | 6,788   | 0.17000           | 10      |                 |
| LeanIMT - Generate Merkle Proof 1024 Members | 28,166  | 0.03000           | 10      | 5.67 x faster   |
| SMT - Generate ZK Proof 1024 Members         | 2       | 455.68000         | 10      |                 |
| LeanIMT - Generate ZK Proof 1024 Members     | 3       | 299.77000         | 10      | 1.52 x faster   |
