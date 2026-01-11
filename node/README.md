# Node.js Benchmarks

This project contains SMT and LeanIMT Node.js benchmarks.

## Install dependencies

```sh
yarn
```

## Generate Benchmarks

### Run SMT

Run SMT functions for a specific number of members already in the tree.

```sh
yarn smt
```

### Run LeanIMT

Run LeanIMT functions for a specific number of members already in the tree.

```sh
yarn leanimt
```

### Run SMT and LeanIMT

Compare SMT and LeanIMT functions for different numbers of tree members.

```sh
yarn bench:all
```

### Run Insert

Generate benchmarks for both the SMT and LeanIMT with different numbers of tree members for the insert function.

```sh
yarn insert
```

### Run Update

Generate benchmarks for both the SMT and LeanIMT with different numbers of tree members for the update function.

```sh
yarn update
```

### Run Generate Merkle Proof

Generate benchmarks for both the SMT and LeanIMT with different numbers of tree members for the generate merkle proof function.

```sh
yarn generate:merkle-proof
```

### Run Verify Merkle Proof

Generate benchmarks for both the SMT and LeanIMT with different numbers of tree members for the verify merkle proof function.

```sh
yarn verify:merkle-proof
```

### Run Generate ZK Proof of Membership

Generate benchmarks for both the SMT and LeanIMT with different numbers of tree members for the generate ZK proof of membership function.

```sh
yarn generate:zk-proof:membership
```

### Run Generate ZK Proof of Non-Membership

Generate benchmarks for the SMT with different numbers of tree members for the generate ZK proof of non-membership function.

```sh
yarn generate:zk-proof:non-membership
```

### Run Verify ZK Proof of Membership

Generate benchmarks for both the SMT and LeanIMT with different numbers of tree members for the verify ZK proof of membership function.

```sh
yarn verify:zk-proof:membership
```

### Run Verify ZK Proof of Non-Membership

Generate benchmarks for the SMT with different numbers of tree members for the verify ZK proof of non-membership function.

```sh
yarn verify:zk-proof:non-membership
```

### Run zk-artifact Size

Get zk-artifact Size (WASM, ZKEY and JSON) for both SMT and LeanIMT.

```sh
yarn zk-artifact-size
```

## Copy zk-artifacts

Copy the zk-artifacts into a `artifacts` folder in the project root. These artifacts are used to generate the ZK benchmarks.

```sh
yarn copy:artifacts <arg>
```

The argument represents the tree depths and can be provided as a list (e.g.: [1,3,7,10]) or a range (e.g.: 1 3).

## Generate Charts

Generate charts of the benchmarks. These are Python scripts. The data used to generate the charts are inside the `data` folder.

Go inside the `chart-scripts` folder.

### SMT and LeanIMT Node.js Insert

```bash
python3 insert-node-performance.py
```

### SMT and LeanIMT Node.js Functions

These functions are for a specific number of tree members.

```bash
python3 node-performance.py
```

### SMT and LeanIMT Recreate Tree Browser

```bash
python3 recreate-tree-browser-performance.py
```

## Code formatting

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

Or to automatically format the code:

```bash
yarn prettier:write
```
