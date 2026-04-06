# SSL Investor Memo: Exchange Liquidity, Fund Capacity, and Profitability

Prepared: April 6, 2026  
Reference BTC price: ~$70,057 (CoinGecko, crawled April 6, 2026)

## Executive Summary

Satoshi Stop Loss (SSL) is best understood as a catastrophe-style underwriting protocol built on top of centralized exchange liquidity, not as a pure DeFi routing product. That framing matters. The size of SSL's addressable insured book is constrained less by smart contract design than by how much BTC can actually be liquidated into USD stablecoins during a panic without the market gapping away.

The market structure is favorable, but only up to a point:

- BTC remains overwhelmingly a CEX market. CoinGecko's March 27, 2026 trading activity report says DEXs were only 13.6% of spot volume in January 2026, while CEXs still handled over $1 trillion in monthly spot volume.
- Binance remains the dominant exchange. CoinGecko's January 29, 2026 exchange market-share report shows Binance at 38.3% of December 2025 spot volume, versus 9.5% for Bybit and 9.1% for MEXC.
- Public liquidity data still points to a concentrated BTC market. CoinGecko's June 26, 2025 liquidity report found only $20 million to $25 million of one-sided depth across eight major exchanges within +/-$100 of BTC mid-price, with Binance contributing about $8 million per side. Kaiko's April 14, 2025 note reported aggregate BTC 1% market depth at roughly $500 million by quarter-end.

The investor conclusion is straightforward:

1. SSL can plausibly launch without a Committed Liquidity Network (CLN), but only at a modest insured scale.
2. A credible launch range is roughly $50 million to $150 million of insured AUM, with $150 million to $250 million possible if execution tolerances are wider and routing is disciplined.
3. Scaling beyond roughly $250 million to $300 million of BTC-sensitive insured AUM requires either a CLN, slower execution promises, derivatives hedging, or much more explicit institutional market-making partnerships.
4. At the currently proposed fee schedule, SSL can become economically interesting, but not lavishly profitable. It behaves more like a specialty insurer than a high-margin software protocol.
5. The biggest hidden issue is CLN economics: if SSL pays meaningful standby fees for committed liquidity too early, the CLN can consume most or all of the protocol's fee pool.

## What The Market Data Says

### 1. BTC liquidity is deep, but concentrated

- Binance remained the largest CEX by spot volume in December 2025 with 38.3% share, while Bybit was second at 9.5% and MEXC third at 9.1%.
- CoinGecko's 2025 liquidity report found that, across eight major exchanges, BTC had median cumulative one-sided depth of $20 million to $25 million within +/-$100 of market price.
- In that same report, Binance represented about 32% of that narrow-band liquidity, with roughly $8 million on both bid and ask inside +/-$100.
- Kaiko reported in April 2025 that BTC 1% market depth had recovered to roughly $500 million by quarter-end, and that U.S. exchanges had become increasingly important contributors to global depth.
- Kaiko also noted in July 2025 that U.S.-based exchanges had come to dominate global BTC 1% depth, reflecting the institutionalization of BTC liquidity.

Takeaway: SSL is not facing a "no liquidity" problem. It is facing a "usable liquidity under stress is concentrated and time-dependent" problem.

### 2. BTC execution is still a CEX-first problem

- CoinGecko's March 27, 2026 report says DEX share of spot volume reached 13.6% in January 2026, up from 6.9% in January 2024.
- That same report says CEXs still maintained more than $1 trillion in monthly spot trading volume.
- Uniswap's current combined TVL is about $4.1 billion and Curve's about $2.5 billion, but those protocol-level TVL numbers overstate immediately usable WBTC exit liquidity because SSL would only touch specific BTC pools and price bands.

Takeaway: DEX routing is useful as a marginal execution layer, but not as SSL's core underwriting assumption.

### 3. USD stablecoins are the only settlement layer that matters at launch

Current stablecoin structure is highly asymmetric:

- Total stablecoin market cap is about $311 billion.
- USDT is about $184.1 billion.
- USDC is about $77.6 billion.
- FDUSD is about $394 million.
- The entire EUR stablecoin category is only about $900 million.

Takeaway: SSL should assume USDT and USDC are the real settlement currencies. EUR stablecoins are strategically interesting, but too small to underwrite serious event capacity today.

## Capacity Model: How Big Can The Fund Be?

There are two different "size" questions:

1. How large can the Insurance Fund itself be?
2. How much insured AUM can SSL support while still claiming credible execution?

The second question is the important one.

### Core modeling assumptions

The model below uses a deliberately conservative investor lens:

- BTC-sensitive share of insured AUM: 60%
- Insurance Fund reserve ratio: 10% of insured AUM
- Per-trigger IF deployment cap: 40% of reserves
- Therefore, immediate IF firepower per trigger = 4% of insured AUM
- Effective accessible open-market depth:
  - Conservative: $90 million
  - Base: $130 million
  - Aggressive: $175 million

These depth assumptions are not direct quotes from a single source. They are a stress-adjusted synthesis built from public CoinGecko and Kaiko liquidity data, then haircutted for fragmentation, slippage, and the fact that visible order-book depth is not the same thing as safely executable size.

### Capacity formula

To keep fast execution credible:

`BTC-exposed AUM <= effective market depth + deployable IF capital + CLN committed liquidity`

Using the assumptions above:

`0.60 x AUM <= D + 0.04 x AUM + CLN`

Which simplifies to:

`AUM <= (D + CLN) / 0.56`

### Resulting insured-AUM capacity

| Scenario | Effective Depth | CLN | Max Credible Insured AUM | Implied IF Reserve at 10% |
|---|---:|---:|---:|---:|
| Conservative launch | $90M | $0 | $161M | $16M |
| Base launch | $130M | $0 | $232M | $23M |
| Strong launch | $175M | $0 | $313M | $31M |
| Base + light CLN | $130M | $100M | $411M | $41M |
| Base + medium CLN | $130M | $250M | $679M | $68M |
| Aggressive + medium CLN | $175M | $250M | $759M | $76M |

### Investor interpretation

- Without CLN, SSL should underwrite its initial business as a sub-$250 million insured-AUM product.
- A realistic investor base case is $100 million to $200 million of insured AUM in the first serious scale phase.
- Without a CLN, pushing much above $250 million to $300 million means SSL is increasingly depending on good market conditions rather than guaranteed liquidity.
- The IF size matters, but less than many founders initially assume. Because only 40% of reserves can be deployed per trigger, market depth is still the dominant bottleneck.

### Practical launch recommendation

For an investor-grade launch plan:

- Seed IF target: $10 million to $20 million
- Stretch IF target after initial traction: $20 million to $30 million
- Credible initial insured-AUM target: $50 million to $150 million
- Maximum no-CLN stretch target: ~$200 million to $250 million

That range is materially more credible than pitching "$1 billion insured" before live routing, exchange partnerships, and execution telemetry exist.

## Profitability Model: How Much Money Can SSL Make?

## Important caveat

SSL's current design does not behave like a normal revenue SaaS business.

- 50% of enrollment premiums go to the Insurance Fund.
- 50% of enrollment premiums go to SSL stakers.
- 50% of ongoing fees go to the Insurance Fund.
- 50% of ongoing fees go to SSL stakers.
- Launch design keeps the broader fee switch off for passive token holders.

That means the protocol's economic engine exists, but passive token-holder cash flow is intentionally limited at launch. Investor returns depend on treasury ownership, staking participation, and future governance decisions, not only on top-line fee volume.

### Fee mechanics

Current SSL design range:

- Enrollment premium: 0.25% to 1.00% one-time
- Ongoing fee: 5 to 20 bps annually

For context, Nexus Mutual's pricing documentation illustrates public-cover prices in the low-single-digit annual range, including examples around 3.0% to 5.5% per year depending on utilization. SSL's current draft pricing is therefore conservative relative to existing onchain risk-transfer precedent.

For underwriting analysis, the right question is not "what is the headline fee?" but:

`gross fee yield on AUM = enrollment premium x annual new-enrollment ratio + ongoing fee`

That is because the enrollment premium is only paid on new deposits, not on the entire insured book forever.

### Scenario analysis at $250 million average insured AUM

| Scenario | Enrollment Premium | Ongoing Fee | Annual New Enrollment as % of AUM | Gross Fee Yield on AUM | Annual Gross Fees | To IF | To Stakers |
|---|---:|---:|---:|---:|---:|---:|---:|
| Bear | 0.50% | 0.10% | 25% | 0.225% | $562.5K | $281.3K | $281.3K |
| Base | 0.75% | 0.15% | 50% | 0.525% | $1.313M | $656.3K | $656.3K |
| Bull | 1.00% | 0.20% | 100% | 1.20% | $3.000M | $1.500M | $1.500M |

### What this means for investor returns

Assume the IF reserve target is 10% of AUM, so reserve capital at $250 million AUM is $25 million.

Then staker gross yield before losses is approximately:

- Bear: 1.1%
- Base: 2.6%
- Bull: 6.0%

That is not bad for catastrophe-style risk capital, but it is not enough on its own to support an aggressive token valuation unless one of the following is also true:

- fee levels are materially higher than the current draft range,
- AUM growth is very fast for multiple years,
- treasury-owned staking captures a large share of that yield,
- auction profits become meaningful,
- or governance later enables broader fee capture.

### The hard truth on profitability

At the current pricing range, SSL is economically viable, but only modestly lucrative in its early phases.

This is the right investor framing:

- SSL is not a "90% margin protocol" at launch.
- SSL is a specialty risk-transfer market with attractive optionality if it can become the default hedge for a uniquely legible Bitcoin tail risk.
- The early business case is credibility first, then operating leverage later.

## CLN Economics: The Hidden Constraint

The CLN is strategically powerful, but it is also the place where the business model can break.

If SSL pays standby fees for committed liquidity, the cost can become enormous relative to fee income.

### Illustrative annual CLN standby cost

| CLN Size | 50 bps Standby Fee | 100 bps Standby Fee | 150 bps Standby Fee |
|---|---:|---:|---:|
| $100M | $0.5M | $1.0M | $1.5M |
| $250M | $1.25M | $2.5M | $3.75M |
| $500M | $2.5M | $5.0M | $7.5M |

Compare that with the earlier base-case fee pool at $250 million AUM:

- Total annual gross fees: ~$1.31 million

That implies:

- A $100 million CLN at 50 bps consumes ~38% of base-case annual gross fees.
- A $250 million CLN at 50 bps consumes almost all base-case annual gross fees.
- Anything above that requires either much larger AUM, much higher pricing, or explicit subsidy from treasury or outside capital.

### Investor conclusion on CLN

The CLN should be phased, not treated as a full-scale launch feature.

Best sequencing:

1. Launch with open-market execution plus IF.
2. Add a small institutional CLN tranche, likely $50 million to $100 million.
3. Expand CLN only when fee income or institutional contract pricing can clearly support it.

Otherwise SSL risks building a beautiful liquidity backstop that destroys unit economics.

## Strategic Conclusions For Investors

### What is investable now

- The concept is real and non-trivial.
- BTC market structure is deep enough for SSL to be viable at modest scale.
- The risk is legible and marketable: "What happens if Satoshi moves?" is instantly understandable.
- Stablecoin infrastructure is now large enough that automated BTC-to-dollar exits are operationally plausible.

### What needs to be believed

- SSL can acquire enough trust to become the default hedge for this specific tail risk.
- The founding team can secure exchange, market maker, and liquidity relationships before promising institutional-scale coverage.
- The protocol can collect enough fees without overpricing itself out of adoption.

### What would make the story much stronger

- Live exchange API depth monitoring across launch venues
- venue-by-venue execution tests during off-hours and stress windows
- letters of intent from exchanges, OTC desks, or market makers for CLN participation
- a clearer pricing roadmap that shows how SSL moves from "cheap early adoption" to "actuarially serious underwriting"
- explicit treasury capture mechanics for investors who are not themselves IF stakers

## Bottom Line

A disciplined investor case for SSL is:

- Launch as a $50 million to $150 million insured-AUM product.
- Seed the IF with $10 million to $20 million of committed capital.
- Treat $200 million to $250 million insured AUM as the no-CLN outer limit.
- Use CLN as the scaling unlock, but only in staged tranches because standby fees can swamp protocol economics.
- Pitch SSL as a category-defining catastrophe hedge with strong strategic upside, not as an instantly massive high-margin protocol.

That is still a compelling pre-seed memo. In fact, it is more compelling because it shows the team understands both the market opportunity and the operational constraints.

## Sources

1. CoinGecko BTC price page, crawled April 6, 2026: https://www.coingecko.com/en/coins/bitcoin
2. CoinGecko, "CEX & DEX Trading Activity Report 2026," updated March 27, 2026: https://www.coingecko.com/research/publications/cex-dex-trading-activity-report-2026
3. CoinGecko, "Market Share of Centralized Crypto Exchanges, by Trading Volume," updated January 29, 2026: https://www.coingecko.com/research/publications/centralized-crypto-exchanges-market-share
4. CoinGecko, "Crypto Liquidity on CEXes 2025," updated June 26, 2025: https://www.coingecko.com/research/publications/crypto-liquidity-report-2025
5. Kaiko Research, "XRP Races As ETFs Deadlines Loom," published April 14, 2025: https://research.kaiko.com/insights/xrps-liquidity-race-as-crypto-etfs-deadlines-loom
6. Kaiko Research, "Gap grows between Bitcoin and altcoins," published July 7, 2025: https://research.kaiko.com/insights/gap-grows-between-bitcoin-and-altcoins
7. DefiLlama, Uniswap protocol page, crawled April 2026: https://defillama.com/protocol/uniswap/tvl
8. DefiLlama, Curve Finance protocol page, crawled April 2026: https://defillama.com/protocol/curve-finance?groupBy=monthly
9. CoinGecko stablecoins category, crawled April 6, 2026: https://www.coingecko.com/en/categories/stablecoins
10. CoinGecko EUR stablecoins category, crawled April 6, 2026: https://www.coingecko.com/en/categories/eur-stablecoin
11. CoinGecko First Digital USD page, crawled April 6, 2026: https://www.coingecko.com/en/coins/first-digital-usd
12. Nexus Mutual pricing documentation, crawled April 2026: https://docs.nexusmutual.io/protocol/pricing/
