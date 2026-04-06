/**
 * Satoshi Stop Loss — Blockchain Monitor
 *
 * Connects to mempool.space websocket to receive new block notifications.
 * On each new block, fetches all transactions and checks inputs against
 * the Patoshi address set. Sends email alerts if a match is found.
 *
 * Also runs a mempool check every 10 minutes to catch unconfirmed transactions.
 *
 * Deploy this on Railway: railway up
 */

'use strict'

const WebSocket = require('ws')
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

// ── CONFIG ───────────────────────────────────────────────────

require('fs').existsSync('.env') && require('fs')
  .readFileSync('.env', 'utf8')
  .split('\n')
  .forEach(line => {
    const [key, ...val] = line.split('=')
    if (key && val.length) process.env[key.trim()] = val.join('=').trim()
  })

const SUPABASE_URL           = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY         = process.env.RESEND_API_KEY
const SITE_URL               = process.env.SITE_URL || 'https://nput.foundation'
const FROM_EMAIL             = process.env.FROM_EMAIL || 'alerts@nput.foundation'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY) {
  console.error('❌ Missing required environment variables. Check .env file.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const resend   = new Resend(RESEND_API_KEY)

// ── STATE ────────────────────────────────────────────────────

let patoshiAddresses = new Set()    // O(1) lookup for 22k addresses
let lastBlockHash    = null
let isProcessing     = false
let wsReconnectDelay = 5000         // starts at 5s, backs off on repeated failures

// ── STARTUP ──────────────────────────────────────────────────

async function main() {
  console.log('🟠 Satoshi Stop Loss Monitor starting...')
  await loadPatoshiAddresses()
  connectWebSocket()
  // Also poll mempool every 10 minutes for unconfirmed transactions
  setInterval(checkMempool, 10 * 60 * 1000)
}

// ── LOAD ADDRESSES ───────────────────────────────────────────

async function loadPatoshiAddresses() {
  console.log('📋 Loading Patoshi addresses from Supabase...')

  const { data, error } = await supabase
    .from('patoshi_addresses')
    .select('address')

  if (error) {
    console.error('❌ Failed to load addresses:', error.message)
    process.exit(1)
  }

  patoshiAddresses = new Set(data.map(row => row.address))
  console.log(`✅ Loaded ${patoshiAddresses.size} Patoshi addresses into memory`)

  if (patoshiAddresses.size === 0) {
    console.warn('⚠️  No addresses loaded! Load the Patoshi address database first.')
    console.warn('   See data/README.md for instructions.')
  }
}

// ── WEBSOCKET CONNECTION ──────────────────────────────────────

function connectWebSocket() {
  console.log('🔌 Connecting to mempool.space websocket...')

  const ws = new WebSocket('wss://mempool.space/api/v1/ws')

  ws.on('open', () => {
    console.log('✅ Connected to mempool.space')
    wsReconnectDelay = 5000 // reset backoff on success

    // Subscribe to new blocks
    ws.send(JSON.stringify({ action: 'want', data: ['blocks'] }))
  })

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString())

      // New block arrived
      if (msg.block) {
        const block = msg.block
        console.log(`📦 New block: ${block.height} (${block.id.slice(0, 12)}...)`)

        if (!isProcessing) {
          await processBlock(block.id, block.height)
        }
      }
    } catch (err) {
      console.error('Error parsing websocket message:', err.message)
    }
  })

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message)
  })

  ws.on('close', () => {
    console.warn(`⚠️  WebSocket closed. Reconnecting in ${wsReconnectDelay / 1000}s...`)
    setTimeout(() => {
      wsReconnectDelay = Math.min(wsReconnectDelay * 2, 60000) // max 60s backoff
      connectWebSocket()
    }, wsReconnectDelay)
  })
}

// ── PROCESS BLOCK ────────────────────────────────────────────

async function processBlock(blockHash, blockHeight) {
  if (blockHash === lastBlockHash) return // already processed
  lastBlockHash = blockHash
  isProcessing = true

  try {
    console.log(`🔍 Scanning block ${blockHeight} for Patoshi transactions...`)

    // mempool.space paginates at 25 txs — fetch all pages
    let startIndex = 0
    let foundAny   = false

    while (true) {
      const url = `https://mempool.space/api/block/${blockHash}/txs/${startIndex}`
      const res = await fetch(url)

      if (!res.ok) {
        if (res.status === 404 && startIndex > 0) break // no more pages
        console.error(`Failed to fetch txs at index ${startIndex}: ${res.status}`)
        break
      }

      const txs = await res.json()
      if (!txs || txs.length === 0) break

      for (const tx of txs) {
        const match = findPatoshiInput(tx)
        if (match) {
          console.log(`🚨 PATOSHI MATCH: ${match.address} in tx ${tx.txid}`)
          await handlePatoshiMovement(tx, match, blockHeight)
          foundAny = true
        }
      }

      if (txs.length < 25) break // last page
      startIndex += 25
    }

    if (!foundAny) {
      console.log(`   ✓ Block ${blockHeight}: No Patoshi movement`)
    }
  } catch (err) {
    console.error('Error processing block:', err.message)
  } finally {
    isProcessing = false
  }
}

// ── CHECK MEMPOOL (unconfirmed txs) ──────────────────────────

async function checkMempool() {
  try {
    const res = await fetch('https://mempool.space/api/mempool/recent')
    if (!res.ok) return

    const txs = await res.json()
    for (const tx of txs) {
      // Recent mempool txs have limited data — fetch full tx for input details
      const match = findPatoshiInput(tx)
      if (match) {
        // Fetch full transaction for complete input data
        const fullRes = await fetch(`https://mempool.space/api/tx/${tx.txid}`)
        if (fullRes.ok) {
          const fullTx = await fullRes.json()
          const fullMatch = findPatoshiInput(fullTx)
          if (fullMatch) {
            console.log(`🚨 MEMPOOL MATCH: ${fullMatch.address} in unconfirmed tx ${fullTx.txid}`)
            await handlePatoshiMovement(fullTx, fullMatch, null)
          }
        }
      }
    }
  } catch (err) {
    // Mempool check is best-effort, don't crash on failure
    console.error('Mempool check error:', err.message)
  }
}

// ── FIND PATOSHI INPUT ───────────────────────────────────────

function findPatoshiInput(tx) {
  if (!tx.vin) return null

  for (const input of tx.vin) {
    // Skip coinbase transactions
    if (input.is_coinbase) continue

    const address = input.prevout?.scriptpubkey_address
    if (address && patoshiAddresses.has(address)) {
      const amountSats = input.prevout?.value || 0
      return { address, amountSats }
    }
  }

  return null
}

// ── HANDLE PATOSHI MOVEMENT ───────────────────────────────────

async function handlePatoshiMovement(tx, match, blockHeight) {
  try {
    // Check if we've already alerted for this txid
    const { data: existing } = await supabase
      .from('alert_log')
      .select('id')
      .eq('txid', tx.txid)
      .single()

    if (existing) {
      console.log(`   Already alerted for ${tx.txid}, skipping`)
      return
    }

    // Log the alert
    const { error: logError } = await supabase
      .from('alert_log')
      .insert({
        patoshi_address: match.address,
        txid: tx.txid,
        amount_sats: match.amountSats,
        block_height: blockHeight,
      })

    if (logError) {
      console.error('Failed to log alert:', logError.message)
    }

    // Update stats
    await supabase
      .from('stats')
      .update({ value: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('key', 'last_movement')

    await supabase
      .from('stats')
      .update({ value: tx.txid, updated_at: new Date().toISOString() })
      .eq('key', 'last_txid')

    // Fetch confirmed subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('email, unsubscribe_token, threshold_sats')
      .eq('confirmed', true)

    if (subError || !subscribers) {
      console.error('Failed to fetch subscribers:', subError?.message)
      return
    }

    // Get current total BTC estimate from stats
    const { data: statsRow } = await supabase
      .from('stats')
      .select('value')
      .eq('key', 'total_btc_estimate')
      .single()

    const totalBtcRemaining = Number(statsRow?.value || 1100000).toLocaleString()

    // Send emails
    let notified = 0
    for (const sub of subscribers) {
      // Apply threshold filter
      if (sub.threshold_sats > 0 && match.amountSats < sub.threshold_sats) {
        continue
      }

      try {
        await sendAlertEmail({
          email: sub.email,
          unsubscribeToken: sub.unsubscribe_token,
          address: match.address,
          txid: tx.txid,
          amountSats: match.amountSats,
          totalBtcRemaining,
        })
        notified++
      } catch (emailErr) {
        console.error(`Failed to email ${sub.email}:`, emailErr.message)
      }
    }

    // Update alert log with notified count
    await supabase
      .from('alert_log')
      .update({ subscribers_notified: notified })
      .eq('txid', tx.txid)

    console.log(`✅ Alerted ${notified} subscribers for ${tx.txid}`)
  } catch (err) {
    console.error('Error handling Patoshi movement:', err.message)
  }
}

// ── EMAIL ────────────────────────────────────────────────────

async function sendAlertEmail({ email, unsubscribeToken, address, txid, amountSats, totalBtcRemaining }) {
  const btcMoved     = (amountSats / 100_000_000).toFixed(8)
  const explorerUrl  = `https://mempool.space/tx/${txid}`
  const unsubscribeUrl = `${SITE_URL}/preferences?token=${unsubscribeToken}`

  await resend.emails.send({
    from: `Satoshi Stop Loss <${FROM_EMAIL}>`,
    to: email,
    subject: '⚠️ Satoshi Stop Loss: Patoshi Wallet Movement Detected',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="background:#0a0a0a;color:#e5e5e5;font-family:sans-serif;padding:40px 20px;margin:0;">
        <div style="max-width:520px;margin:0 auto;">
          <div style="background:#1a0a00;border:1px solid #F7931A33;border-radius:12px;padding:24px;margin-bottom:32px;">
            <div style="font-size:24px;margin-bottom:8px;">⚠️</div>
            <h1 style="font-size:20px;font-weight:700;color:#F7931A;margin:0 0 4px;">
              Patoshi Wallet Movement Detected
            </h1>
            <p style="color:#888;font-size:13px;margin:0;">
              A wallet attributed to the Patoshi mining pattern has broadcast a transaction.
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#555;font-size:13px;">Address</td>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#ccc;font-size:13px;text-align:right;font-family:monospace;word-break:break-all;">${address}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#555;font-size:13px;">Amount moved</td>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#F7931A;font-size:13px;text-align:right;font-weight:700;">${btcMoved} BTC</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#555;font-size:13px;">Remaining in Patoshi set</td>
              <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;color:#ccc;font-size:13px;text-align:right;">~${totalBtcRemaining} BTC</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#555;font-size:13px;">Transaction ID</td>
              <td style="padding:10px 0;color:#ccc;font-size:13px;text-align:right;font-family:monospace;">${txid.slice(0, 20)}...</td>
            </tr>
          </table>

          <a href="${explorerUrl}"
             style="display:block;text-align:center;background:#F7931A;color:#000;font-weight:700;font-size:14px;padding:14px 28px;border-radius:8px;text-decoration:none;margin-bottom:32px;">
            View on mempool.space →
          </a>

          <div style="padding:16px;background:#111;border-radius:8px;margin-bottom:24px;">
            <p style="color:#555;font-size:12px;margin:0;line-height:1.6;">
              Attribution based on Lerner's Patoshi pattern research. Not cryptographic proof.
              Verify independently before acting on this information.
            </p>
          </div>

          <p style="color:#333;font-size:12px;text-align:center;">
            <a href="${unsubscribeUrl}" style="color:#444;text-decoration:underline;">Unsubscribe</a>
            &nbsp;·&nbsp; Satoshi Stop Loss &nbsp;·&nbsp; nput.foundation
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

// ── RUN ──────────────────────────────────────────────────────

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
