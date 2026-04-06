# Task: SSL Token Economics Model

## Objective
Build a comprehensive token economics model for the SSL token as an Excel workbook. This should be institutional-grade — suitable for sharing with investors and used as the basis for the pitch deck.

## Context
Read `INSTRUCTIONS.md` and `docs/ssl_open_questions_analysis.docx` (OQ-1) before starting. The token model parameters are partially defined. This task fills them out with full projections.

## Resolved Design Decisions (Do Not Override)
- SSL token = governance + IF staking rights
- IF staking yield = 50% of enrollment premiums + 50% of ongoing protocol fees + 10% of auctioneer profits
- Emergency token issuance is permanently prohibited
- Fee distribution to token holders is a governance-unlockable feature, disabled at launch
- Total supply: 1,000,000,000 SSL (1 billion)
- Minimum staking unbonding period: 7 days

## Deliverable
An Excel workbook saved to `working/ssl-token-model-[date].xlsx` with the following sheets:

### Sheet 1: Supply Schedule
- Token allocation breakdown (team, investors, community, IF reserve, ecosystem, treasury)
- Vesting schedule for each allocation bucket
- Circulating supply curve over 60 months
- Unlock events calendar

### Sheet 2: IF Staking Model
- Inputs: AUM enrolled in protocol, enrollment premium rate, ongoing fee rate, auctioneer volume estimate
- Outputs: Annual IF staking yield (%) at different AUM levels
- Scenario table: Bear / Base / Bull AUM growth assumptions
- Staking APY projections for years 1–5

### Sheet 3: Protocol Revenue
- Revenue streams: enrollment premiums, ongoing fees, auctioneer revenue share
- Monthly revenue projections for years 1–3 under Bear/Base/Bull scenarios
- Revenue breakdown by chain and asset class
- IF reserve ratio tracker (reserve / AUM)

### Sheet 4: Token Value Model
- Token valuation using: P/E multiple on protocol revenue, comparable protocol multiples, fully diluted vs. circulating market cap
- Comparable protocols to benchmark against: research and include Nexus Mutual (NXM), UMA Protocol, dYdX, GMX, Synthetix
- Price targets at different FDV scenarios ($10M, $50M, $100M, $500M, $1B)

### Sheet 5: Sensitivity Analysis
- Key variable sensitivities: enrollment premium rate, AUM growth, BTC price (affects enrollment value), staker participation rate
- Monte Carlo-style scenario table (manually parameterized)

## Data You'll Need to Research
Search for current figures on:
- Total DeFi TVL (current)
- BTC price (current)
- Comparable protocol market caps: NXM, UMA, GMX, Synthetix, Risk Harbor
- Typical DeFi enrollment/management fee benchmarks
- Historical Satoshi wallet UTXO data (approximate BTC at known addresses)

## Quality Bar
This is investor-ready. Use clean formatting, consistent color scheme (Bitcoin orange #F7931A as accent), proper formula auditing (no hardcoded numbers inside formulas), and input cells clearly marked in blue. Every assumption should be visible and labeled.
