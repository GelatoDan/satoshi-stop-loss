# Task: Update Protocol Spec to v0.2

## Objective
Produce `docs/ssl_spec_v0.2.docx` — an updated version of the protocol specification that incorporates all resolved open questions from the OQ analysis document.

## Source Documents
- `docs/ssl_spec_v0.1.docx` — current spec (read this fully first)
- `docs/ssl_open_questions_analysis.docx` — resolved positions for all 6 OQs

## What to Change

### Section 8: Governance & Upgradeability
Update to reflect resolved token design (OQ-1):
- SSL token = governance + IF staking (not pure governance)
- IF staking mechanics: 7-day unbonding, pro-rata slash on depletion, yield sources
- Fee distribution governance unlock mechanism
- Emergency token issuance prohibition as protocol invariant

### Section 4: Insurance Fund
Update to reflect:
- Two-bucket IF capital: open-market BTC buying + direct Tier 1 absorption (these are already in v0.1 but clarify sizing)
- Four-tier deficit recovery mechanism (OQ-6): auto-replenishment → multisig draw → governance vote → reinsurance
- Pre-funded reinsurance requirement at launch
- 40% per-trigger deployment cap (already in v0.1, confirm)

### Section 3: Oracle & Trigger Layer
Update to reflect:
- 10,000 satoshi dust filter (OQ-4) — add as a new parameter entry
- 72-hour trigger consolidation window (OQ-5) — add as new Section 3.4
- Trigger state machine: monitoring → triggered → event window → reset

### New Section: Auctioneer Network (expand from Section 5.4)
Expand Tier 3 to reflect two-tier auctioneer model (OQ-2):
- Tier A: permissioned institutional (self-certified KYC, higher position caps, lower bond %)
- Tier B: permissionless bonded (no KYC, smaller caps, same bond % floor)
- Bond parameters: USDC/ETH only, minimum 100k USDC equivalent, 14-day post-bid lock

### Appendix: Add Resolved Open Questions Summary
Add a new appendix that maps each OQ to its resolved position (one paragraph each). This is the canonical decision log.

## What Not to Change
- Section 7 (Cross-Chain Architecture) — no changes
- Tokenomics numbers — these will come from the token model task
- The open questions table in Section 10 — replace it with the resolved decisions summary

## Output Format
Same visual style as v0.1 (Bitcoin orange accent, Arial font, professional formatting). Save as `docs/ssl_spec_v0.2.docx`. Do not delete v0.1.

## Version History Block
Add a version history table to the cover page:
| Version | Date | Changes |
|---|---|---|
| v0.1 | [original date] | Initial draft |
| v0.2 | [today] | Incorporated OQ-1 through OQ-6 resolved positions |
