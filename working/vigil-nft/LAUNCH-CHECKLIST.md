# The Vigil — April 22nd Launch Checklist

## Pre-Launch Timeline

### Week 1: Apr 6–12 (Infrastructure)

#### Smart Contract
- [ ] Install Foundry: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
- [ ] Install dependencies:
  ```bash
  cd contracts
  forge install Chiru-Labs/ERC721A
  forge install OpenZeppelin/openzeppelin-contracts
  forge install foundry-rs/forge-std
  ```
- [ ] Run tests: `forge test -vvv`
- [ ] Deploy to Base Sepolia: `forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify`
- [ ] Record deployed address in `.env` files

#### Art Assets — URGENT, commission or generate ASAP
- [ ] Brief artist on 5 states (see art-brief.md)
- [ ] Deliver: 5 × 2000×2000px PNG (Awakened, Watch, Deep Watch, Eternal, Reckoning placeholder)
- [ ] Upload to IPFS via Pinata or nft.storage
- [ ] Update `metadata.js` with real IPFS CIDs

#### Metadata API
- [ ] `npm install` in `/api`
- [ ] Copy `.env.example` to `.env`, fill in values
- [ ] Test locally: `npm run dev`
- [ ] Test `/dormancy` endpoint returns correct state
- [ ] Test `/metadata/1` returns valid ERC-721 JSON
- [ ] Deploy to Railway or Render (connect GitHub repo)
- [ ] Verify CORS headers work from frontend domain

### Week 2: Apr 13–19 (Frontend + Testing)

#### Frontend
- [ ] `npm install` in `/frontend`
- [ ] Copy `.env.example` to `.env.local`, fill in:
  - `NEXT_PUBLIC_VIGIL_CONTRACT_ADDRESS` (from deployment above)
  - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (from cloud.walletconnect.com)
  - `NEXT_PUBLIC_API_URL` (your deployed API URL)
- [ ] Test locally: `npm run dev`
- [ ] Connect wallet on Base Sepolia and test mint flow end-to-end
- [ ] Check DormancyCounter loads correct state
- [ ] Check MintSection shows correct tier for early/late mints
- [ ] Test on mobile (most mints will happen on mobile)
- [ ] Deploy to Vercel: `npx vercel --prod`
- [ ] Set custom domain: `thevigilnft.xyz` (or your domain)

#### Whitelist Mint (Apr 19–21)
- [ ] Compile waitlist from email signups + wallet submissions
- [ ] Generate Merkle tree from whitelist addresses:
  ```bash
  node scripts/generate-whitelist.js addresses.json
  ```
- [ ] Update contract with Merkle root: call `setMerkleRoot(root)` via Basescan or Foundry cast
- [ ] Enable whitelist mint: call `setWhitelistMintActive(true)`
- [ ] Test with a whitelist wallet

#### Security Review
- [ ] Read-through of TheVigil.sol for logic errors
- [ ] Verify `_startTokenId()` is 1 (not 0) ✓
- [ ] Verify MAX_SUPPLY can't be exceeded ✓
- [ ] Verify wallet limit can't be bypassed via transfer ✓
- [ ] Verify Reckoning vote can't be double-counted ✓
- [ ] Consider posting to Code4rena or Sherlock for a fast audit (optional but recommended)

### Pre-Launch: Apr 20–21

#### OpenSea Collection Setup
- [ ] Deploy mainnet contract
- [ ] Verify on Basescan: `forge verify-contract <address> TheVigil --chain base`
- [ ] Go to OpenSea → Import → paste contract address → base network
- [ ] Set collection image, banner, description, links
- [ ] Set royalties (5% recommended — update `seller_fee_basis_points` in `/collection` endpoint)
- [ ] Submit for review if needed

#### Marketing Prep
- [ ] Tweet thread: "What happens to your bags if Satoshi moves tomorrow?" → announce The Vigil
- [ ] Set up Farcaster Frame for wallet connection (high conversion on FC)
- [ ] Discord announcement to SSL community
- [ ] Luno team internal announcement (Tier A spots for early partners?)
- [ ] Set up Waitlist NFT claim flow if using snapshot approach

#### Reserve Mint
- [ ] Use `reserveMint(teamAddress, N)` for:
  - Core team (suggested: 10 each, Tier A)
  - Exchange partners (Luno etc. — suggested: 20, Tier A)
  - Influencer/media (suggested: 30, Tier B)
  - Contest/giveaway (suggested: 20, Tier B)

### Launch Day: Apr 22

- [ ] Enable whitelist mint (if using whitelist phase): `setWhitelistMintActive(true)`
- [ ] Enable public mint at target time: `setMintActive(true)`
- [ ] Monitor contract on Basescan
- [ ] Watch OpenSea for secondary activity
- [ ] Post "it's live" thread on Twitter/X and Farcaster
- [ ] Pin mint link in Discord

---

## Post-Launch

- [ ] Monitor API uptime (set up UptimeRobot or similar)
- [ ] Watch for Tier A sell-through — if it goes fast, announce the milestone
- [ ] Set up SSL protocol integration (vault contract reads `getDiscount()`)
- [ ] Prepare Reckoning art variants (Storm + Dawn) — these can be done post-launch
- [ ] Update Reckoning base URI when art is ready: `setReckoningBaseURI(uri)`

---

## Key Contract Addresses (fill in after deployment)

| Network       | Contract Address | Basescan |
|---|---|---|
| Base Sepolia  | TBD | — |
| Base Mainnet  | TBD | — |

---

## Art Brief Summary (for designer)

5 states, each 2000×2000px, dark backgrounds, consistent Watcher character:

1. **Awakened** — Eyes opening. Pale light. Sparse. Soft. New.
2. **The Watch** — Steady gaze. Gold light. Stars forming behind the figure.
3. **The Deep Watch** — Older. Weathered. More stars. Deeper color palette. Purple/indigo.
4. **Eternal Vigil** — Maximum form. Cosmic. Gold glowing eyes. Star field fills the frame. Timeless.
5. **The Reckoning (placeholder)** — Motion blur. Eyes wide. Everything shifting. The moment of.

Delivery: IPFS-hosted PNGs. Provide CIDs to update `metadata.js`.

---

## Emergency Contacts & Commands

Pause minting (if bug found):
```bash
cast send $CONTRACT "setMintActive(bool)" false --private-key $DEPLOYER_PRIVATE_KEY --rpc-url https://mainnet.base.org
```

Declare Reckoning (when Satoshi moves — do NOT do this prematurely):
```bash
cast send $CONTRACT "declareReckoning()" --private-key $DEPLOYER_PRIVATE_KEY --rpc-url https://mainnet.base.org
```

Update metadata URI:
```bash
cast send $CONTRACT "setBaseURI(string)" "https://api.thevigilnft.xyz/metadata/" --private-key $DEPLOYER_PRIVATE_KEY --rpc-url https://mainnet.base.org
```
