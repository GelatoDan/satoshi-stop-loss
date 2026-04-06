/**
 * dormancy.js
 *
 * Satoshi Dormancy Oracle
 *
 * Tracks the last known UTXO spend from registered Satoshi/Patoshi pattern
 * wallet addresses. Returns the current dormancy state for NFT metadata generation.
 *
 * Data source: mempool.space public API (no key required)
 * Fallback: blockchain.info
 *
 * Dormancy States:
 *   AWAKENED   — dormancy < 1 year     (note: currently impossible, wallets dormant 10+ years)
 *   WATCHING   — 1–5 years dormancy
 *   DEEP_WATCH — 5–10 years dormancy
 *   ETERNAL    — 10+ years dormancy    (current state as of 2026)
 *   RECKONING  — Satoshi has moved     (triggered by declareReckoning() on-chain)
 */

const axios = require("axios");
const NodeCache = require("node-cache");

// Cache dormancy data for 10 minutes to avoid hammering the API
const cache = new NodeCache({ stdTTL: 600 });

// =========================================================
// KNOWN SATOSHI / PATOSHI PATTERN ADDRESSES
//
// These are the most widely attributed early-Satoshi wallet addresses
// based on the Patoshi pattern research (Sergio Demian Lerner, 2013+).
// The SSL oracle uses a superset of these addresses.
//
// Reference: https://bitslog.com/2013/04/17/the-well-deserved-fortune-of-satoshi-nakamoto/
// =========================================================
const SATOSHI_ADDRESSES = [
  // Genesis block — cannot be spent (technical anomaly in Bitcoin)
  // Included for completeness; mempool.space reports 0 spends
  "1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf Na",

  // Block 9 coinbase (first confirmed Satoshi-attributed spend pattern)
  "12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX",

  // Additional Patoshi-pattern addresses (highly attributed)
  "1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1",
  "1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR",
  "15ubicBBWFnvoZLT7GiU2qxjRaKJPdkDMG",
  "1JfbZRwdDHKZmuiZgYArJZhcuuzuw2HuMu",
  "19ZewH8Kk1PDbSNdJ97FP4EiCjTRaZMZQA",
  "1dice8EMZmqKvrGE4Qc9bUFKqCdA9Dr9Mc",
];

// The date we consider "dormancy start" for the purposes of the NFT
// Based on last known Satoshi on-chain activity (2010-05-22 or earlier)
// Using a conservative date: December 31, 2010
const DORMANCY_START_DATE = new Date("2010-12-31T00:00:00Z");

// =========================================================
// DORMANCY STATE DEFINITIONS
// =========================================================

const DORMANCY_STATES = {
  AWAKENED:   "awakened",    // < 1 year
  WATCHING:   "watching",    // 1–5 years
  DEEP_WATCH: "deep_watch",  // 5–10 years
  ETERNAL:    "eternal",     // 10+ years
  RECKONING:  "reckoning",   // Satoshi has moved
};

const DORMANCY_THRESHOLDS_DAYS = {
  AWAKENED:   365,
  WATCHING:   365 * 5,
  DEEP_WATCH: 365 * 10,
  // ETERNAL: anything above
};

/**
 * @returns {string} Current dormancy state key
 */
function computeDormancyState(lastActivityDate, reckoningDeclared = false) {
  if (reckoningDeclared) {
    return DORMANCY_STATES.RECKONING;
  }

  const now        = new Date();
  const dormantMs  = now - lastActivityDate;
  const dormantDays = dormantMs / (1000 * 60 * 60 * 24);

  if (dormantDays < DORMANCY_THRESHOLDS_DAYS.AWAKENED) {
    return DORMANCY_STATES.AWAKENED;
  } else if (dormantDays < DORMANCY_THRESHOLDS_DAYS.WATCHING) {
    return DORMANCY_STATES.WATCHING;
  } else if (dormantDays < DORMANCY_THRESHOLDS_DAYS.DEEP_WATCH) {
    return DORMANCY_STATES.DEEP_WATCH;
  } else {
    return DORMANCY_STATES.ETERNAL;
  }
}

/**
 * Fetch last activity timestamp for a given Bitcoin address
 * using the mempool.space API.
 *
 * @param {string} address Bitcoin address
 * @returns {Date|null} Last activity date, or null if never active
 */
async function fetchLastActivityForAddress(address) {
  try {
    // mempool.space: get address stats
    const statsUrl = `https://mempool.space/api/address/${address}`;
    const statsRes = await axios.get(statsUrl, { timeout: 5000 });
    const stats    = statsRes.data;

    const totalTxs = (stats.chain_stats?.tx_count || 0) +
                     (stats.mempool_stats?.tx_count || 0);

    if (totalTxs === 0) return null;

    // Get recent transactions
    const txUrl = `https://mempool.space/api/address/${address}/txs`;
    const txRes = await axios.get(txUrl, { timeout: 5000 });
    const txs   = txRes.data;

    if (!txs || txs.length === 0) return null;

    // Find the most recent confirmed transaction
    let latestTimestamp = 0;
    for (const tx of txs) {
      const ts = tx.status?.block_time || 0;
      if (ts > latestTimestamp) latestTimestamp = ts;
    }

    return latestTimestamp > 0 ? new Date(latestTimestamp * 1000) : null;
  } catch (err) {
    console.warn(`[dormancy] Failed to fetch activity for ${address}:`, err.message);
    return null;
  }
}

/**
 * Get the most recent activity timestamp across all tracked Satoshi addresses.
 * Cached for 10 minutes.
 *
 * @returns {Promise<Date>} Last known activity date
 */
async function getLastSatoshiActivity() {
  const cached = cache.get("last_satoshi_activity");
  if (cached) return cached;

  console.log("[dormancy] Fetching Satoshi address activity...");

  let mostRecentDate = DORMANCY_START_DATE; // Conservative fallback

  // Fetch in parallel with a reasonable concurrency limit
  const results = await Promise.allSettled(
    SATOSHI_ADDRESSES.map(fetchLastActivityForAddress)
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      if (result.value > mostRecentDate) {
        mostRecentDate = result.value;
      }
    }
  }

  cache.set("last_satoshi_activity", mostRecentDate);
  console.log("[dormancy] Last Satoshi activity:", mostRecentDate.toISOString());

  return mostRecentDate;
}

/**
 * Main function: get full dormancy status
 *
 * @param {boolean} reckoningDeclared — set true if on-chain Reckoning is declared
 * @returns {Promise<object>} Dormancy status object
 */
async function getDormancyStatus(reckoningDeclared = false) {
  const lastActivity = await getLastSatoshiActivity();
  const now          = new Date();

  const dormantMs   = now - lastActivity;
  const dormantDays = Math.floor(dormantMs / (1000 * 60 * 60 * 24));
  const dormantYears = (dormantDays / 365).toFixed(1);

  const state = computeDormancyState(lastActivity, reckoningDeclared);

  return {
    state,
    lastActivityDate: lastActivity.toISOString(),
    lastActivityTimestamp: Math.floor(lastActivity.getTime() / 1000),
    dormantDays,
    dormantYears: parseFloat(dormantYears),
    currentTimestamp: Math.floor(now.getTime() / 1000),
    reckoningDeclared,
  };
}

module.exports = {
  getDormancyStatus,
  DORMANCY_STATES,
  computeDormancyState,
  SATOSHI_ADDRESSES,
};
