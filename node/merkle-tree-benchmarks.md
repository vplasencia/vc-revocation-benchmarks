# Generated Table

| Function                                     | ops/sec | Average Time (ms) | Samples | Relative to SMT |
| -------------------------------------------- | ------- | ----------------- | ------- | --------------- |
| SMT - Add Member Empty Tree                  | 2,962   | 0.38131           | 10      |                 |
| LeanIMT - Add Member Empty Tree              | 824,753 | 0.00447           | 10      | 85.37 x faster  |
| SMT - Add Member 100 Members                 | 454     | 2.20285           | 10      |                 |
| LeanIMT - Add Member 100 Members             | 2,325   | 0.43310           | 10      | 5.09 x faster   |
| SMT - Add Member 500 Members                 | 366     | 2.83917           | 10      |                 |
| LeanIMT - Add Member 500 Members             | 1,193   | 0.84275           | 10      | 3.37 x faster   |
| SMT - Add Member 1000 Members                | 360     | 2.78011           | 10      |                 |
| LeanIMT - Add Member 1000 Members            | 1,186   | 0.84619           | 10      | 3.29 x faster   |
| SMT - Add Member 2000 Members                | 342     | 2.92003           | 10      |                 |
| LeanIMT - Add Member 2000 Members            | 1,228   | 0.81417           | 10      | 3.59 x faster   |
| SMT - Update Member 100 Members              | 318     | 3.14931           | 10      |                 |
| LeanIMT - Update Member 100 Members          | 1,013   | 0.98868           | 10      | 3.19 x faster   |
| SMT - Update Member 500 Members              | 227     | 5.01474           | 10      |                 |
| LeanIMT - Update Member 500 Members          | 808     | 1.23899           | 10      | 4.05 x faster   |
| SMT - Update Member 1000 Members             | 239     | 4.18078           | 10      |                 |
| LeanIMT - Update Member 1000 Members         | 730     | 1.37150           | 10      | 3.05 x faster   |
| SMT - Update Member 2000 Members             | 219     | 4.55982           | 10      |                 |
| LeanIMT - Update Member 2000 Members         | 660     | 1.51718           | 10      | 3.01 x faster   |
| SMT - Generate Merkle Proof 100 Members      | 9,230   | 0.25852           | 10      |                 |
| LeanIMT - Generate Merkle Proof 100 Members  | 553,144 | 0.04054           | 10      | 6.38 x faster   |
| SMT - Generate Merkle Proof 500 Members      | 7,734   | 0.13842           | 10      |                 |
| LeanIMT - Generate Merkle Proof 500 Members  | 749,000 | 0.01350           | 10      | 10.26 x faster  |
| SMT - Generate Merkle Proof 1000 Members     | 6,649   | 0.18567           | 10      |                 |
| LeanIMT - Generate Merkle Proof 1000 Members | 683,413 | 0.00880           | 10      | 21.11 x faster  |
| SMT - Generate Merkle Proof 2000 Members     | 5,797   | 0.20338           | 10      |                 |
| LeanIMT - Generate Merkle Proof 2000 Members | 520,933 | 0.00917           | 10      | 22.17 x faster  |
| SMT - Verify Merkle Proof 100 Members        | 635     | 1.57647           | 10      |                 |
| LeanIMT - Verify Merkle Proof 100 Members    | 1,055   | 0.94940           | 10      | 1.66 x faster   |
| SMT - Verify Merkle Proof 500 Members        | 524     | 1.91169           | 10      |                 |
| LeanIMT - Verify Merkle Proof 500 Members    | 806     | 1.24683           | 10      | 1.53 x faster   |
| SMT - Verify Merkle Proof 1000 Members       | 416     | 2.77703           | 10      |                 |
| LeanIMT - Verify Merkle Proof 1000 Members   | 710     | 1.41565           | 10      | 1.96 x faster   |
| SMT - Verify Merkle Proof 2000 Members       | 430     | 2.33474           | 10      |                 |
| LeanIMT - Verify Merkle Proof 2000 Members   | 670     | 1.49326           | 10      | 1.56 x faster   |
