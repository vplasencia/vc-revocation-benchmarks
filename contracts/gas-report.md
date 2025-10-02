## Methods

| **Symbol** | **Meaning**                                                                              |
| :--------: | :--------------------------------------------------------------------------------------- |
|   **◯**    | Execution gas for this method does not include intrinsic gas overhead                    |
|   **△**    | Cost was non-zero but below the precision setting for the currency display (see options) |

|                     | Min | Max |     Avg | Calls | usd avg |
| :------------------ | --: | --: | ------: | ----: | ------: |
| **LeanIMTBench**    |     |     |         |       |         |
|        *insert*     |   - |   - |  90,660 |     1 |       - |
|        *insertMany* |   - |   - |  92,250 |     1 |       - |
|        *update*     |   - |   - |  55,183 |     1 |       - |
| **SMTBench**        |     |     |         |       |         |
|        *insert*     |   - |   - | 278,645 |     1 |       - |

## Deployments

|                  | Min | Max |       Avg | Block % | usd avg |
| :--------------- | --: | --: | --------: | ------: | ------: |
| **LeanIMTBench** |   - |   - |   935,033 |   3.1 % |       - |
| **PoseidonT3**   |   - |   - | 3,695,103 |  12.3 % |       - |
| **SMTBench**     |   - |   - |   256,732 |   0.9 % |       - |
| **SmtLib**       |   - |   - | 1,698,513 |   5.7 % |       - |

## Solidity and Network Config

| **Settings**        | **Value**  |
| ------------------- | ---------- |
| Solidity: version   | 0.8.28     |
| Solidity: optimized | true       |
| Solidity: runs      | 200        |
| Solidity: viaIR     | false      |
| Block Limit         | 30,000,000 |
| Gas Price           | -          |
| Token Price         | -          |
| Network             | ETHEREUM   |
| Toolchain           | hardhat    |
