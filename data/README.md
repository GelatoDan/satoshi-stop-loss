# Patoshi Address Database

This folder holds instructions for loading the Patoshi address set into Supabase.

## What we need

A list of ~22,000 Bitcoin addresses attributed to the Patoshi mining pattern,
as identified by Sergio Demian Lerner's research.

## Sources (in priority order)

1. **Lerner's RSK Labs research** — The most authoritative source.
   Search for "patoshi" at https://bitslog.com (Lerner's blog)

2. **WhaleTruth / Patoshi dataset** — Community-maintained list.
   https://github.com/0xB10C/known-mining-pools (check patoshi entries)

3. **BitcoinTalk thread** — Lerner's original announcement thread has address lists.

## How to load addresses into Supabase

Once you have a list of addresses (one per line or CSV format), run this
in the Supabase SQL editor:

```sql
-- For a small batch, insert directly:
INSERT INTO patoshi_addresses (address, confidence) VALUES
  ('ADDRESS_1_HERE', 'high'),
  ('ADDRESS_2_HERE', 'high');

-- After loading all addresses, update the stats cache:
SELECT refresh_address_count();
```

For bulk loading (22,000 rows), use the Supabase dashboard:
1. Go to Table Editor → patoshi_addresses
2. Click "Insert" → "Import data from CSV"
3. CSV format: address,confidence
   12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX,high

## Initial seed (verified high-confidence addresses)

A small verified seed is included below to confirm the pipeline works.
Replace with the full 22,000-address set before launch.

```sql
-- These are commonly cited Patoshi-attributed addresses.
-- Do NOT rely on this seed alone — load the full dataset.
INSERT INTO patoshi_addresses (address, block_min, block_max, confidence) VALUES
  ('12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX', 9, 9, 'high')
ON CONFLICT (address) DO NOTHING;

SELECT refresh_address_count();
```

## Governance

- Addresses should only be added with a documented source
- Removals require explicit justification logged in git commit message
- The address set is versioned — check git log for the history
