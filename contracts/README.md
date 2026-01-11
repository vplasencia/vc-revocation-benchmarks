# Solidity Benchmarks

This project contains SMT and LeanIMT Solidity benchmarks.

## Install dependencies

```sh
yarn
```

## Compile contracts

```sh
yarn compile
```

## Test contracts

```sh
yarn test
```

## Generate gas report

This command will generate a `gas-report.md` file in the project root folder with the gas report.

```sh
yarn test:report-gas
```

## Copy zk-artifacts

Copy the zk-artifacts into a `zk-artifacts` folder in the project root. These artifacts are used to generate the ZK benchmarks.

```sh
yarn copy:artifacts <arg>
```

The argument represents the tree depths and can be provided as a list (e.g.: [1,3,7,10]) or a range (e.g.: 1 3).

## Code formatting

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

Or to automatically format the code:

```bash

```
