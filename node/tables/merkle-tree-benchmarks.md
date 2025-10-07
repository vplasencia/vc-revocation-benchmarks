# Generated Table

| Function                                     | ops/sec   | Average Time (ms) | Samples | Relative to SMT |
| -------------------------------------------- | --------- | ----------------- | ------- | --------------- |
| SMT - Add Member Empty Tree                  | 3,366     | 0.34426           | 30      |                 |
| LeanIMT - Add Member Empty Tree              | 2,513,820 | 0.00165           | 30      | 208.30 x faster |
| SMT - Add Member 128 Members                 | 435       | 2.42113           | 30      |                 |
| LeanIMT - Add Member 128 Members             | 7,302     | 0.13861           | 30      | 17.47 x faster  |
| SMT - Add Member 512 Members                 | 387       | 2.62288           | 30      |                 |
| LeanIMT - Add Member 512 Members             | 6,932     | 0.14595           | 30      | 17.97 x faster  |
| SMT - Add Member 1024 Members                | 366       | 2.73707           | 30      |                 |
| LeanIMT - Add Member 1024 Members            | 6,796     | 0.14754           | 30      | 18.55 x faster  |
| SMT - Add Member 2048 Members                | 345       | 2.89538           | 30      |                 |
| LeanIMT - Add Member 2048 Members            | 6,628     | 0.15277           | 30      | 18.95 x faster  |
| SMT - Update Member 128 Members              | 327       | 3.06070           | 30      |                 |
| LeanIMT - Update Member 128 Members          | 1,054     | 0.94916           | 30      | 3.22 x faster   |
| SMT - Update Member 512 Members              | 265       | 3.76558           | 30      |                 |
| LeanIMT - Update Member 512 Members          | 828       | 1.20842           | 30      | 3.12 x faster   |
| SMT - Update Member 1024 Members             | 235       | 4.46544           | 30      |                 |
| LeanIMT - Update Member 1024 Members         | 725       | 1.38404           | 30      | 3.23 x faster   |
| SMT - Update Member 2048 Members             | 222       | 4.49950           | 30      |                 |
| LeanIMT - Update Member 2048 Members         | 678       | 1.47554           | 30      | 3.05 x faster   |
| SMT - Generate Merkle Proof 128 Members      | 16,223    | 0.07312           | 30      |                 |
| LeanIMT - Generate Merkle Proof 128 Members  | 1,123,315 | 0.00714           | 30      | 10.25 x faster  |
| SMT - Generate Merkle Proof 512 Members      | 13,419    | 0.07671           | 30      |                 |
| LeanIMT - Generate Merkle Proof 512 Members  | 1,004,333 | 0.00260           | 30      | 29.52 x faster  |
| SMT - Generate Merkle Proof 1024 Members     | 12,903    | 0.07928           | 30      |                 |
| LeanIMT - Generate Merkle Proof 1024 Members | 791,014   | 0.00404           | 30      | 19.64 x faster  |
| SMT - Generate Merkle Proof 2048 Members     | 11,118    | 0.09352           | 30      |                 |
| LeanIMT - Generate Merkle Proof 2048 Members | 748,500   | 0.00355           | 30      | 26.31 x faster  |
| SMT - Verify Merkle Proof 128 Members        | 696       | 1.43778           | 30      |                 |
| LeanIMT - Verify Merkle Proof 128 Members    | 1,087     | 0.92139           | 30      | 1.56 x faster   |
| SMT - Verify Merkle Proof 512 Members        | 548       | 1.82381           | 30      |                 |
| LeanIMT - Verify Merkle Proof 512 Members    | 839       | 1.19283           | 30      | 1.53 x faster   |
| SMT - Verify Merkle Proof 1024 Members       | 500       | 1.99952           | 30      |                 |
| LeanIMT - Verify Merkle Proof 1024 Members   | 753       | 1.32906           | 30      | 1.50 x faster   |
| SMT - Verify Merkle Proof 2048 Members       | 465       | 2.15283           | 30      |                 |
| LeanIMT - Verify Merkle Proof 2048 Members   | 678       | 1.47573           | 30      | 1.46 x faster   |
| SMT - Generate ZK Proof 128 Members          | 4         | 253.52550         | 30      |                 |
| LeanIMT - Generate ZK Proof 128 Members      | 6         | 158.17217         | 30      | 1.60 x faster   |
| SMT - Generate ZK Proof 512 Members          | 2         | 445.78511         | 30      |                 |
| LeanIMT - Generate ZK Proof 512 Members      | 4         | 208.05113         | 30      | 2.14 x faster   |
| SMT - Generate ZK Proof 1024 Members         | 3         | 315.96780         | 30      |                 |
| LeanIMT - Generate ZK Proof 1024 Members     | 4         | 208.55884         | 30      | 1.52 x faster   |
| SMT - Generate ZK Proof 2048 Members         | 3         | 325.74629         | 30      |                 |
| LeanIMT - Generate ZK Proof 2048 Members     | 4         | 230.61795         | 30      | 1.41 x faster   |
| SMT - Verify ZK Proof 128 Members            | 112       | 8.90684           | 30      |                 |
| LeanIMT - Verify ZK Proof 128 Members        | 115       | 8.70690           | 30      | 1.02 x faster   |
| SMT - Verify ZK Proof 512 Members            | 113       | 8.81794           | 30      |                 |
| LeanIMT - Verify ZK Proof 512 Members        | 115       | 8.67331           | 30      | 1.02 x faster   |
| SMT - Verify ZK Proof 1024 Members           | 114       | 8.78042           | 30      |                 |
| LeanIMT - Verify ZK Proof 1024 Members       | 113       | 8.85046           | 30      | 1.01 x slower   |
| SMT - Verify ZK Proof 2048 Members           | 114       | 8.76490           | 30      |                 |
| LeanIMT - Verify ZK Proof 2048 Members       | 116       | 8.63375           | 30      | 1.02 x faster   |
