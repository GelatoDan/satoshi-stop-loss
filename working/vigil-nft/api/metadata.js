/**
 * metadata.js
 *
 * ERC-721 metadata generator for The Vigil NFT collection.
 * Returns OpenSea-compatible metadata JSON for each token.
 *
 * Metadata is dynamic — the "state" attribute and image change
 * based on current Satoshi dormancy, computed in real time.
 *
 * Token attributes:
 *   - State (dynamic)         — current dormancy state
 *   - Tier (static)           — Tier A or Tier B
 *   - Discount (static)       — 20% or 10%
 *   - Awakened At (static)    — block number when minted (fetched from contract)
 *   - Dormant Days (dynamic)  — current count
 *   - Token Number (static)   — token ID
 */

const { DORMANCY_STATES } = require("./dormancy");

// =========================================================
// ART CONFIGURATION
//
// Each state maps to:
//   - image: URL of the state artwork (hosted on IPFS or CDN)
//   - animationUrl: optional HTML/mp4 animation
//   - name suffix: appended to "The Vigil #N"
//   - description: lore text for this state
//
// Replace the image URLs with your actual IPFS hashes or CDN URLs
// before launch. Run: `node scripts/upload-art.js` to upload to IPFS.
// =========================================================

const STATE_ART = {
  [DORMANCY_STATES.AWAKENED]: {
    imageCid:     "ipfs://PLACEHOLDER_AWAKENED_CID",
    animationUrl: null,
    nameSuffix:   "— Awakened",
    description:
      "The oath is new. The vigil begins. A Watcher stirs, eyes opening " +
      "for the first time, fixed upon the dormant addresses of a ghost " +
      "who moved the world and then disappeared. Satoshi has been still " +
      "for less than a year. The vigil is young.",
    rarity: "Common",
  },

  [DORMANCY_STATES.WATCHING]: {
    imageCid:     "ipfs://PLACEHOLDER_WATCHING_CID",
    animationUrl: null,
    nameSuffix:   "— The Watch",
    description:
      "Years pass. The wallets remain still. Each block that confirms " +
      "without a Satoshi transaction is another chapter in the longest " +
      "silence in financial history. The Watcher endures, steady-eyed, " +
      "stars beginning to gather in the space behind them.",
    rarity: "Uncommon",
  },

  [DORMANCY_STATES.DEEP_WATCH]: {
    imageCid:     "ipfs://PLACEHOLDER_DEEP_WATCH_CID",
    animationUrl: null,
    nameSuffix:   "— The Deep Watch",
    description:
      "Five years of silence becomes ten. The Watcher grows ancient with " +
      "waiting. The stars behind them have multiplied into constellations " +
      "that no astronomer has named — private cartographies of patience. " +
      "Few things in human history have stayed this still this long.",
    rarity: "Rare",
  },

  [DORMANCY_STATES.ETERNAL]: {
    imageCid:     "ipfs://PLACEHOLDER_ETERNAL_CID",
    animationUrl: null,
    nameSuffix:   "— Eternal Vigil",
    description:
      "Ten years. Then more. The Watcher has transcended the human " +
      "register of time. The dormant wallets hold more value than most " +
      "nations' reserves, and have not moved by a single satoshi. " +
      "This is the Eternal state — the maximum form. A relic watching " +
      "a mystery. If Satoshi ever moves, every Vigil in this state " +
      "will transform simultaneously into something that has never " +
      "existed before.",
    rarity: "Legendary",
  },

  [DORMANCY_STATES.RECKONING]: {
    imageCid:     "ipfs://PLACEHOLDER_RECKONING_CID", // Updated after governance vote
    animationUrl: "ipfs://PLACEHOLDER_RECKONING_ANIMATION_CID",
    nameSuffix:   "— The Reckoning",
    description:
      "It happened. The wallets moved. Every Watcher felt it in the same " +
      "block. This Vigil witnessed The Reckoning — the moment ten years of " +
      "silence ended and crypto history was permanently rewritten. " +
      "The Satoshi Stop Loss protocol executed. The world changed. " +
      "This token is proof that you were watching when it did.",
    rarity: "Genesis",
  },
};

// Reckoning variants (set after governance vote)
const RECKONING_VARIANTS = {
  1: {
    name: "The Storm",
    imageCid: "ipfs://PLACEHOLDER_STORM_CID",
    animationUrl: "ipfs://PLACEHOLDER_STORM_ANIMATION_CID",
    description:
      "The community chose The Storm. When Satoshi moved, the Watcher " +
      "did not celebrate — it turned to face the wave. 1.1 million BTC " +
      "in motion is not a dawn. It is a reckoning that reshapes everything.",
  },
  2: {
    name: "The Dawn",
    imageCid: "ipfs://PLACEHOLDER_DAWN_CID",
    animationUrl: "ipfs://PLACEHOLDER_DAWN_ANIMATION_CID",
    description:
      "The community chose The Dawn. When Satoshi moved, the Watcher " +
      "turned toward the light. The long silence was not an ending — " +
      "it was a beginning waiting for its moment. The vigil is complete.",
  },
};

// =========================================================
// METADATA BUILDER
// =========================================================

/**
 * Build ERC-721 metadata for a given token.
 *
 * @param {object} params
 * @param {number} params.tokenId           — Token ID (1–2100)
 * @param {string} params.dormancyState     — Current DORMANCY_STATES value
 * @param {number} params.dormantDays       — Current dormant day count
 * @param {number} params.dormantYears      — Current dormant years (float)
 * @param {number} params.awakenedAtBlock   — Block when this token was minted
 * @param {number} params.awakenedAtTimestamp — Unix timestamp of mint
 * @param {boolean} params.reckoningDeclared — Is reckoning active?
 * @param {number}  params.reckoningVariant  — 0=undecided, 1=Storm, 2=Dawn
 * @returns {object} ERC-721 metadata object
 */
function buildMetadata({
  tokenId,
  dormancyState,
  dormantDays,
  dormantYears,
  awakenedAtBlock   = null,
  awakenedAtTimestamp = null,
  reckoningDeclared = false,
  reckoningVariant  = 0,
}) {
  const tier        = tokenId <= 500 ? "A" : "B";
  const tierLabel   = tier === "A" ? "Genesis (Tier A)" : "Vigil (Tier B)";
  const discount    = tier === "A" ? "20%" : "10%";
  const discountBps = tier === "A" ? 2000 : 1000;

  // Determine art for current state
  let art = STATE_ART[dormancyState] || STATE_ART[DORMANCY_STATES.ETERNAL];

  // If Reckoning and variant is finalized, use variant-specific art
  if (dormancyState === DORMANCY_STATES.RECKONING && reckoningVariant > 0) {
    const variantArt = RECKONING_VARIANTS[reckoningVariant];
    if (variantArt) {
      art = {
        ...art,
        imageCid:     variantArt.imageCid,
        animationUrl: variantArt.animationUrl,
        description:  variantArt.description,
        nameSuffix:   `— The Reckoning: ${variantArt.name}`,
      };
    }
  }

  // Build name
  const name = `The Vigil #${tokenId} ${art.nameSuffix}`;

  // Build attributes (OpenSea standard)
  const attributes = [
    {
      trait_type: "State",
      value: formatStateName(dormancyState),
    },
    {
      trait_type: "Tier",
      value: tierLabel,
    },
    {
      trait_type: "SSL Discount",
      value: discount,
    },
    {
      trait_type: "Discount (bps)",
      display_type: "number",
      value: discountBps,
    },
    {
      trait_type: "Dormant Days",
      display_type: "number",
      value: dormantDays,
    },
    {
      trait_type: "Dormant Years",
      display_type: "number",
      value: dormantYears,
    },
    {
      trait_type: "Rarity",
      value: art.rarity,
    },
  ];

  // Add mint block if available (fetched from contract)
  if (awakenedAtBlock) {
    attributes.push({
      trait_type: "Awakened At Block",
      display_type: "number",
      value: awakenedAtBlock,
    });
  }

  if (awakenedAtTimestamp) {
    attributes.push({
      trait_type: "Awakening Date",
      display_type: "date",
      value: awakenedAtTimestamp,
    });
  }

  if (reckoningDeclared) {
    attributes.push({
      trait_type: "Witnessed The Reckoning",
      value: "Yes",
    });
  }

  // Build final metadata
  const metadata = {
    name,
    description: art.description,
    image: art.imageCid,
    external_url: `https://thevigilnft.xyz/vigil/${tokenId}`,
    attributes,
  };

  if (art.animationUrl) {
    metadata.animation_url = art.animationUrl;
  }

  return metadata;
}

/**
 * @param {string} state — DORMANCY_STATES value
 * @returns {string} Human-readable state name
 */
function formatStateName(state) {
  const names = {
    [DORMANCY_STATES.AWAKENED]:   "Awakened",
    [DORMANCY_STATES.WATCHING]:   "The Watch",
    [DORMANCY_STATES.DEEP_WATCH]: "The Deep Watch",
    [DORMANCY_STATES.ETERNAL]:    "Eternal Vigil",
    [DORMANCY_STATES.RECKONING]:  "The Reckoning",
  };
  return names[state] || "Unknown";
}

module.exports = {
  buildMetadata,
  STATE_ART,
  RECKONING_VARIANTS,
};
