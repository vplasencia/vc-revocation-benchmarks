## Methods

| **Symbol** | **Meaning**                                                                              |
| :--------: | :--------------------------------------------------------------------------------------- |
|   **◯**    | Execution gas for this method does not include intrinsic gas overhead                    |
|   **△**    | Cost was non-zero but below the precision setting for the currency display (see options) |

|                        |     Min |     Max |     Avg | Calls | usd avg |
| :--------------------- | ------: | ------: | ------: | ----: | ------: |
| **LeanIMTBench**       |         |         |         |       |         |
|        *insert*        |  90,704 | 160,480 | 124,433 |    11 |       - |
|        *insertMany*    |       - |       - |  92,294 |     1 |       - |
|        *update*        |       - |       - |  55,228 |     1 |       - |
|        *verifyZkProof* |       - |       - | 224,844 |     2 |       - |
| **SMTBench**           |         |         |         |       |         |
|        *insert*        | 191,802 | 278,645 | 207,592 |    11 |       - |
|        *verifyZkProof* |       - |       - | 224,920 |     2 |       - |

## Deployments

|                     | Min | Max |       Avg | Block % | usd avg |
| :------------------ | --: | --: | --------: | ------: | ------: |
| **LeanIMTBench**    |   - |   - | 1,108,505 |   3.7 % |       - |
| **LeanIMTVerifier** |   - |   - |   350,296 |   1.2 % |       - |
| **PoseidonT3**      |   - |   - | 3,695,103 |  12.3 % |       - |
| **SMTBench**        |   - |   - |   436,824 |   1.5 % |       - |
| **SmtLib**          |   - |   - | 1,698,525 |   5.7 % |       - |
| **SMTVerifier**     |   - |   - |   349,864 |   1.2 % |       - |

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
