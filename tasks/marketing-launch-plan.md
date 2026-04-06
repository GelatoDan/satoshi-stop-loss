# Task: Marketing, Launch & Scaling Plan

## Objective
Produce a comprehensive, actionable marketing, launch, and scaling plan for SSL. This is a living strategy document — not a deck, not a summary — that covers everything from pre-launch community building through post-launch growth and protocol scaling.

## Output
Save to `working/ssl-marketing-launch-scaling-plan-[date].docx`

Estimated length: 40–60 pages. This is a real plan, not a bullet list. Write in full prose for each section with specific, actionable recommendations. Use tables for frameworks, timelines, and comparisons. Do not pad — every paragraph should earn its place.

## Prerequisites
Run or read outputs from:
- `tasks/competitive-research.md` — need positioning and competitive context
- `tasks/token-model.md` — need revenue projections to size marketing spend
- `INSTRUCTIONS.md` — need full protocol context

---

## Section 1: Positioning & Messaging Strategy

### 1.1 Positioning Framework
Research the following before writing this section:
- How have comparable DeFi protocols positioned themselves at launch? (Research: Nexus Mutual, GMX, dYdX, Synthetix launch narratives)
- What language does the Bitcoin/BTC holder community use when discussing Satoshi wallet risk? Search Twitter/X, Reddit (r/Bitcoin, r/CryptoCurrency), and crypto media for organic language
- What does "stop loss" mean to crypto natives vs. TradFi crossovers vs. normies? These are different audiences.

Write a full positioning framework including:
- **Category creation vs. category entry:** SSL is likely creating a new category ("Satoshi risk insurance" or "trigger-based DeFi protection") rather than entering an existing one. Analyze the tradeoffs of category creation vs. riding an existing wave.
- **Core positioning statement:** One sentence that defines what SSL is, for whom, and against what alternative
- **Positioning pillars:** 3–4 strategic claims SSL can own that competitors cannot
- **Positioning map:** Where SSL sits vs. competitors on key axes

### 1.2 Messaging Architecture
Produce a full messaging hierarchy:

**Primary message (the hook):** The one idea that makes someone stop scrolling. Draft 5 candidates and select the strongest with rationale. Example directions to explore: fear/protection angle, contrarian angle ("hodlers are already hedged — except for this one thing"), trust angle ("Satoshi built Bitcoin — but do you trust Satoshi to never sell?")

**Secondary messages by audience:**
- **Bitcoin maximalists / long-term holders:** What do they care about? How do you reach them without triggering ideological resistance?
- **DeFi natives / protocol users:** What matters to this group? Yield, composability, smart contract elegance?
- **Institutional / sophisticated traders:** What's the RFP-level pitch? Sharpe ratio improvement, tail risk hedge, portfolio insurance language?
- **Crypto media / KOLs:** What makes this a good story? Research the narratives that have historically gotten crypto protocols earned media.

**Proof points:** For each secondary message, what evidence or demonstrations make the claim credible at launch with no track record?

### 1.3 Brand Identity Considerations
This is not a full brand brief, but flag:
- Name: "Satoshi Stop Loss" is descriptive and memorable but creates Oracle/Satoshi attribution risk. Should we brand as SSL with a different full name? Research any trademark or connotation issues.
- Visual identity direction: recommend a visual language consistent with the Bitcoin orange / dark navy palette established in the spec and pitch deck
- Tone of voice: serious, expert, trustworthy? Or edgy, provocative, crypto-native? Recommend with rationale.

---

## Section 2: Audience Research & Segmentation

### 2.1 Primary Audience Segments
For each segment, research and define: size estimate, where they spend time online, what they're anxious about, what they're excited about, how they make product decisions, who influences them.

**Segment A: Serious BTC Holders (>1 BTC, 2+ years)**
Research: What are the demographics of this group? How many are DeFi-active? What protocols do they use? What communities are they in?

**Segment B: wBTC / cbBTC / tBTC holders on EVM chains**
Research: Current TVL in BTC-denominated DeFi assets. What protocols hold most of this? What is the profile of a wBTC holder?

**Segment C: DeFi yield farmers and protocol users**
Research: Active DeFi wallet count by chain (Ethereum, Arbitrum, Base, Solana). What protocols do active DeFi users currently use? What yield/APY do they expect from staking protocols?

**Segment D: Crypto-native institutional investors and family offices**
Research: How large is the institutional DeFi space? What protocols have successfully attracted institutional capital? What are their standard requirements (audits, legal structure, compliance)?

**Segment E: IF Stakers (a distinct segment — people providing capital, not buying protection)**
These are people who want to earn yield by capitalizing the Insurance Fund. Profile this segment: who writes catastrophe insurance in TradFi? Who provides liquidity in DeFi insurance protocols (look at Nexus Mutual NXM staker profiles)? What yield do they require?

### 2.2 Audience Journey Maps
For the two primary segments (BTC holders seeking protection, IF stakers seeking yield), map the full journey from first awareness to enrolled user:
- Awareness trigger: what event or content first reaches them?
- Consideration: what questions do they ask? What objections do they have?
- Decision: what pushes them to enroll vs. not?
- Activation: what does the onboarding experience need to feel like?
- Retention: what keeps them enrolled and engaged?
- Advocacy: what makes them refer others?

---

## Section 3: Pre-Launch Phase (Months -6 to 0)

### 3.1 Community Building Strategy
Define the pre-launch community strategy in detail. Research how successful DeFi protocols built early communities:
- **Nexus Mutual** — member-owned model, early evangelist program
- **GMX** — trading competition + referral mechanics
- **dYdX** — developer-first, then trader community

Produce a specific pre-launch community plan covering:
- Which platforms to build on: Discord, Telegram, X/Twitter, Farcaster, Lens? Recommend with rationale. Research where BTC holder communities vs. DeFi communities actually live.
- **Founding community size target:** What is a meaningful pre-launch community size for a DeFi protocol? Research comparable launches.
- **Content strategy for pre-launch:** What do you publish before you have a product? Research how protocols have used research content, explainers, and "risk education" content to build authority before launch.
- **Waitlist mechanics:** Should SSL have a waitlist? What incentive structure makes a waitlist meaningful vs. performative?
- **Ambassador / early adopter program:** Design a structured early adopter program with specific benefits and requirements

### 3.2 Developer & Ecosystem Relations
SSL needs integration partners — DEXs, bridges, oracle networks — before it can launch. Map the partnership development sequence:
- Which DEX integrations are table stakes? (Uniswap, Curve, Orca etc.) Who do you need to talk to and when?
- Which bridge/messaging protocols need to be engaged? (LayerZero, Wormhole, Across)
- Which oracle networks? (Chainlink for price feeds, own oracle network for trigger)
- **Integration timeline:** Build a realistic partnership development timeline. Some of these take 3–6 months to negotiate and implement.
- **Developer grants / ecosystem incentives:** Should SSL run a developer grants program pre-launch? What size? What for?

### 3.3 Research & Thought Leadership
SSL has a genuinely interesting research angle: Satoshi wallet risk is a real, quantifiable, and almost entirely unhedged risk. Use this.
- **Research content plan:** What original research can SSL publish pre-launch? Ideas: quantitative Satoshi wallet risk analysis, historical analysis of supply shock events (Mt. Gox, Luna), cross-chain stop loss mechanism design.
- **Media strategy:** Which crypto publications should SSL target for earned media? Research: CoinDesk, The Block, Decrypt, Bankless, Unchained, Blockworks. What is the hook for each? What makes this story publishable?
- **Academic / conference presence:** Is there a case for presenting at DeFi academic conferences (Financial Cryptography, MARBLE)? For an oracle/ZK roadmap protocol, yes. Recommend.

### 3.4 Testnet & Audit Strategy
The security and credibility roadmap is part of the marketing strategy:
- Which auditors should SSL engage? Research: Trail of Bits, Spearbit, Cantina, Code4rena (competitive audit). What is the signaling value of each?
- How should audit results be communicated publicly?
- Should SSL run a public bug bounty program? If so, with what scope and reward scale?
- How does the testnet launch create community engagement and early user acquisition?

---

## Section 4: Launch Strategy

### 4.1 Launch Model Selection
Research and recommend from these models:
- **Fair launch:** No VC allocation, community-first token distribution. Research: GMX, Yearn. Pros/cons for SSL.
- **VC-backed launch:** Standard seed/series A path. Research: dYdX, Synthetix early days. Pros/cons.
- **Airdrop launch:** Retroactive or points-based airdrop to seed user base. Research: Uniswap, Arbitrum, ZKsync airdrop mechanics and their effectiveness.
- **Liquidity bootstrapping:** Protocol-owned liquidity, Olympus-style bonding, or Balancer LBP. Research what's worked and what hasn't.

Recommend a specific launch model with rationale. Consider: SSL's regulatory posture (OQ-3), the two-entity Cayman structure, the IF staking mechanics, and the need to bootstrap both user vault AUM and IF capital simultaneously.

### 4.2 Token Launch Mechanics
This section must be consistent with the token model (run `tasks/token-model.md` first):
- **Initial liquidity:** How much liquidity is needed at launch? On which DEXs? Protocol-owned vs. LP incentives?
- **Price discovery mechanism:** LBP, direct listing, CEX listing, or OTC? Research what has worked for DeFi protocols at comparable sizes.
- **Community allocation:** How is community allocation distributed? Airdrop to existing BTC holders? Waitlist? Points system?
- **IF staking launch:** How is the IF seeded at launch? What APY is needed to attract initial stakers? How does this bootstrap the IF to minimum viable depth before the first user enrolls?

### 4.3 Launch Events & Activation
Design a specific launch event sequence:
- **T-30 days:** [Define activities]
- **T-7 days:** [Define activities]
- **T-0: Launch day:** What specifically happens? What does "launch day" look like? What is the narrative?
- **T+7 days:** First week engagement and retention activities
- **T+30 days:** Month 1 retrospective and Phase 2 kickoff

Research how comparable DeFi protocols have done launch day: Twitter spaces, documentation drops, YouTube walkthroughs, influencer coordination. What works?

### 4.4 Media & PR at Launch
- Draft a launch press release (or outline one for Cowork to draft in full)
- Which journalists should receive an embargo briefing? Name specific journalists at CoinDesk, The Block, Unchained, Bankless.
- What is the embargo strategy? (Some protocols share with 2–3 journalists for coordinated coverage on launch day)
- KOL/influencer coordination: which crypto influencers are aligned with the SSL message? Research who covers DeFi insurance, BTC risk management, smart contract protocols. Do not recommend influencers who would be a brand risk.

---

## Section 5: Growth Strategy (Months 1–12)

### 5.1 User Acquisition Framework
SSL has two acquisition funnels that must be built in parallel:
- **Vault users** (people depositing assets for protection)
- **IF stakers** (people providing capital to the Insurance Fund)

Both funnels need separate strategies. Design full acquisition frameworks for each including: channels, CAC estimates, conversion funnel, activation metrics.

**Channels to evaluate and size for vault users:**
- Organic search (what do BTC holders search for? research keywords)
- Twitter/X organic and paid
- DeFi aggregators (DeFiLlama, DeBank — how do protocols get featured?)
- Integration distribution (users of integrated DEXs see SSL in UI)
- Referral mechanics (design a specific referral program)
- Partnership distribution (BTC custody platforms, portfolio tracking apps)

**Channels to evaluate and size for IF stakers:**
- Yield aggregator listing (Yearn, Beefy, Convex — does SSL APY qualify?)
- Institutional outreach (direct to crypto family offices and funds)
- Protocol treasury integrations (DAOs that want yield on treasury assets)

### 5.2 Retention & Engagement
Users who enroll and forget are ideal (set-and-forget is the UX goal). But churn is still a risk. Design:
- **Passive engagement:** Regular protocol health updates, IF reserve ratio transparency, Satoshi wallet monitoring dashboard (public!)
- **Active engagement hooks:** Governance participation, new feature announcements, ecosystem expansion
- **Churn signals:** What behavior predicts vault withdrawal? How do you intervene?

The Satoshi wallet monitoring dashboard deserves special attention: a public, real-time dashboard showing Satoshi wallet activity (last movement, current balance, protocol watchlist status) is a standalone marketing asset that drives awareness and SEO. Design this as a growth product.

### 5.3 Protocol Integrations as Growth
Every DEX, bridge, or portfolio tracker that integrates SSL is a distribution channel. Design a formal integration partner program:
- Priority integration targets (research which DeFi protocols have the highest % of wBTC/BTC-correlated users)
- Integration incentive structure (SSL grants? Revenue share? Technical support?)
- Integration quality tiers: deep native integration vs. listing vs. mentioned in docs
- Timeline: which integrations to close in months 1–3, 3–6, 6–12?

### 5.4 Content & Education Strategy (Ongoing)
SSL solves a problem most people don't yet know they have. Education is therefore not just content marketing — it is prerequisite to demand creation.
- **Evergreen content:** What are the 10 pieces of content SSL should produce that will drive organic discovery indefinitely? (E.g., "What would happen if Satoshi sold?", "How to protect your Bitcoin portfolio from black swan events")
- **Real-time content triggers:** News events that create natural content hooks (BTC price ATH, Satoshi wallet near-misses, large supply unlock events at other protocols)
- **Community-generated content:** How do you make vault users want to talk about SSL publicly?
- **Developer documentation:** Quality of docs is a growth lever. What does world-class DeFi protocol documentation look like? Research exemplars (Uniswap docs, Aave docs).

---

## Section 6: Scaling Strategy (Months 12–36)

### 6.1 Chain Expansion
SSL launches on Ethereum, Arbitrum, Base, and Solana. Design the expansion roadmap:
- Which chains to add in Phase 2? Research: where is BTC-correlated asset TVL growing fastest? (Check: Optimism, Polygon, zkSync, Starknet, TON, Sui, Aptos, Cosmos ecosystem)
- What is the marketing strategy for each new chain launch? (Chain-native community outreach, grants from chain ecosystem funds)
- Should SSL apply for ecosystem grants from each chain? Research: Arbitrum foundation grants, Optimism RPGF, Solana Foundation grants. Size of available grants and application requirements.

### 6.2 Asset Expansion
SSL launches as asset-agnostic but the IF Tier 1 only absorbs BTC-denominated assets. Design:
- What asset classes should SSL prioritize for Tier 1 expansion? (ETH, LSTs, stablecoins with depeg risk?)
- What trigger expansions beyond Satoshi wallets might make sense? Research: other dormant whale wallets (Silk Road seizures, exchange cold wallets, government-held BTC), protocol exploit insurance
- How does the brand and messaging evolve if SSL expands beyond Satoshi triggers?

### 6.3 Institutional & B2B Strategy
At scale, SSL's largest customers may be institutions — hedge funds, family offices, protocol treasuries — not individual users. Design an institutional go-to-market:
- What do institutional customers need that retail doesn't? (Custom reporting, legal agreements, compliance documentation, audit trails)
- Which institutional channels should SSL pursue? (Crypto prime brokers: Galaxy, FalconX, Hidden Road; custodians: Anchorage, Copper; family office networks)
- What is the minimum AUM at which institutional sales become a priority? (Estimate from token model)
- B2B integrations: should SSL offer a white-label or API product for other protocols to offer SSL protection to their users?

### 6.4 The Oracle Phase Transition as a Marketing Event
The upgrade from federated oracle (Phase 1) to ZK proof (Phase 3) is a major trust and credibility upgrade. Design each oracle phase transition as a marketing event:
- Phase 1 → Phase 2 (optimistic): "We're decentralizing the oracle" — who cares, what's the story, how do you market this to existing users vs. new audiences?
- Phase 2 → Phase 3 (ZK): "SSL is now fully trustless" — this is a flagship announcement. What does the marketing around a ZK oracle launch look like? Research how other protocols have marketed ZK milestones.

---

## Section 7: Metrics & KPIs

### 7.1 North Star Metric
Recommend a single north star metric with rationale. Candidates:
- Total AUM enrolled (measures protocol value delivered)
- IF reserve ratio (measures protocol health)
- Number of protected wallets (measures user count)
- Protocol revenue (measures sustainability)
Recommend one and explain why the others are secondary.

### 7.2 Full KPI Dashboard
Design a full KPI framework for:
- **Acquisition:** new vaults per week, IF staker count, token holder count
- **Activation:** time from signup to first vault enrollment, first staking deposit
- **Retention:** 30/60/90-day vault retention, churn rate, average vault duration
- **Revenue:** weekly protocol revenue, IF reserve ratio, staker APY
- **Growth:** WoW AUM growth, chain expansion TVL, integration partner count
- **Community:** Discord/Telegram active members, governance participation rate, NPS

### 7.3 Launch Success Criteria
Define what "successful launch" looks like at:
- 30 days post-launch (minimum viable success)
- 90 days post-launch (protocol has legs)
- 12 months post-launch (protocol is sustainable)

Be specific: dollar AUM targets, user count targets, IF reserve targets.

---

## Section 8: Budget & Resource Plan

### 8.1 Marketing Budget Framework
Research typical DeFi protocol marketing spend:
- What % of raise do DeFi protocols typically allocate to marketing?
- What does $1M, $3M, $5M in marketing budget buy in the current market?
- Recommended budget allocation by category: content, community, PR/media, paid acquisition, events, partnerships, grants

### 8.2 Team Requirements
What marketing/growth team does SSL need?
- At launch: minimum viable team (likely: Head of Growth + Community Manager + Content Lead)
- By month 12: full team structure
- What roles should be in-house vs. agency vs. contractor?
- Recommended agencies / freelancers in the crypto marketing space (research: who have successful DeFi protocols worked with?)

### 8.3 Marketing Technology Stack
What tools does SSL need?
- Community: Discord + bots, Telegram, governance forums (Commonwealth, Snapshot)
- Analytics: Dune Analytics dashboards (public, community-facing), Mixpanel or equivalent (internal)
- CRM: for institutional outreach
- Email: for waitlist and enrolled user communications
- Social: X/Twitter management, content scheduling

---

## Section 9: Risk Scenarios

For each of the following, write a response playbook (what to say, what to do, what not to do):

1. **False positive trigger fires** — SSL liquidates users' positions, no Satoshi movement actually happened. This is an existential trust event.
2. **Insurance Fund partially depleted on a trigger** — IF is not deep enough to absorb full Tier 1 demand. Some users get partial protection.
3. **Oracle compromise** — A bad actor manipulates the oracle committee and triggers a false liquidation.
4. **Major competitor launches** — A well-funded team (or an existing major protocol like Aave or GMX) copies SSL's concept and launches with more liquidity.
5. **Regulatory action** — SEC, CFTC, or EU regulator issues guidance or enforcement action targeting SSL or a directly comparable protocol.
6. **Satoshi actually moves** — The trigger fires for real. This is simultaneously SSL's greatest marketing validation and its highest operational stress test. What is the comms plan?

---

## Format & Quality Notes

- This document should read like a real strategy document, not a template with placeholder content
- Use real data wherever available — search for current market sizes, protocol metrics, comparable launch results
- Flag estimates as estimates, with the basis for the estimate
- Each section should end with a clear "recommended next action" — what specifically should happen first
- The document should be actionable by a small founding team: prioritized, sequenced, specific
- Total length target: 40–60 pages of real content
- Use the `docx` skill for professional formatting
