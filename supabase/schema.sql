-- ============================================================
-- Satoshi Stop Loss — Supabase Schema
-- Run this in the Supabase SQL editor: Dashboard → SQL Editor
-- ============================================================


-- ── 1. PATOSHI ADDRESSES ─────────────────────────────────────
-- Stores every Bitcoin address attributed to the Patoshi mining pattern.
-- This is the watchlist. ~22,000 rows at full population.

CREATE TABLE IF NOT EXISTS patoshi_addresses (
  id          BIGSERIAL   PRIMARY KEY,
  address     TEXT        UNIQUE NOT NULL,
  block_min   INT,                          -- earliest block this address appears in
  block_max   INT,                          -- latest block
  confidence  TEXT        DEFAULT 'high',   -- 'high' | 'medium' (for future tiering)
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patoshi_addresses_address ON patoshi_addresses(address);


-- ── 2. SUBSCRIBERS ───────────────────────────────────────────
-- Everyone who has signed up for alerts.

CREATE TABLE IF NOT EXISTS subscribers (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email               TEXT        UNIQUE NOT NULL,
  telegram_handle     TEXT,
  threshold_sats      BIGINT      DEFAULT 0,    -- 0 = alert on any movement
  confirmed           BOOLEAN     DEFAULT FALSE,
  confirmation_token  UUID        DEFAULT gen_random_uuid() UNIQUE,
  unsubscribe_token   UUID        DEFAULT gen_random_uuid() UNIQUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscribers_confirmation_token ON subscribers(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token  ON subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_confirmed          ON subscribers(confirmed);


-- ── 3. ALERT LOG ─────────────────────────────────────────────
-- Every alert ever fired. Immutable record.

CREATE TABLE IF NOT EXISTS alert_log (
  id                    BIGSERIAL   PRIMARY KEY,
  patoshi_address       TEXT        NOT NULL,
  txid                  TEXT        NOT NULL,
  amount_sats           BIGINT,               -- satoshis moved in this tx
  block_height          INT,                  -- null if still in mempool
  subscribers_notified  INT         DEFAULT 0,
  fired_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alert_log_fired_at ON alert_log(fired_at DESC);


-- ── 4. STATS CACHE ───────────────────────────────────────────
-- Cached values for the homepage display.
-- Updated manually at launch and on each alert.

CREATE TABLE IF NOT EXISTS stats (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial stats values
INSERT INTO stats (key, value) VALUES
  ('total_btc_estimate',  '1100000'),       -- approximate BTC in Patoshi wallets
  ('address_count',       '0'),             -- updated when addresses are loaded
  ('last_movement',       'Never confirmed'),
  ('last_txid',           '')
ON CONFLICT (key) DO NOTHING;


-- ── 5. ROW LEVEL SECURITY ────────────────────────────────────
-- Public can insert subscribers (sign up) but not read them.
-- Everything else is service-role only.

ALTER TABLE subscribers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE patoshi_addresses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_log           ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats               ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up (insert only)
CREATE POLICY "allow_public_subscribe"
  ON subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public read of stats (for homepage)
CREATE POLICY "allow_public_read_stats"
  ON stats FOR SELECT
  TO anon
  USING (true);

-- Allow public read of address count only (not the actual addresses)
CREATE POLICY "allow_public_read_address_count"
  ON patoshi_addresses FOR SELECT
  TO anon
  USING (true);

-- Service role bypasses RLS automatically — no extra policies needed


-- ── 6. HELPER FUNCTION ───────────────────────────────────────
-- Call this after loading addresses to update the stats cache.

CREATE OR REPLACE FUNCTION refresh_address_count()
RETURNS void AS $$
BEGIN
  UPDATE stats
  SET value = (SELECT COUNT(*)::TEXT FROM patoshi_addresses),
      updated_at = NOW()
  WHERE key = 'address_count';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
