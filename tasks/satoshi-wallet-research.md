# Task: Satoshi Wallet Attribution Research

## Objective
Produce a research report on the current state of Patoshi pattern wallet attribution — the foundation of SSL's watchlist. This is both due diligence and marketing context: we need to know how solid the evidence is, what the community consensus is, and what counter-arguments exist.

## Output
Save to `research/satoshi-wallet-research-[date].docx`

## Research Questions

### Attribution Confidence
1. What is the current scientific/community consensus on the Patoshi pattern? Has it been replicated or challenged since Sergio Demian Lerner's original work?
2. How many wallets / UTXOs are attributed to Satoshi with high confidence?
3. What is the estimated total BTC in these wallets at the current price?
4. Have any of these wallets ever moved? What was the last confirmed activity?
5. What is the best current estimate of which specific wallet addresses are in the Patoshi set?

### Known Risks to Attribution
1. What are the strongest counterarguments to the Patoshi pattern analysis?
2. Could any of these wallets have been spent/moved without being widely detected?
3. Are there cases where attributed wallets turned out to be misattributed?
4. What is the risk that some "Satoshi wallets" are actually owned by other early miners?

### The False Positive Question
1. What types of transactions from Patoshi wallets could be false positives? (Dust, fees, coinjoin outputs, etc.)
2. Has anyone attempted to send dust to Patoshi addresses to probe reactions?
3. At the 10,000 sat threshold (our resolved design decision), what real false positive scenarios remain?

### Community & Market Context
1. How does the crypto community currently think about Satoshi wallet movement risk?
2. Has BTC price reacted to rumors or near-misses around Satoshi wallet activity?
3. Are there any organized monitoring efforts already (academics, blockchain analytics firms)?
4. What do major blockchain analytics firms (Chainalysis, Elliptic, Arkham) say publicly about Patoshi wallets?

### Implications for SSL
1. Based on this research, is our initial watchlist seed methodology sound?
2. What governance processes should we build for adding/removing addresses?
3. What is the realistic precision/recall of our oracle at launch?

## Sources to Search
- Sergio Demian Lerner's original and updated research
- Academic papers citing Patoshi pattern (Google Scholar)
- Chainalysis, Elliptic, Arkham Intelligence public statements
- Bitcoin mailing list / BitcoinTalk archives on the topic
- Recent (2024–2026) coverage in crypto press

## Output Structure
1. Executive Summary (1 page)
2. Attribution Evidence and Confidence Assessment
3. Known Risks and Counterarguments
4. False Positive Analysis
5. Community and Market Context
6. Implications for SSL Protocol Design
7. Source list

## Important
Flag any information that is genuinely uncertain. Do not overstate confidence in attribution — this is both intellectually honest and important for the protocol's credibility.
