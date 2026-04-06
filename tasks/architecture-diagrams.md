# Task: Technical Architecture Diagrams — NPut Foundation

## Context

The NPut Foundation (Nakamoto Put) has a two-part mission:

1. **Protect BTC hodlers** from the quantum computing threat to Bitcoin's ECDSA encryption via event-driven insurance, until the ecosystem completes its transition to quantum-resistant cryptography.
2. **Drive the migration** — use premium incentives, tooling, and coordination to move the migratable portion of the ecosystem to quantum-resistant wallet formats before a quantum attack becomes viable.

The first product is an event-driven insurance policy for BTC hodlers. The triggering infrastructure is a purpose-built oracle network that monitors Bitcoin L1 for quantum-relevant events (starting with Satoshi wallet UTXO spends, the most visible P2PK exposure). This oracle infrastructure is genuinely novel technology — the first event-driven L1 monitoring layer designed around cryptographic threat detection rather than price feeds.

The Satoshi coins (~1.1M BTC, permanently in P2PK format) can never be migrated — they are the permanent exposure that justifies the "Nakamoto Put" name. All other quantum-vulnerable BTC *can* be migrated, and NPut is positioned to be the coordinating force that drives that migration.

## Output

Save diagrams to `working/nput-architecture-diagrams-[date].pptx`
One diagram per slide so each can be exported individually as a standalone asset.

## Design Requirements

- Color scheme: dark navy `#1A1A2E` background, Bitcoin orange `#F7931A` primary accent, white text
- Consistent iconography: same visual treatment for "user vault", "oracle node", "smart contract", "Bitcoin L1" across all diagrams
- Clean and minimal — readable at full-screen and when printed at A4
- Each diagram should stand alone with a clear title and brief subtitle

---

## Diagrams Required

### Diagram 1: Quantum Threat Landscape

**Purpose:** Establish the problem scale before showing the solution.

Show the three-tier vulnerability map of all Bitcoin supply:

- **Tier 1 — Permanently Vulnerable (~2–4M BTC):** P2PK coins. Public key permanently on-chain. Cannot be migrated. Satoshi's ~1.1M BTC is the largest block. Early miner P2PK coins also here.
- **Tier 2 — Conditionally Vulnerable (~25–37% of supply):** P2PKH / SegWit addresses that have previously sent a transaction. Public key was revealed in the spending input. Can be migrated to quantum-resistant format — but only if the owner acts before a quantum computer is powerful enough.
- **Tier 3 — Currently Safe:** Unspent P2PKH / SegWit / Taproot addresses where the public key has never been revealed. Safe until quantum computers advance further (longer timeline, requires breaking hash preimage resistance, not just ECDSA).

Annotate: Satoshi's coins are the single largest permanently-exposed block. They are the primary oracle target and the permanent insurance exposure.

Style: layered funnel or nested circles showing scale. Bitcoin orange for Tier 1 (highest risk), amber for Tier 2, muted for Tier 3.

---

### Diagram 2: NPut System Overview

**Purpose:** Show all major components of the protocol and how they connect.

Components to include:
- **Bitcoin L1** — source of truth. Satoshi wallet addresses monitored continuously.
- **Oracle Layer** — purpose-built watcher network. Detects UTXO spends from known P2PK addresses. Produces signed trigger attestations. (Phase 1: federated committee; see Diagram 6 for evolution roadmap.)
- **Trigger Contract** — receives oracle attestation, validates quorum, broadcasts trigger event cross-chain.
- **NPut Insurance Fund** — protocol-controlled reserve. Deploys capital on trigger to buy BTC and provide price support.
- **User Vaults** — non-custodial, per-user, per-chain. Locked at trigger. Pre-configured with output asset, destination chain, destination address.
- **Liquidation Engine** — 3-tier waterfall: IF absorption → DEX routing → Auctioneer Dutch auction.
- **Migration Module** *(future)* — tooling layer that detects user's vulnerable addresses and guides migration to quantum-resistant format. Feeds premium discount mechanism.
- **Cross-chain messaging** — propagates trigger from primary oracle chain to all deployed chains simultaneously.

Style: network graph, clean nodes and directed edges. Bitcoin L1 at top, user vaults at bottom, oracle and IF in the middle layer.

---

### Diagram 3: Trigger Flow (Sequence Diagram)

**Purpose:** Step-by-step from UTXO spend detection to user vault settlement.

Steps:
1. Satoshi wallet spends UTXO on Bitcoin L1
2. Oracle watcher nodes detect the spend (within 1 Bitcoin block, ~10 min)
3. N-of-M committee signs trigger attestation
4. Attestation submitted to Trigger Contract on primary chain
5. Cross-chain messaging broadcasts trigger to all deployed chains simultaneously
6. User vault contracts lock (withdrawals suspended)
7. Insurance Fund begins deployment: buys BTC to provide price support (30-second window)
8. Tier 1: IF absorbs enrolled positions up to capacity
9. Tier 2: DEX routing executes remaining positions via integrated venues
10. Tier 3: Auctioneer Dutch auction clears residual
11. Proceeds delivered to user-configured destination address on configured output chain

Style: vertical swimlane diagram. Lanes: Bitcoin L1 | Oracle Network | Protocol Contracts | Insurance Fund | User.

---

### Diagram 4: Liquidation Waterfall

**Purpose:** Show how positions flow through the three-tier liquidation system on trigger.

Tiers:
- **Tier 0 — Committed Liquidity Network (CLN):** Exchange partners with pre-committed buy orders, bonded capital. Must execute within 5 minutes of trigger or bond slashed. Provides the fastest, most reliable exit for large positions.
- **Tier 1 — Insurance Fund:** Protocol-controlled reserve. Direct BTC absorption. Immediately available. Capacity-constrained.
- **Tier 2 — DEX Routing:** Automated routing across integrated DEXes (Uniswap, Curve, Jupiter etc.). Unlimited capacity but subject to slippage.
- **Tier 3 — Auctioneer Network:** Dutch auction for residual positions. Permissionless participants. Longest timeline, worst price, but guaranteed clearance.

Show: the conditions that route a position to each tier (position size vs. IF capacity, DEX liquidity, time elapsed), and the 30-second IF window before handoff.

Style: funnel with conditions annotated on each transition arrow. Orange for Tier 0 (fastest/best), fading to muted for Tier 3 (slowest/worst).

---

### Diagram 5: Migration Flywheel

**Purpose:** Show how NPut drives the ecosystem migration to quantum-resistant wallets — not just insures against the risk.

The flywheel:
1. **Risk assessment:** NPut oracle monitors all P2PK and spent-P2PKH addresses. Publishes public quantum vulnerability index.
2. **Premium differentiation:** Quantum-vulnerable wallets pay higher insurance premiums. Quantum-resistant wallets get discounted premiums. Creates ongoing financial incentive to migrate.
3. **Migration tooling:** NPut provides one-click migration tool — detects vulnerable addresses in connected wallet, generates migration transaction to quantum-resistant format (post-quantum signature scheme per BIP-360 or equivalent).
4. **Insurance confirmation:** Migrated wallet receives lower-premium coverage. NPut confirms migration on-chain and reduces premium in next cycle.
5. **Network effect:** As more users migrate, the ecosystem's aggregate quantum risk falls. NPut's insurance book gets healthier. Premiums can fall further. Loop repeats.
6. **Coordination layer:** NPut Foundation advocates for BIP-360 / quantum-resistant Bitcoin upgrades. Funds developer grants. Coordinates exchange and wallet partners. The insurance business creates aligned incentives to fix the underlying problem.

Annotate: The Satoshi coins sit outside the flywheel — permanently unmigratable, permanently insured. They are the residual exposure that justifies the permanent Nakamoto Put product.

Style: circular flywheel with 5–6 nodes. Satoshi coins shown separately as the permanent anchor.

---

### Diagram 6: Oracle Phase Roadmap

**Purpose:** Show the three-phase evolution of the oracle architecture — from trusted federation to trustless ZK proof.

**Phase 1 — Federated Relay (Launch)**
- N-of-M committee of known, reputable node operators
- Watchers submit signed observations; threshold reached → trigger
- Trust model: honest majority assumption
- Monitoring scope: known Satoshi P2PK addresses (curated watchlist)
- Speed: ~1 Bitcoin block confirmation

**Phase 2 — Optimistic Oracle**
- Permissionless submission — anyone can submit a trigger attestation
- Challenge window: dispute period before trigger confirmed
- Bond required to submit; bond slashed if successfully challenged
- Trust model: economic security, honest majority of challengers
- Monitoring scope: expanded to all known P2PK addresses + anomalous ECDSA signature patterns

**Phase 3 — ZK Proof of Bitcoin UTXO State**
- Trustless: cryptographic proof of Bitcoin L1 state, no committee required
- ZK circuit proves a UTXO spend from a specified address occurred in a given block
- Trust model: cryptographic, no honest majority assumption
- Monitoring scope: full P2PK address set + quantum threat scoring inputs
- Enables: permissionless trigger submission with on-chain verifiable proof

Show: what changes phase-to-phase (trust model, monitoring scope, submission mechanism) vs. what stays the same (trigger contract interface, user vault behavior, liquidation waterfall).

Footnote: Phase 3 ZK infrastructure, combined with expanded monitoring scope, is the foundation for NPut's long-term role as a general-purpose event-driven L1 monitoring layer — not just for quantum, but for future threat vectors as they emerge.

Style: horizontal timeline with three labeled phases. Each phase shows a summary box: Trust Model / Monitoring Scope / Submission Mechanism. Arrows show what evolves.

---

## Notes for Implementation

- Use pptxgenjs. No external image assets — shapes, lines, and text only.
- Prioritize information density over decoration. These are technical reference diagrams.
- Maintain visual consistency with the pitch deck (navy `#1A1A2E`, orange `#F7931A`, Georgia titles, Calibri body).
- The Committed Liquidity Network (CLN) in Diagram 4 is a footnoted concept — show it in the waterfall but mark as "CLN / Tier 0 — see governance roadmap" to indicate it's a later-stage feature.
