import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";
import { inspect } from "util";

// ── validation ────────────────────────────────────────────────────────────────

const privateKey = process.env.PRIVATE_KEY;
const recipient  = process.env.RECIPIENT_ADDRESS;
const amountIn   = process.env.AMOUNT_IN ?? "1.00";

if (!privateKey || !privateKey.startsWith("0x"))
  throw new Error("PRIVATE_KEY must be set and 0x-prefixed");
if (!recipient || !recipient.startsWith("0x"))
  throw new Error("RECIPIENT_ADDRESS must be set and 0x-prefixed");

// ── swap ──────────────────────────────────────────────────────────────────────

const kit = new AppKit();

const adapter = createViemAdapterFromPrivateKey({
  privateKey: privateKey as `0x${string}`,
});

// 1. Estimate first — never fly blind on real funds
const estimate = await kit.estimateSwap({
  from:      { adapter, chain: "Arc_Testnet" },
  tokenIn:   "USDC",
  tokenOut:  "EURC",
  amountIn,
  to: { recipientAddress: recipient as `0x${string}` },
});

console.log("=== Estimate ===");
console.log("Estimated EURC out:", estimate.estimatedOutput);
console.log("Fees:", estimate.fees);
console.log(
  "\nNote: swap will route through LiFi (or another Circle aggregator).",
  "By proceeding you accept the aggregator's terms of service."
);
console.log(
  "\n⚠  This is Arc Testnet. No real funds will move. Proceeding in 5 s…"
);
await new Promise((r) => setTimeout(r, 5_000));

// 2. Execute — recipient gets EURC at the address you specified
const result = await kit.swap({
  from:      { adapter, chain: "Arc_Testnet" },
  tokenIn:   "USDC",
  tokenOut:  "EURC",
  amountIn,
  to: { recipientAddress: recipient as `0x${string}` },
  slippageBps: 100,   // 1% — tighten or loosen as needed
});

// 3. Print the result
console.log("\n=== Swap Result ===");
console.log("Status:      ", result.progress.status);
console.log("USDC in:     ", result.amountIn);
console.log("EURC out:    ", result.amountOut);
console.log("Tx hash:     ", result.txHash);
console.log(
  "Explorer:    ",
  result.explorerUrl ??
    `https://explorer.testnet.arc.io/tx/${result.txHash}`
);
console.log("\nFull result:\n", inspect(result, false, null, true));