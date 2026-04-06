# Task: Investor Pitch Deck

## Objective
Build a 15–18 slide investor pitch deck for SSL's pre-seed / seed fundraise. Target audience: crypto-native VCs and DeFi-focused funds.

## Output
Save to `working/ssl-pitch-deck-[date].pptx`

## Prerequisites
Run these tasks first (or use their outputs if already complete):
- `tasks/competitive-research.md` → need positioning and competitive data
- `tasks/token-model.md` → need revenue projections and token metrics

## Deck Structure

### Slide 1: Cover
- Protocol name, tagline, date
- Tagline suggestion to iterate on: "The only stop loss that fires before the market does."

### Slide 2: The Problem
- Satoshi controls ~1.1M BTC (~5% of all Bitcoin supply)
- These coins have never moved since 2009–2010
- If they move: credible signal of forced sale, compromise, or exit
- Historical analogies to large sudden supply unlocks (research Mt. Gox, Luna, FTX for comparable panic events)
- Current tools fail in this scenario: exchange stop-losses gap, manual triggers require human reaction time, no on-chain automation exists

### Slide 3: The Scale of the Risk
- Visual: 1.1M BTC at current price = $[X]B overhang
- Speed of expected market impact (reference historical flash crashes)
- "This is not a tail risk — it is a known, named, unhedged risk with a known source address set"

### Slide 4: The Solution
- SSL in one sentence
- How it works: 3-step visual (deposit → configure → trigger fires → protected)
- Key differentiator: automated, on-chain, fires before price discovery

### Slide 5: How It Works — Protocol Mechanics
- Three-tier liquidation waterfall diagram (visual)
- Insurance Fund → DEX Routing → Auctioneer Network
- Keep it accessible — this is a non-technical VC slide

### Slide 6: Insurance Fund
- What it is, how it's capitalized
- Why it creates a defensible moat (IF depth = protocol value)
- IF flywheel: more users → more premiums → deeper IF → more user confidence → more users

### Slide 7: The Market
- TAM: all BTC holders who would benefit from automated Satoshi stop-loss protection
- Research and quantify: number of BTC wallets with >1 BTC, total BTC held in DeFi (wBTC, cbBTC etc.), DeFi insurance market size
- SAM: DeFi-native users on supported chains
- SOM: realistic year 1–3 AUM targets (from token model)

### Slide 8: Competitive Landscape
- 2x2 matrix: Automated vs. Manual (x-axis) × On-chain vs. Centralized (y-axis)
- SSL sits in: Automated + On-chain (unique quadrant)
- Brief callouts of 3–4 nearest competitors and why they don't solve this

### Slide 9: Traction / Validation (placeholder)
- If no traction yet: use "Why Now" framing instead
- Why Now signals: BTC price at all-time high levels, Satoshi wallets have more $ value than ever, DeFi infrastructure now mature enough to support this, cross-chain messaging (LayerZero, Wormhole) now battle-tested
- Any testnet activity, waitlist signups, advisor commitments, or LOIs

### Slide 10: Business Model
- Revenue streams: enrollment premiums, ongoing bps fees, auctioneer revenue share
- Unit economics: revenue per $1M AUM at Base scenario (from token model)
- Path to profitability / self-sustaining IF

### Slide 11: Token & Go-To-Market
- SSL token: governance + IF staking
- IF staking APY at Base scenario AUM
- Token distribution summary (from token model)
- Launch strategy: 2-sentence summary (detail in marketing plan)

### Slide 12: Roadmap
- Phase 1 (0–6 months): Audits, federated oracle launch, EVM + Solana mainnet
- Phase 2 (6–18 months): Optimistic oracle upgrade, additional chains, auctioneer network growth
- Phase 3 (18–36 months): ZK oracle, protocol fee switch governance vote, institutional integrations
- Key milestones: first $100M AUM, first trigger event (if/when it happens), governance decentralization

### Slide 13: Team (placeholder — fill in actual team)
- Placeholder structure: Founder/CEO, Protocol Lead, Head of Growth, Legal/Compliance Lead, Advisors
- Note any relevant backgrounds (DeFi protocol experience, Bitcoin research, insurance/risk background)

### Slide 14: The Ask
- Raise amount and round type (pre-seed / seed)
- Use of funds breakdown: protocol development, audits, legal/compliance, Insurance Fund seed, marketing/growth
- Valuation / token terms (leave blank if not yet decided — flag as TBD)

### Slide 15: Why This Matters
- Closing narrative slide, not a bullet point list
- The existential framing: "The question is not whether Satoshi will move. The question is whether you'll be protected when they do."

## Design Requirements
- Dark theme: deep navy (#1A1A2E) background, Bitcoin orange (#F7931A) accent
- Clean, minimal — no clip art, no stock photos
- Data visualizations over text wherever possible
- Each slide: one main message, maximum 3 supporting points
- Use the `pptx` skill for professional output quality

## Notes for Agent
- Where data is missing (team, raise amount, specific traction), insert clearly marked placeholders: [PLACEHOLDER: ...]
- Do not invent market data — search for real figures or flag as estimate
- The deck should feel premium and crypto-native, not generic fintech
