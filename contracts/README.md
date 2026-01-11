# Solidity Benchmarks

This project contains SMT and LeanIMT Solidity benchmarks.

## Install Dependencies

```sh
yarn
```

## Compile Contracts

```sh
yarn compile
```

## Test Contracts

```sh
yarn test
```

## Generate Gas Report

This command will generate a `gas-report.md` file in the project root folder with the gas report.

```sh
yarn test:report-gas
```

## Copy ZK-Artifacts

Copy the zk-artifacts into a `zk-artifacts` folder in the project root. These artifacts are used to generate the ZK benchmarks.

```sh
yarn copy:artifacts <arg>
```

The argument represents the tree depths and can be provided as a list (e.g.: [1,3,7,10]) or a range (e.g.: 1 3).

## Code Formatting

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

Or to automatically format the code:

```bash

```
