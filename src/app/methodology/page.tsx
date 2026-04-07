import Link from 'next/link'

export const metadata = {
  title: 'Methodology — Satoshi Stop Loss',
  description:
    'How we identify Patoshi wallets, the science behind Lerner\'s research, quantum computing risks to early Bitcoin addresses, and the provenance of our address list.',
}

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── HEADER ── */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-bitcoin text-xl font-bold">₿</span>
            <span className="text-sm font-semibold tracking-wide text-white/70">Satoshi Stop Loss</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* ── TITLE ── */}
        <div className="mb-16">
          <div className="text-xs text-bitcoin font-medium uppercase tracking-wider mb-4">Methodology</div>
          <h1 className="text-4xl font-bold mb-6">How we watch Satoshi&apos;s wallets</h1>
          <p className="text-white/50 text-lg leading-relaxed">
            Everything we do is based on publicly verifiable on-chain data and open research.
            This page explains where the address list comes from, how our monitor works,
            and why quantum computing adds an independent urgency to watching these wallets.
          </p>
        </div>

        <Divider />

        {/* ── SECTION 1: THE PATOSHI PATTERN ── */}
        <Section id="patoshi">
          <SectionLabel>01 — The Patoshi pattern</SectionLabel>
          <h2 className="text-2xl font-bold mb-6">Sergio Lerner&apos;s forensic breakthrough</h2>

          <p className="text-white/50 leading-relaxed mb-4">
            In 2013, Argentinian cryptographer Sergio Demian Lerner published a series of blog posts
            that changed how the Bitcoin community understood its own early history. By analysing the
            <code className="mx-1 px-1.5 py-0.5 bg-white/5 rounded text-bitcoin text-sm">nExtraNonce</code>
            field in coinbase transactions — a counter that increments each time a miner restarts their
            mining software — he found a highly distinctive pattern.
          </p>

          <p className="text-white/50 leading-relaxed mb-4">
            One miner, mining from approximately block 1 through to block 54,000 (spanning 2009–2010),
            had a consistent and unique nonce fingerprint unlike any other. This miner never
            shared hash rate with others, ran software that incremented nonces in a specific range,
            and mined with extraordinary consistency. Lerner named this entity &quot;Patoshi&quot;
            — a portmanteau of &quot;pattern&quot; and &quot;Satoshi.&quot;
          </p>

          <p className="text-white/50 leading-relaxed mb-6">
            Crucially, this is probabilistic forensics — not cryptographic proof. The pattern is
            compelling enough that the research is widely cited and accepted within the Bitcoin
            research community, but it is not mathematically certain that Patoshi is Satoshi Nakamoto.
            It is the best evidence available.
          </p>

          <Callout>
            Lerner&apos;s analysis identified approximately 22,000 blocks attributed to the Patoshi
            miner, with an estimated coinbase reward of around 1,100,000 BTC — none of which has
            ever moved.
          </Callout>

          <div className="mt-6">
            <ExternalLink
              href="https://bitslog.com/2013/04/17/the-well-deserved-fortune-of-satoshi-nakamoto/"
              label="Primary source"
              title="The Well Deserved Fortune of Satoshi Nakamoto — bitslog.com"
            />
            <ExternalLink
              href="https://bitslog.com/2019/04/16/the-patoshi-mining-machine/"
              label="Updated analysis (2019)"
              title="The Patoshi Mining Machine — bitslog.com"
            />
          </div>
        </Section>

        <Divider />

        {/* ── SECTION 2: ADDRESS LIST ── */}
        <Section id="addresses">
          <SectionLabel>02 — The address list</SectionLabel>
          <h2 className="text-2xl font-bold mb-6">Where our 21,953 addresses come from</h2>

          <p className="text-white/50 leading-relaxed mb-4">
            Each Patoshi-attributed block contains a coinbase transaction with an output that pays to
            a specific public key. These public keys are embedded directly in the
            <code className="mx-1 px-1.5 py-0.5 bg-white/5 rounded text-bitcoin text-sm">scriptPubKey</code>
            field of the output — a format called Pay-to-Public-Key (P2PK), which was used in the
            very earliest Bitcoin transactions before the more common Pay-to-Public-Key-Hash (P2PKH)
            format was introduced.
          </p>

          <p className="text-white/50 leading-relaxed mb-4">
            Because the public key is embedded directly in the script (rather than its hash),
            these public keys have always been visible to anyone reading the blockchain — a fact
            that becomes significant when considering quantum risk.
          </p>

          <p className="text-white/50 leading-relaxed mb-4">
            Developer Ben Sigman compiled these public keys into an open-source dataset:
            <a
              href="https://github.com/bensig/patoshi-addresses"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-bitcoin hover:text-bitcoin/80 transition-colors"
            >
              github.com/bensig/patoshi-addresses ↗
            </a>. This is the dataset we use.
          </p>

          <p className="text-white/50 leading-relaxed mb-6">
            To convert those public keys into standard Bitcoin addresses, we apply the
            canonical derivation:
          </p>

          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-5 font-mono text-xs text-white/60 mb-6 space-y-1">
            <div><span className="text-white/20">// Step 1:</span> SHA-256 hash of the public key bytes</div>
            <div className="text-green-400">sha256_hash = SHA256(pubkey_bytes)</div>
            <div className="mt-2"><span className="text-white/20">// Step 2:</span> RIPEMD-160 hash of that result</div>
            <div className="text-green-400">ripemd_hash = RIPEMD160(sha256_hash)</div>
            <div className="mt-2"><span className="text-white/20">// Step 3:</span> Prepend mainnet version byte (0x00)</div>
            <div className="text-green-400">payload = 0x00 + ripemd_hash</div>
            <div className="mt-2"><span className="text-white/20">// Step 4:</span> Double SHA-256 checksum + Base58Check encode</div>
            <div className="text-bitcoin">address = Base58Check(payload)</div>
          </div>

          <p className="text-white/50 leading-relaxed mb-6">
            The resulting addresses are standard Bitcoin P2PKH addresses beginning with &quot;1&quot;.
            Our full derivation script is reproducible — anyone can run it against the same source
            data and arrive at the same 21,953 addresses.
          </p>

          <div className="mt-2">
            <ExternalLink
              href="https://github.com/bensig/patoshi-addresses"
              label="Source dataset"
              title="bensig/patoshi-addresses — GitHub"
            />
          </div>
        </Section>

        <Divider />

        {/* ── SECTION 3: THE MONITOR ── */}
        <Section id="monitor">
          <SectionLabel>03 — How the monitor works</SectionLabel>
          <h2 className="text-2xl font-bold mb-6">Real-time, block-by-block surveillance</h2>

          <p className="text-white/50 leading-relaxed mb-4">
            Our monitor runs 24/7 on a dedicated server and connects to the
            <a
              href="https://mempool.space"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-bitcoin hover:text-bitcoin/80 transition-colors"
            >
              mempool.space ↗
            </a>
            websocket API — the same infrastructure used by Bitcoin developers and block explorers
            worldwide.
          </p>

          <p className="text-white/50 leading-relaxed mb-4">
            When a new block is confirmed, we fetch every transaction in that block and scan its
            inputs. A transaction input contains a reference to a previous output — if any of those
            referenced outputs belong to a Patoshi address, we have a match.
          </p>

          <p className="text-white/50 leading-relaxed mb-4">
            We also poll the unconfirmed mempool every 10 minutes, meaning we can detect a Patoshi
            spend before it even confirms into a block — typically 2–8 minutes faster than waiting
            for confirmation.
          </p>

          <div className="grid grid-cols-2 gap-4 my-8">
            <MetricBox label="Addresses in memory" value="21,953" />
            <MetricBox label="Address lookup time" value="O(1)" sub="hash set" />
            <MetricBox label="Block scan latency" value="&lt; 30s" sub="after block confirmation" />
            <MetricBox label="Mempool polling" value="Every 10 min" sub="unconfirmed txs" />
          </div>

          <p className="text-white/50 leading-relaxed">
            All 21,953 addresses are held in memory as a hash set, so each transaction input
            lookup is constant-time regardless of how many addresses we watch. False positives are
            impossible — a match requires the input to reference a UTXO held by an exact Patoshi address.
          </p>
        </Section>

        <Divider />

        {/* ── SECTION 4: QUANTUM ── */}
        <Section id="quantum">
          <SectionLabel>04 — The quantum threat</SectionLabel>
          <h2 className="text-2xl font-bold mb-6">Why Patoshi&apos;s wallets face a unique quantum risk</h2>

          <p className="text-white/50 leading-relaxed mb-4">
            Bitcoin&apos;s security rests on two layers of cryptography: the elliptic curve
            discrete logarithm problem (ECDLP), which protects private keys, and SHA-256 / RIPEMD-160
            hashing, which hides public keys in modern addresses. Patoshi&apos;s wallets only have the first layer.
          </p>

          <p className="text-white/50 leading-relaxed mb-4">
            Because Patoshi mined using the early P2PK output format, the raw public keys are
            permanently visible on the blockchain — there is no hash obscuring them. This matters
            because Shor&apos;s algorithm, running on a sufficiently powerful quantum computer, can
            theoretically derive a private key directly from its corresponding public key. With
            the public key already exposed, Patoshi&apos;s coins skip the only step that would
            otherwise protect them.
          </p>

          <Callout color="red">
            Modern Bitcoin addresses that have never sent a transaction are partially protected
            because their public key is hidden behind a SHA-256 + RIPEMD-160 hash. Patoshi&apos;s
            P2PK outputs have no such protection — the public keys are permanently on-chain.
          </Callout>

          <h3 className="text-lg font-semibold mt-8 mb-3">How far away is this threat?</h3>
          <p className="text-white/50 leading-relaxed mb-4">
            Closer than most people think. Industry roadmaps — led by IBM, Google, Microsoft, Amazon,
            and Intel — suggest quantum computers may be capable of breaking ECDSA cryptography
            in as little as 2–5 years. The US federal government has issued a mandate to phase out
            ECDSA entirely by 2035.
          </p>
          <p className="text-white/50 leading-relaxed mb-4">
            Even accepting the most optimistic timeline, a Bitcoin-wide response would require changes
            at the protocol level, the software level, the infrastructure level, and ultimately
            user-level key migrations — a process that takes years in a decentralised network.
            The window to act is narrower than the countdown to the threat itself.
          </p>
          <p className="text-white/50 leading-relaxed">
            For Patoshi&apos;s wallets specifically, no migration is possible without the private keys.
            If Satoshi is unable or unwilling to move the coins to quantum-resistant addresses before
            a capable quantum computer exists, those keys become permanently vulnerable. A state actor
            or well-resourced private entity cracking one would produce a transaction indistinguishable
            from a voluntary Satoshi spend — and our monitor would fire either way.
          </p>

          <div className="mt-6">
            <ExternalLink
              href="https://en.wikipedia.org/wiki/Shor%27s_algorithm"
              label="Background"
              title="Shor's algorithm — Wikipedia"
            />
            <ExternalLink
              href="https://www2.deloitte.com/us/en/pages/consulting/articles/quantum-risk-to-bitcoin.html"
              label="Risk analysis"
              title="Quantum risk to Bitcoin — Deloitte"
            />
          </div>
        </Section>

        <Divider />

        {/* ── SECTION 5: CAVEATS ── */}
        <Section id="caveats">
          <SectionLabel>05 — Honest caveats</SectionLabel>
          <h2 className="text-2xl font-bold mb-6">What this is — and isn&apos;t</h2>

          <div className="space-y-4">
            <CaveatRow
              title="Patoshi ≠ Satoshi (probably, but not certainly)"
              body="The Patoshi pattern is the strongest evidence we have, but it is forensic analysis, not cryptographic proof. It is possible — though unlikely — that Patoshi was a different early miner."
            />
            <CaveatRow
              title="We monitor spending, not receiving"
              body="Our system only fires when a Patoshi address is used as a transaction input (i.e., spending coins). People can and do send dust or small amounts to Patoshi addresses — we ignore all of that."
            />
            <CaveatRow
              title="A move isn't necessarily Satoshi"
              body="If an alert fires, it means a private key was used — but we can't tell you whether it was Satoshi, an heir, a hacker, or a quantum computer. The alert tells you a move happened, not why."
            />
            <CaveatRow
              title="Address list completeness"
              body="Our 21,953 addresses are derived from the bensig dataset, itself based on Lerner's block attribution research. Blocks at the edge of the Patoshi pattern are less certain, and future research may add or remove addresses."
            />
          </div>
        </Section>

        <Divider />

        {/* ── CTA ── */}
        <div className="text-center py-8">
          <p className="text-white/40 text-sm mb-6">
            You&apos;ve read the methodology. Now make sure you&apos;re on the list.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-bitcoin hover:bg-bitcoin/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Get the alert →
          </Link>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/20">
          <span>© 2026 Satoshi Stop Loss · nput.foundation</span>
          <span>Attribution based on Lerner&apos;s Patoshi pattern research — not cryptographic proof.</span>
        </div>
      </footer>

    </main>
  )
}

// ── COMPONENTS ───────────────────────────────────────────────

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-12">
      {children}
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs text-white/20 font-medium uppercase tracking-widest mb-3">{children}</div>
  )
}

function Divider() {
  return <hr className="border-white/5" />
}

function Callout({ children, color = 'orange' }: { children: React.ReactNode; color?: 'orange' | 'red' }) {
  const styles = color === 'red'
    ? 'bg-red-950/20 border-red-500/20 text-red-200/60'
    : 'bg-bitcoin/5 border-bitcoin/20 text-white/50'
  return (
    <div className={`border rounded-xl p-5 text-sm leading-relaxed ${styles}`}>
      {children}
    </div>
  )
}

function ExternalLink({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 py-3 border-b border-white/5 hover:border-bitcoin/20 transition-colors group"
    >
      <span className="text-xs text-bitcoin/60 uppercase tracking-wider mt-0.5 min-w-[90px]">{label}</span>
      <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">{title} ↗</span>
    </a>
  )
}

function MetricBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4">
      <div className="text-xs text-white/30 mb-1">{label}</div>
      <div className="text-lg font-bold text-bitcoin">{value}</div>
      {sub && <div className="text-xs text-white/20 mt-0.5">{sub}</div>}
    </div>
  )
}

function CaveatRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-white/5 rounded-xl p-5">
      <div className="text-sm font-semibold text-white/80 mb-2">{title}</div>
      <p className="text-sm text-white/40 leading-relaxed">{body}</p>
    </div>
  )
}
