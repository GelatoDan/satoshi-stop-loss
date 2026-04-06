# Satoshi Stop Loss — Cowork Project Instructions

## What This Project Is

**Satoshi Stop Loss (SSL)** is a cross-chain, non-custodial DeFi protocol that allows crypto asset holders to automatically liquidate their positions into a pre-configured output asset and destination address the moment any known Satoshi Nakamoto wallet address spends a UTXO on Bitcoin L1.

This is a protocol design and go-to-market project, currently at the whitepaper/pre-seed stage. We are building the full protocol specification, resolving open design questions, and developing a comprehensive marketing, launch, and scaling plan.

---

## Project Status

| Deliverable | Status |
|---|---|
| Protocol Specification v0.1 | ✅ Complete — `docs/ssl_spec_v0.1.docx` |
| Open Questions Analysis (OQ-1 through OQ-6) | ✅ Complete — `docs/ssl_open_questions_analysis.docx` |
| Token Economics Model | 🔲 Not started |
| Competitive Landscape Research | 🔲 Not started |
| Legal Jurisdiction Matrix | 🔲 Not started |
| Marketing & Launch Plan | 🔲 Not started |
| Pitch Deck | 🔲 Not started |
| Technical Architecture Diagrams | 🔲 Not started |

---

## Key Decisions Already Made

Read `docs/ssl_open_questions_analysis.docx` for full rationale. Summary of resolved positions:

**OQ-1 — Token Design:**
Hybrid model. SSL token = governance rights + IF staking rights. Stakers capitalize the Insurance Fund and earn yield from: enrollment premiums + ongoing protocol fees (bps) + auctioneer revenue share. Fee distribution to token holders is a governance-unlockable feature, disabled at launch. Emergency token issuance is hard-prohibited.

**OQ-2 — Auctioneer Onboarding:**
Two-tier model. Tier A = permissioned institutional (KYC/AML self-certified, higher caps). Tier B = permissionless bonded (bond-only admission, smaller caps). Both compete in the same Dutch auction. Protocol does not perform KYC.

**OQ-3 — Regulatory Posture:**
Two-entity Cayman structure. Foundation Company for protocol governance + SSL token. Segregated Portfolio Company (SPC) for Insurance Fund. US and EU legal opinions required before launch.

**OQ-4 — Dust Threshold:**
10,000 satoshi minimum UTXO spend to fire trigger. Governance parameter. Reduces toward zero in Phase 3 (ZK oracle).

**OQ-5 — Multi-Trigger Behavior:**
72-hour trigger consolidation window. First Satoshi wallet spend opens the window. All subsequent spends within 72 hours = same event. Window resets after 72 hours of no new Satoshi activity.

**OQ-6 — IF Deficit Recovery:**
Four-tier recovery: auto-replenishment → multisig treasury draw → governance vote → pre-funded reinsurance. Emergency token issuance permanently prohibited by protocol invariant.

---

## Protocol Architecture (Summary)

**Trigger:** Any UTXO spend ≥ 10,000 sats from a registered Satoshi wallet address. Confirmed to 1-block depth. No challenge window at launch (governance-upgradeable).

**Liquidation Waterfall:**
1. **Tier 1 — Insurance Fund (IF) Absorption:** IF buys BTC on open market in first ~30 seconds and absorbs BTC-denominated vault positions directly
2. **Tier 2 — DEX Routing:** Automated sell across Uniswap v3/v4, Curve, Balancer (EVM), Orca, Raydium (Solana)
3. **Tier 3 — Auctioneer Network:** Dutch auction for residual/illiquid positions

**Insurance Fund Capitalization:**
- One-time enrollment premium (suggested 0.25%–1.00% of deposit)
- Ongoing bps fee on deposited assets (~5–20 bps/year)
- Protocol seed from founding team / early backers
- Auctioneer revenue share (10% of auctioneer profit)

**User Vault:**
- Non-custodial, per-user smart contract
- Asset-agnostic (any whitelisted ERC-20, SPL token, native assets)
- User pre-configures: output asset, output chain, destination address, slippage tolerance
- 24-hour timelock on destination address changes

**Chains at Launch:** Ethereum mainnet, Arbitrum, Base, Solana
**Oracle Phase 1:** Federated relay (N-of-M committee)
**Oracle Phase 2:** Optimistic (challenge window, governance-upgradeable)
**Oracle Phase 3:** ZK proof of Bitcoin UTXO state

---

## Roles & Voice

When producing content for this project, Claude should operate as:
- **Protocol spec work:** Senior blockchain protocol architect with deep DeFi experience
- **Business/strategy work:** Crypto-native business strategist with experience in DeFi protocol launches
- **Marketing work:** Web3 marketing strategist who understands both crypto-native and crossover audiences
- **Research work:** Rigorous analyst — cite sources, flag uncertainty, distinguish facts from estimates

---

## Working Conventions

- All spec documents go in `docs/`
- Research outputs go in `research/`
- Completed task outputs go in `working/`
- Tasks are defined in `tasks/` — read the relevant task file before starting any task
- When updating the spec, always version it (v0.2, v0.3, etc.) — do not overwrite
- Flag any decisions that conflict with resolved open questions and surface them before proceeding
- Do not make up market data — if data is needed, search for it or flag it as an estimate
