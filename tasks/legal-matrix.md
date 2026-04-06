# Task: Legal Jurisdiction Matrix

## Objective
Build a jurisdiction-by-jurisdiction legal risk matrix for SSL. This is pre-legal-counsel research — it maps the risk landscape so the founding team knows which jurisdictions to prioritize for formal legal opinions.

## Output
Save to `research/legal-jurisdiction-matrix-[date].docx`

## Resolved Structural Decisions (Do Not Override)
- Entity structure: Cayman Foundation Company (protocol/token) + Cayman SPC (Insurance Fund)
- Protocol does not perform KYC; Tier A auctioneers self-certify compliance
- SSL token at launch = governance + IF staking only; no fee distribution
- The IF is a staking pool, not a traditional insurance product (though regulators may disagree)

## Jurisdictions to Cover
Priority tier 1 (must have clean legal opinion before launch):
- United States (SEC, CFTC, FinCEN perspectives separately)
- European Union (MiCA, AIFMD, insurance directive)
- United Kingdom (FCA)
- Singapore (MAS)

Priority tier 2 (important for user base, research-level only):
- Switzerland (FINMA)
- UAE / ADGM (FSRA)
- Australia (ASIC)
- South Korea (FSC)
- Hong Kong (SFC)

## For Each Jurisdiction, Research and Document

### Token Classification
- How is the SSL token likely classified? (utility, security, e-money, other)
- Relevant regulatory framework
- Recent enforcement actions or guidance relevant to similar tokens
- Risk level: Low / Medium / High / Critical

### Insurance Fund
- Would the IF be characterized as an insurance product?
- Would it be characterized as a collective investment scheme / fund?
- Licensing requirements if either classification applies
- Risk level: Low / Medium / High / Critical

### Protocol Operations
- Any restrictions on operating a DeFi liquidation protocol for users in this jurisdiction?
- Any geo-blocking requirements?
- AML/KYC obligations triggered by the protocol's mechanics?

### User Participation
- Can retail users in this jurisdiction legally use SSL?
- Any restrictions on crypto derivatives / structured products that might apply?

### Overall Jurisdiction Verdict
- Green: Low risk, likely operable without major compliance overhead
- Amber: Medium risk, proceed with legal opinion, likely manageable
- Red: High risk, likely require geo-blocking or significant compliance infrastructure
- Black: Do not operate, existential legal risk

## Synthesis Section
After the jurisdiction entries, produce:

1. **Launch jurisdiction strategy:** Which jurisdictions to target at launch vs. defer
2. **Geo-blocking recommendation:** Which jurisdictions to block at the UI level from day one (typically: US retail, sanctioned countries)
3. **Priority legal opinion list:** Ordered list of jurisdictions where formal legal opinions are needed pre-launch
4. **Ongoing compliance costs estimate:** Rough order-of-magnitude estimate of compliance overhead by phase

## Research Guidance
- Search for: MiCA insurance fund classification, Cayman SPC DeFi structure, SEC DeFi enforcement actions 2024-2025, CFTC crypto staking guidance, MAS DeFi framework
- Look for any regulatory actions against comparable protocols (Nexus Mutual, GMX, dYdX had relevant enforcement/advisory history)
- Flag any recent (2025–2026) regulatory developments that materially change the risk picture
- This is research, not legal advice. All conclusions should be framed as preliminary risk assessment pending formal legal counsel.
