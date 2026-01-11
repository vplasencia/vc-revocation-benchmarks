# Circom Benchmarks

This project contains SMT and LeanIMT Circom benchmarks.

## Install Dependencies

```sh
yarn
```

## Compile Circuit

Compile the circuit selected as default.

```sh
yarn compile
```

## Compile SMT Circuit

```sh
yarn compile:smt
```

## Compile LeanIMT Circuit

```sh
yarn compile:leanimt
```

## Remove Build Folder

```sh
yarn remove:build
```

## Remove Circuits Folder

```sh
yarn remove:circuits
```

## Create LeanIMT Circuits

Dynamically create the LeanIMT circuits for tree depths from start to end.

```sh
yarn create:leanimt-files <start> <end>
```

<start>: First tree depth value in the range
<end>: Last tree depth value in the range

## Create SMT Circuits

Dynamically create the SMT circuits for tree depths from start to end.

```sh
yarn create:smt-files <start> <end>
```

<start>: First tree depth value in the range
<end>: Last tree depth value in the range

## Run Groth16

Run Groth16 for default circuit.

```sh
yarn run:groth16
```

## Execute All

Remove circuit and build folders, dynamically generate circuits for all tree depths, and execute Groth16 for each of them.

```sh
yarn execute:all
```

## Generate Charts

Generate charts of the benchmarks. These are Python scripts. The data used to generate the charts are inside the `data` folder.

Go inside the `chart-scripts` folder.

### Circuit Constraints

```bash
python3 circuit_constraints.py
```

## Code Formatting

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

Or to automatically format the code:

```bash
yarn prettier:write
```
