# Generated Table

| Function                          | ops/sec | Average Time (ms) | Samples | Relative to SMT |
| --------------------------------- | ------- | ----------------- | ------- | --------------- |
| SMT - Add Member Empty Tree       | 3,422   | 0.33399           | 10      |                 |
| LeanIMT - Add Member Empty Tree   | 869,818 | 0.00420           | 10      | 79.60 x faster  |
| SMT - Add Member 128 Members      | 519     | 1.92790           | 10      |                 |
| LeanIMT - Add Member 128 Members  | 7,518   | 0.13637           | 10      | 14.14 x faster  |
| SMT - Add Member 512 Members      | 437     | 2.28781           | 10      |                 |
| LeanIMT - Add Member 512 Members  | 7,459   | 0.13441           | 10      | 17.02 x faster  |
| SMT - Add Member 1024 Members     | 408     | 2.45399           | 10      |                 |
| LeanIMT - Add Member 1024 Members | 7,015   | 0.14363           | 10      | 17.09 x faster  |
| SMT - Add Member 2048 Members     | 376     | 2.66257           | 10      |                 |
| LeanIMT - Add Member 2048 Members | 7,186   | 0.13955           | 10      | 19.08 x faster  |
