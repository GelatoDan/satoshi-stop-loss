'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalBtc: string
  addressCount: string
  lastMovement: string
  subscriberCount?: number
}

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [threshold, setThreshold] = useState('any')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [stats, setStats] = useState<Stats>({
    totalBtc: '1,100,000',
    addressCount: '—',
    lastMovement: 'Never confirmed',
  })

  // Fetch live stats on load and every 5 minutes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch {
        // silently fail — static values remain displayed
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, threshold }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  const btcPrice = 85000 // approximate — displayed for context only
  const totalUsd = (parseFloat(stats.totalBtc.replace(/,/g, '')) * btcPrice).toLocaleString()

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ── */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-bitcoin text-xl font-bold">₿</span>
            <span className="text-sm font-semibold tracking-wide text-white/70">
              Satoshi Stop Loss
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            <span className="text-xs text-white/40">Monitoring live</span>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-bitcoin/10 border border-bitcoin/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-bitcoin animate-pulse-slow" />
          <span className="text-xs text-bitcoin font-medium tracking-wide">
            {stats.addressCount !== '—' ? `${Number(stats.addressCount).toLocaleString()}` : '22,000+'} Patoshi wallets monitored
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
          Know the moment<br />
          <span className="text-bitcoin">Satoshi moves.</span>
        </h1>

        <p className="text-lg text-white/50 max-w-xl mx-auto mb-4">
          We watch every address in the Patoshi mining pattern — the wallets
          attributed to Satoshi Nakamoto — and alert you the instant any of
          them broadcast a transaction.
        </p>
        <p className="text-sm text-white/30 max-w-lg mx-auto mb-14">
          Attribution is based on Sergio Demian Lerner&#39;s Patoshi pattern research.
          Not cryptographic proof — but the best evidence we have.
        </p>

        {/* ── STATS BAR ── */}
        <div className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden mb-14 max-w-2xl mx-auto">
          <StatCard
            label="BTC at stake"
            value={`~${Number(stats.totalBtc.replace(/,/g, '')).toLocaleString()}`}
            sub={`≈ $${totalUsd} USD`}
          />
          <StatCard
            label="Last movement"
            value={stats.lastMovement}
            sub="No confirmed Patoshi spend"
          />
          <StatCard
            label="Addresses watched"
            value={stats.addressCount !== '—' ? Number(stats.addressCount).toLocaleString() : '22,000+'}
            sub="Full Patoshi pattern"
          />
        </div>

        {/* ── SIGNUP FORM ── */}
        {status === 'success' ? (
          <div className="max-w-md mx-auto bg-green-950/40 border border-green-500/20 rounded-2xl p-8">
            <div className="text-3xl mb-3">✓</div>
            <h2 className="text-xl font-semibold text-green-400 mb-2">Check your email</h2>
            <p className="text-white/50 text-sm">
              We sent a confirmation link to <strong className="text-white/70">{email}</strong>.
              Click it to activate your alert. You&#39;ll be among the first to know.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white/3 border border-white/8 rounded-2xl p-8 text-left"
          >
            <h2 className="text-lg font-semibold mb-1">Get the alert</h2>
            <p className="text-sm text-white/40 mb-6">Free. One email to confirm. Unsubscribe any time.</p>

            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-bitcoin/50 mb-4"
            />

            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
              Alert threshold
            </label>
            <select
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-bitcoin/50 mb-6"
            >
              <option value="any">Alert me on any Patoshi movement</option>
              <option value="1000000">Only if &gt;1,000,000 sats move (~0.01 BTC)</option>
              <option value="10000000">Only if &gt;10,000,000 sats move (~0.1 BTC)</option>
              <option value="100000000">Only if &gt;100,000,000 sats move (~1 BTC)</option>
            </select>

            {errorMsg && (
              <p className="text-red-400 text-sm mb-4">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-bitcoin hover:bg-bitcoin-dark disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors text-sm"
            >
              {status === 'loading' ? 'Subscribing...' : 'Notify me when Satoshi moves →'}
            </button>
          </form>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <Step n="1" title="Sign up" body="Enter your email. Pick your threshold. Confirm in one click." />
            <Step n="2" title="We watch" body="Our monitor checks every block on the Bitcoin network against all 22,000+ Patoshi addresses, around the clock." />
            <Step n="3" title="You're first to know" body="If any Patoshi wallet moves, you get an alert with the transaction details before it hits the news." />
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="border-t border-white/5 py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Why it matters</h2>
          <p className="text-white/40 text-center text-sm max-w-xl mx-auto mb-14">
            This isn&apos;t just about one person&apos;s coins. It&apos;s about what it would signal to the world.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <WhyCard
              icon="₿"
              title="~1,100,000 BTC"
              body="Roughly 5% of all Bitcoin that will ever exist sits in wallets attributed to Satoshi. A move would be the single largest Bitcoin transfer in history — instantly."
            />
            <WhyCard
              icon="📉"
              title="Market-moving event"
              body="Bitcoin markets have never priced in a Satoshi sell. Holders, institutions, and exchanges would react within minutes. Being informed first matters."
            />
            <WhyCard
              icon="❓"
              title="The biggest open question in crypto"
              body="Is Satoshi alive? Did they lose access? Are the keys still secure? A single transaction — or the absence of one — speaks volumes."
            />
          </div>
        </div>
      </section>

      {/* ── THE SCIENCE ── */}
      <section className="border-t border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs text-bitcoin font-medium uppercase tracking-wider mb-3">The research</div>
            <h2 className="text-2xl font-bold mb-4">Built on peer-reviewed blockchain forensics</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              The Patoshi pattern was identified by cryptographer Sergio Demian Lerner in 2013.
              By analysing distinctive nonce patterns in early Bitcoin blocks, he traced approximately
              22,000 blocks — and their coinbase rewards — to a single miner now known as &quot;Patoshi.&quot;
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              The address list we monitor is derived directly from the public keys in those coinbase
              transactions, converted to standard P2PKH Bitcoin addresses. Every address is verifiable
              on-chain.
            </p>
            <a href="/methodology" className="inline-flex items-center gap-2 text-sm text-bitcoin hover:text-bitcoin/80 transition-colors font-medium">
              Read the full methodology →
            </a>
          </div>
          <div className="space-y-4">
            <SourceCard
              label="Original research"
              title="Lerner's Patoshi Pattern Analysis"
              url="https://bitslog.com/2013/04/17/the-well-deserved-fortune-of-satoshi-nakamoto/"
              description="The 2013 paper identifying the Patoshi mining pattern from nonce analysis"
            />
            <SourceCard
              label="Address database"
              title="bensig/patoshi-addresses"
              url="https://github.com/bensig/patoshi-addresses"
              description="Open-source dataset of Patoshi public keys — the source we use"
            />
            <SourceCard
              label="Block explorer"
              title="mempool.space"
              url="https://mempool.space"
              description="Real-time Bitcoin mempool and block data powering our monitor"
            />
          </div>
        </div>
      </section>

      {/* ── QUANTUM THREAT ── */}
      <section className="border-t border-white/5 py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-12 items-center">
          <div className="order-2 sm:order-1 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-4 font-mono text-xs">
            <div className="text-white/20">// Early Bitcoin address type</div>
            <div><span className="text-bitcoin">scriptPubKey</span><span className="text-white/40">: OP_CHECKSIG</span></div>
            <div className="text-white/20 mt-4">// Public key is exposed on-chain</div>
            <div><span className="text-green-400">pubKey</span><span className="text-white/40">: 04a1b2c3d4... (visible)</span></div>
            <div className="text-white/20 mt-4">// Quantum risk</div>
            <div><span className="text-red-400">Shor&apos;s algorithm</span><span className="text-white/40">: pubKey → privKey</span></div>
            <div className="text-white/20">// ECDSA secp256k1 is vulnerable</div>
          </div>
          <div className="order-1 sm:order-2">
            <div className="text-xs text-red-400 font-medium uppercase tracking-wider mb-3">Quantum risk</div>
            <h2 className="text-2xl font-bold mb-4">A second reason these wallets may move — or disappear</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              Many Patoshi outputs use an older script format (Pay-to-Public-Key) where the public key
              is directly exposed on the blockchain. Unlike modern addresses, there&apos;s no hash layer
              protecting the key.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              A sufficiently powerful quantum computer running Shor&apos;s algorithm could derive the
              private key from the exposed public key — without any cooperation from Satoshi.
              Industry roadmaps from IBM, Google, and others put this capability 2–5 years away.
              The US government has mandated phasing out ECDSA by 2035.
            </p>
            <a href="/methodology#quantum" className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors font-medium">
              Understand the quantum threat →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <span>© 2026 Satoshi Stop Loss · nput.foundation</span>
          <span>Attribution based on Lerner&#39;s Patoshi pattern research — not cryptographic proof.</span>
        </div>
      </footer>

    </main>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-[#0f0f0f] px-6 py-6">
      <div className="text-xs text-white/30 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/30">{sub}</div>
    </div>
  )
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="w-8 h-8 rounded-full border border-bitcoin/30 text-bitcoin text-sm font-bold flex items-center justify-center mb-4">
        {n}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{body}</p>
    </div>
  )
}

function WhyCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{body}</p>
    </div>
  )
}

function SourceCard({ label, title, url, description }: { label: string; title: string; url: string; description: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-[#0f0f0f] border border-white/5 hover:border-bitcoin/20 rounded-xl p-4 transition-colors group"
    >
      <div className="text-xs text-bitcoin/70 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-medium text-white group-hover:text-bitcoin transition-colors mb-1">{title} ↗</div>
      <div className="text-xs text-white/30">{description}</div>
    </a>
  )
}
