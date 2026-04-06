# Task: Update Protocol Specification — SSL v0.1 → NPut v0.2

## Context

The NPut Foundation overview document (`working/nput-foundation-overview-2026-04-06.docx`) has established a new strategic framing for the protocol. The existing spec (`docs/ssl_spec_v0.1.docx`) remains technically sound but requires substantial revision in its framing, naming, motivation, and governance sections. Core technical sections need minimal changes.

**Do not rewrite the technical design from scratch.** The liquidation waterfall, oracle architecture, user vault structure, cross-chain messaging, and Insurance Fund mechanics described in v0.1 are retained. The spec update is primarily a reframing, extension, and restructuring exercise.

## Output

`docs/nput_spec_v0.2.docx`

## Changes Required by Section

### Abstract (full rewrite)
Old: SSL provides automated stop-loss on Satoshi wallet movement.
New: NPut Foundation provides event-driven, on-chain insurance for BTC hodlers against the quantum computing threat to Bitcoin's ECDSA cryptography. The first product is the Nakamoto Put — an automated liquidation policy triggered by Satoshi wallet UTXO detection on Bitcoin L1. The broader Foundation mission is to protect hodlers during the transition and drive the ecosystem migration to quantum-resistant wallet formats.

### Section 1: Motivation (significant rewrite)
- Replace "1.1 The Satoshi Risk" with "1.1 The Quantum Threat to Bitcoin" (keep Satoshi content, but frame it as *part of* the quantum threat, not the entire threat)
- Add new subsection: "1.2 The Three-Tier Vulnerability Landscape" (P2PK permanently vulnerable / spent-P2PKH conditionally vulnerable / unspent addresses currently safe)
- Add new subsection: "1.3 Why Satoshi's Wallets Are the Primary Trigger" (permanent P2PK exposure, scale of market impact, unmigratable)
- Rename "1.2 Protocol Thesis" to "1.4 Foundation Thesis" — update to reflect two-part mission (protect + migrate)

### Section 2: Protocol Overview (light edits)
- Rename "Satoshi Stop Loss" → "NPut / Nakamoto Put" throughout
- Add "Migration Module" as a fifth subsystem (alongside Oracle, IF, Liquidation Engine, User Vault):
  - Function: Detects quantum-vulnerable addresses in user portfolio; guides migration to quantum-resistant format; validates migration on-chain; adjusts premium tier post-migration
  - Implementation Layer: Off-chain tooling + on-chain attestation
- Update the high-level architecture table to include the Migration Module

### Section 3: Oracle Architecture (light edits + expansion)
- Add framing: "The oracle is not a price feed — it is an event-driven L1 monitoring layer, the first designed around cryptographic threat detection rather than application-layer events."
- Add Phase 2 monitoring scope: anomalous ECDSA signature patterns
- Add Phase 3 monitoring scope: full P2PK address set + quantum threat scoring inputs
- Add footnote: open question for governance on non-Satoshi trigger events (NIST milestones, published quantum-attack PoCs)

### Section 4: Insurance Fund (minimal edits)
- Update premium structure table to include quantum-resistant wallet discount tier
- Add note: IF stakers earn fees partly derived from the premium differential between vulnerable and migrated wallets — creating aligned incentives for the migration mission

### Section 5: User Vaults (minimal edits)
- Add: vaults can be tagged as "migrated" once the user completes migration to a quantum-resistant address, triggering the premium discount mechanism

### Section 6: Liquidation Waterfall (minimal edits)
- Retain existing three-tier waterfall
- Add CLN (Committed Liquidity Network) as Tier 0 with explicit note: "CLN is a governance-stage feature; parameters (bond size, standby fee, execution window) to be set by governance board before activation"

### Section 7: Governance (significant rewrite)
- Replace generic DeFi governance description with NPut Foundation structure:
  - Foundation Company: governance token, protocol parameters, trigger scope expansion
  - SPC: Insurance Fund capital management
  - Governance board: quantum mandate, CLN parameters, contributor protocol roadmap, trigger expansion decisions
- Add explicit open questions section (matching Section 6 of nput-foundation-overview-2026-04-06.docx):
  - Trigger expansion framework
  - CLN parameters
  - Contributor protocol / oracle staking
  - Migration tooling scope
  - Protocol permanence and dissolution conditions

### Section 8: Roadmap (new section or significant expansion)
- Phase 1 (Launch): Federated oracle, Satoshi watchlist monitoring, IF + DEX + Auctioneer waterfall, basic vault enrollment
- Phase 2 (Expansion): Optimistic oracle, extended monitoring scope, CLN activation (governance vote), migration tooling v1
- Phase 3 (Maturity): ZK oracle, full P2PK address monitoring, quantum threat scoring, contributor protocol, migration tooling v2 (one-click)
- Long-term: Permanent Nakamoto Put residual product; Foundation as general-purpose L1 threat monitoring layer

### Section 9: Legal / Cayman Structure (minimal edits)
- Foundation Company + SPC structure retained
- Add: Foundation's explicit quantum migration mandate should be documented in constitutional documents
- Add: dissolution / permanence conditions should be addressed (see open question 6.5 in overview doc)

## Notes
- Use `docs/nput-foundation-overview-2026-04-06.docx` as the primary reference for new framing
- Do not contradict any resolved design decisions from `docs/ssl_open_questions_analysis.docx` without flagging the conflict
- Update all instances of "Satoshi Stop Loss" and "SSL" to "NPut" or "Nakamoto Put" as appropriate — but keep "SSL token" as a pending decision (token rename TBD by governance)
- The token rename (SSL → NPT or similar) is an open question; do not assume the token name in v0.2; flag as TBD
