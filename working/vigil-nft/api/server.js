/**
 * server.js
 *
 * The Vigil Metadata API Server
 *
 * Endpoints:
 *   GET /metadata/:tokenId        — ERC-721 metadata for a token (used by tokenURI)
 *   GET /dormancy                 — Current Satoshi dormancy status (used by frontend)
 *   GET /collection               — Collection-level metadata (used by OpenSea)
 *   GET /health                   — Health check
 *
 * Deploy on:
 *   - Railway, Render, or Vercel (as a serverless function)
 *   - Set environment variables per .env.example
 */

require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const rateLimit  = require("express-rate-limit");
const NodeCache  = require("node-cache");
const { ethers } = require("ethers"); // Add ethers to package.json if using contract reads

const { getDormancyStatus, DORMANCY_STATES } = require("./dormancy");
const { buildMetadata }                       = require("./metadata");

const app  = express();
const PORT = process.env.PORT || 3001;

// =========================================================
// CONFIG
// =========================================================

const MAX_SUPPLY     = 2100;
const CONTRACT_ADDRESS = process.env.VIGIL_CONTRACT_ADDRESS;
const RPC_URL          = process.env.BASE_RPC_URL || "https://mainnet.base.org";

// Simple ABI for the fields we need from the contract
const CONTRACT_ABI = [
  "function awakenedAtBlock(uint256 tokenId) view returns (uint256)",
  "function awakenedAtTimestamp(uint256 tokenId) view returns (uint256)",
  "function reckoningDeclared() view returns (bool)",
  "function reckoningVariant() view returns (uint8)",
  "function reckoningTimestamp() view returns (uint256)",
  "function getTier(uint256 tokenId) view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

// Cache for contract data (contract reads are slow/expensive)
const contractCache = new NodeCache({ stdTTL: 300 }); // 5 min cache

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(cors({
  origin: [
    "https://thevigilnft.xyz",
    "https://www.thevigilnft.xyz",
    "https://mint.thevigilnft.xyz",
    ...(process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean),
    // Allow localhost in dev
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000", "http://localhost:3002"] : []),
  ],
  methods: ["GET"],
}));

app.use(express.json());

// Rate limiting — metadata endpoints should be generous (OpenSea crawls aggressively)
const metadataLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  message: { error: "Too many requests, please try again later." },
});

const dormancyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many requests, please try again later." },
});

// =========================================================
// HELPERS
// =========================================================

let provider = null;
let contract = null;

function getContract() {
  if (!CONTRACT_ADDRESS) return null;
  if (!contract) {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }
  return contract;
}

async function getContractData(tokenId) {
  const cacheKey = `contract_${tokenId}`;
  const cached   = contractCache.get(cacheKey);
  if (cached) return cached;

  const c = getContract();
  if (!c) {
    // No contract configured — return defaults
    return { awakenedAtBlock: null, awakenedAtTimestamp: null };
  }

  try {
    const [block, timestamp] = await Promise.all([
      c.awakenedAtBlock(tokenId),
      c.awakenedAtTimestamp(tokenId),
    ]);

    const data = {
      awakenedAtBlock:     Number(block),
      awakenedAtTimestamp: Number(timestamp),
    };

    contractCache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.warn(`[server] Contract read failed for token ${tokenId}:`, err.message);
    return { awakenedAtBlock: null, awakenedAtTimestamp: null };
  }
}

async function getReckoningStatus() {
  const cacheKey = "reckoning_status";
  const cached   = contractCache.get(cacheKey);
  if (cached) return cached;

  const c = getContract();
  if (!c) return { reckoningDeclared: false, reckoningVariant: 0 };

  try {
    const [declared, variant] = await Promise.all([
      c.reckoningDeclared(),
      c.reckoningVariant(),
    ]);

    const status = {
      reckoningDeclared: declared,
      reckoningVariant:  Number(variant),
    };

    // Cache reckoning status for only 60 seconds — this is critical data
    contractCache.set(cacheKey, status, 60);
    return status;
  } catch (err) {
    console.warn("[server] Failed to fetch reckoning status:", err.message);
    return { reckoningDeclared: false, reckoningVariant: 0 };
  }
}

// =========================================================
// ROUTES
// =========================================================

/**
 * GET /health
 */
app.get("/health", (req, res) => {
  res.json({
    status:    "ok",
    timestamp: new Date().toISOString(),
    contract:  CONTRACT_ADDRESS || "not configured",
  });
});

/**
 * GET /dormancy
 *
 * Returns current Satoshi dormancy status for the frontend counter.
 * This is the data that powers the live counter on the minting site.
 */
app.get("/dormancy", dormancyLimiter, async (req, res) => {
  try {
    const reckoningStatus = await getReckoningStatus();
    const dormancy = await getDormancyStatus(reckoningStatus.reckoningDeclared);

    res.json({
      ...dormancy,
      reckoningVariant: reckoningStatus.reckoningVariant,
    });
  } catch (err) {
    console.error("[server] /dormancy error:", err);
    res.status(500).json({ error: "Failed to fetch dormancy status" });
  }
});

/**
 * GET /metadata/:tokenId
 *
 * Returns ERC-721 metadata JSON for a token.
 * This is what tokenURI points to — called by OpenSea, wallets, etc.
 */
app.get("/metadata/:tokenId", metadataLimiter, async (req, res) => {
  const tokenId = parseInt(req.params.tokenId, 10);

  // Validate token ID
  if (isNaN(tokenId) || tokenId < 1 || tokenId > MAX_SUPPLY) {
    return res.status(404).json({ error: "Token not found" });
  }

  try {
    // Fetch data in parallel
    const [reckoningStatus, dormancy, contractData] = await Promise.all([
      getReckoningStatus(),
      getDormancyStatus(false), // We pass reckoning separately
      getContractData(tokenId),
    ]);

    // Use on-chain reckoning state
    const effectiveDormancy = await getDormancyStatus(reckoningStatus.reckoningDeclared);

    const metadata = buildMetadata({
      tokenId,
      dormancyState:      effectiveDormancy.state,
      dormantDays:        effectiveDormancy.dormantDays,
      dormantYears:       effectiveDormancy.dormantYears,
      awakenedAtBlock:    contractData.awakenedAtBlock,
      awakenedAtTimestamp: contractData.awakenedAtTimestamp,
      reckoningDeclared:  reckoningStatus.reckoningDeclared,
      reckoningVariant:   reckoningStatus.reckoningVariant,
    });

    // ERC-721 metadata should not be aggressively cached
    // because it's dynamic — state can change
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 min
    res.json(metadata);
  } catch (err) {
    console.error(`[server] /metadata/${tokenId} error:`, err);
    res.status(500).json({ error: "Failed to generate metadata" });
  }
});

/**
 * GET /collection
 *
 * OpenSea collection metadata (contract-level URI)
 */
app.get("/collection", (req, res) => {
  res.json({
    name:              "The Vigil",
    description:
      "2,100 Watchers standing guard until Satoshi moves. " +
      "Each Vigil NFT grants permanent fee discounts on the " +
      "Satoshi Stop Loss protocol — the first DeFi hedge against " +
      "Satoshi's wallets coming alive. Tier A: 20% discount. " +
      "Tier B: 10% discount. If Satoshi ever moves, every Vigil " +
      "transforms simultaneously. The question isn't if. It's when.",
    image:             "ipfs://PLACEHOLDER_COLLECTION_IMAGE_CID",
    external_link:     "https://thevigilnft.xyz",
    seller_fee_basis_points: 500, // 5% secondary royalty
    fee_recipient:     process.env.ROYALTY_RECIPIENT_ADDRESS || "",
  });
});

/**
 * GET /refresh/:tokenId
 *
 * Force-refresh metadata cache for a token (useful after Reckoning).
 * Protected — only for internal use.
 */
app.get("/refresh/:tokenId", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tokenId = parseInt(req.params.tokenId, 10);
  contractCache.del(`contract_${tokenId}`);
  contractCache.del("reckoning_status");

  res.json({ ok: true, message: `Cache cleared for token ${tokenId}` });
});

// =========================================================
// START
// =========================================================

app.listen(PORT, () => {
  console.log(`[server] The Vigil metadata API running on port ${PORT}`);
  console.log(`[server] Contract: ${CONTRACT_ADDRESS || "NOT CONFIGURED"}`);
  console.log(`[server] RPC: ${RPC_URL}`);
});

module.exports = app;
