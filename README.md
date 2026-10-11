# arc-usdc-eurc-swap

A minimal USDC → EURC swap script built with [Circle App Kit](https://docs.arc.io/app-kit) on Arc Mainnet. Supports custom recipient addresses for output tokens.

Built as a working experiment for the Arc Builder Microgrants program.

## Mainnet transaction

https://explorer.arc.io/tx/0x4c98ca7c88821f6a0aaa2d50334a0b1f6e6a5a016782dd92d09b438efbf8e6f5

## What it does

- Connects to Arc Mainnet using a Viem private-key adapter
- Estimates the swap first (`kit.estimateSwap`), then executes it (`kit.swap`)
- Supports a custom recipient address so output EURC can be routed to any wallet, not just the sender
- Reads configuration from a `.env` file (`PRIVATE_KEY`, `RECIPIENT_ADDRESS`, `AMOUNT_IN`)
- Prints the transaction hash and Arc explorer URL on success

## Setup

1. Copy `.env.example` to `.env` and fill in your values:
   PRIVATE_KEY=0x...
   RECIPIENT_ADDRESS=0x...
   AMOUNT_IN=1.00

2. Install dependencies:
```bash
bun install

3. Run the swap:
bash
bun run src/swap.ts

Files: 
src/swap.ts — main swap script
.env.example — template for required environment variables
package.json — dependencies and scripts

Notes
The .env file is gitignored. Never commit real private keys.
