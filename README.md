# Pudgy Penguins Mass Airdrop Checker 🐧

$PUDGY.

- [x] EVM 
- [ ] Solana 

## Prerequisites

Before using the script, make sure you have the following:
- Bun installed on your machine. You can install Bun by following the instructions [here](https://bun.sh/docs/installation).

Check Bun installation : 
(don't forget to refresh your path or close your terminal)
```bash
bun --version
```

## Installation

To get started :

Navigate to the cloned directory:
```bash
cd pudgypenguins-mass-airdrop-checker
```

Install the necessary dependencies using Bun:
```bash
bun install viem
```


## Configuration

Go to the `src` directory and open `pk.json`.
Replace with your private keys you want to test, formatted as follows:
```json
["0xprivatekey1", "0xprivatekey2"]
```

> ⚠️ Keep the '0x' before each privatekey.

## Usage

To run the script, use the following command:
```bash
bun run src/index.ts
```
