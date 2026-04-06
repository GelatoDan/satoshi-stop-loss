/**
 * index.js — The Vigil minting page
 *
 * Structure:
 *   1. Nav (logo + connect button)
 *   2. Hero — dormancy counter (the emotional core)
 *   3. Minting section
 *   4. What is The Vigil (lore + utility)
 *   5. Tier breakdown
 *   6. FAQ
 *   7. Footer (SSL link)
 */

import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DormancyCounter from "../components/DormancyCounter";
import MintSection     from "../components/MintSection";

const FAQ_ITEMS = [
  {
    q: "Is minting free?",
    a: "Yes. The Vigil is a free mint on Base. You pay only the gas fee, which is typically under $0.02 on Base.",
  },
  {
    q: "What is Tier A vs Tier B?",
    a: "The first 500 Vigils minted are Tier A (Genesis). They grant a permanent 20% discount on Satoshi Stop Loss protocol enrollment premiums. Vigils 501–2,100 are Tier B, carrying a permanent 10% discount. The discount follows the NFT — it transfers when you sell.",
  },
  {
    q: "What happens when Satoshi moves?",
    a: "Every Vigil NFT transforms simultaneously — the artwork shifts to The Reckoning state. A 72-hour governance vote opens where holders choose between two art variants: The Storm or The Dawn. Tier A holders receive an SSL token airdrop from protocol treasury. And if you've enrolled assets in the SSL protocol, your vault executes automatically.",
  },
  {
    q: "How does the discount work on SSL?",
    a: "When you enroll assets in an SSL vault, the smart contract calls getDiscount(yourAddress) on the Vigil contract. If you hold a Vigil, it applies the corresponding discount to your enrollment premium automatically — no codes, no claims.",
  },
  {
    q: "Can I hold more than one Vigil?",
    a: "Yes, up to 2 per wallet. Holding 2 doesn't stack the discount, but it gives you more governance voting weight when The Reckoning arrives.",
  },
  {
    q: "What is Satoshi Stop Loss?",
    a: "SSL is a non-custodial DeFi protocol that automatically liquidates your crypto positions the moment any known Satoshi Nakamoto wallet spends a UTXO on Bitcoin. You pre-configure your output asset and destination. SSL handles the rest.",
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>The Vigil — Watch with us</title>
        <meta name="description" content="2,100 Watchers. One question. When will Satoshi move? Free mint on Base. Permanent SSL protocol discounts." />
        <meta property="og:title"       content="The Vigil — Watch with us" />
        <meta property="og:description" content="2,100 Watchers standing guard until Satoshi moves. Free mint on Base." />
        <meta property="og:image"       content="https://thevigilnft.xyz/og-image.png" />
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content="The Vigil — Watch with us" />
        <meta name="twitter:description" content="2,100 Watchers. One question. When will Satoshi move?" />
        <meta name="twitter:image"      content="https://thevigilnft.xyz/og-image.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ==============================
            NAV
        ============================== */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
          style={{
            backgroundColor: "rgba(8,8,8,0.85)",
            backdropFilter:   "blur(12px)",
            borderBottom:     "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="font-medium tracking-widest text-sm"
            style={{ color: "var(--gold)", letterSpacing: "0.3em" }}
          >
            THE VIGIL
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://satoshistoploss.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:opacity-80 transition-opacity"
              style={{ color: "var(--text-dim)", letterSpacing: "0.15em" }}
            >
              SSL PROTOCOL ↗
            </a>
            <ConnectButton
              chainStatus="none"
              showBalance={false}
              accountStatus="address"
            />
          </div>
        </nav>

        {/* ==============================
            HERO — DORMANCY COUNTER
        ============================== */}
        <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4">

          {/* Star field — pure CSS */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: -1 }}
            aria-hidden="true"
          >
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position:        "absolute",
                  width:           `${Math.random() * 2 + 1}px`,
                  height:          `${Math.random() * 2 + 1}px`,
                  borderRadius:    "50%",
                  backgroundColor: "#C0A060",
                  left:            `${Math.random() * 100}%`,
                  top:             `${Math.random() * 100}%`,
                  opacity:         Math.random() * 0.4 + 0.1,
                  animation:       `twinkle ${Math.random() * 4 + 3}s ease-in-out ${Math.random() * 5}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Eyebrow */}
          <div
            className="mb-12 text-xs tracking-widest"
            style={{ color: "var(--text-dim)", letterSpacing: "0.4em" }}
          >
            SATOSHI STOP LOSS — THE VIGIL COLLECTION
          </div>

          {/* Counter */}
          <DormancyCounter />

          {/* Down arrow */}
          <div className="mt-16" style={{ color: "var(--gold-dim)", fontSize: "1.2rem", opacity: 0.6 }}>
            ↓
          </div>
        </section>

        {/* ==============================
            MINT SECTION
        ============================== */}
        <section id="mint" className="py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">

            <div
              className="mb-3 text-xs tracking-widest"
              style={{ color: "var(--text-dim)", letterSpacing: "0.35em" }}
            >
              FREE MINT · BASE NETWORK
            </div>

            <h2
              className="mb-4 font-light"
              style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "var(--text-primary)", letterSpacing: "-0.01em" }}
            >
              Take the Oath
            </h2>

            <p
              className="mb-12 max-w-lg mx-auto"
              style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: "0.9rem" }}
            >
              2,100 Watchers. Each one a permanent member of the Satoshi Stop Loss
              protocol — with a standing discount, governance rights, and a front-row
              seat to the most consequential event in crypto history.
            </p>

            <MintSection />
          </div>
        </section>

        {/* ==============================
            UTILITY — WHAT YOU GET
        ============================== */}
        <section className="py-24 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-4xl mx-auto">

            <div className="text-center mb-16">
              <div className="mb-3 text-xs tracking-widest" style={{ color: "var(--text-dim)", letterSpacing: "0.35em" }}>
                NOT JUST AN NFT
              </div>
              <h2 className="font-light" style={{ fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-0.01em" }}>
                What your Vigil does
              </h2>
            </div>

            {/* Tier cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">

              {/* Tier A */}
              <div
                className="p-8 rounded-sm"
                style={{
                  background:   "linear-gradient(135deg, rgba(122,100,56,0.15), rgba(192,160,96,0.06))",
                  border:       "1px solid rgba(192,160,96,0.25)",
                }}
              >
                <div className="mb-1 text-xs tracking-widest" style={{ color: "var(--gold)", letterSpacing: "0.3em" }}>
                  TIER A — GENESIS
                </div>
                <div className="mb-6 text-xs" style={{ color: "var(--text-dim)" }}>
                  Token IDs 1–500
                </div>

                <ul className="space-y-4">
                  {[
                    ["20%", "permanent SSL enrollment discount — follows the NFT on transfer"],
                    ["Priority", "guaranteed whitelist for SSL token TGE"],
                    ["Beta",     "closed beta vault access before public launch"],
                    ["Vote",     "1 vote per NFT in protocol governance"],
                    ["Airdrop",  "SSL token airdrop from treasury if The Reckoning triggers"],
                  ].map(([label, text]) => (
                    <li key={label} className="flex gap-3">
                      <span
                        className="text-xs font-semibold shrink-0 mt-0.5"
                        style={{ color: "var(--gold)", minWidth: "60px" }}
                      >
                        {label}
                      </span>
                      <span className="text-sm" style={{ color: "var(--text-dim)", lineHeight: 1.6 }}>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tier B */}
              <div
                className="p-8 rounded-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border:          "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="mb-1 text-xs tracking-widest" style={{ color: "var(--text-dim)", letterSpacing: "0.3em" }}>
                  TIER B — VIGIL
                </div>
                <div className="mb-6 text-xs" style={{ color: "var(--text-dim)" }}>
                  Token IDs 501–2,100
                </div>

                <ul className="space-y-4">
                  {[
                    ["10%",      "permanent SSL enrollment discount — follows the NFT on transfer"],
                    ["Priority", "priority access to SSL token sale ahead of public"],
                    ["Beta",     "public beta access before general release"],
                    ["Vote",     "1 vote per NFT in protocol governance"],
                    ["Witness",  "front-row seat when The Reckoning is declared"],
                  ].map(([label, text]) => (
                    <li key={label} className="flex gap-3">
                      <span
                        className="text-xs font-semibold shrink-0 mt-0.5"
                        style={{ color: "var(--gold-dim)", minWidth: "60px" }}
                      >
                        {label}
                      </span>
                      <span className="text-sm" style={{ color: "var(--text-dim)", lineHeight: 1.6 }}>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The Reckoning callout */}
            <div
              className="p-8 rounded-sm text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border:          "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="mb-4 text-xs tracking-widest" style={{ color: "var(--gold)", letterSpacing: "0.3em" }}>
                THE RECKONING
              </div>
              <p className="max-w-2xl mx-auto" style={{ color: "var(--text-dim)", lineHeight: 1.8, fontSize: "0.9rem" }}>
                If Satoshi ever moves, all 2,100 Vigils transform simultaneously.
                The artwork shifts. A governance vote opens. Holders decide the final
                form together. Every Vigil becomes a permanent artifact of the most
                significant moment in crypto history — proof that you were watching
                when it happened.
              </p>
            </div>
          </div>
        </section>

        {/* ==============================
            FAQ
        ============================== */}
        <section className="py-24 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-light" style={{ fontSize: "clamp(22px, 4vw, 36px)" }}>
                Questions
              </h2>
            </div>

            <div className="space-y-0">
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ==============================
            FOOTER
        ============================== */}
        <footer
          className="py-12 px-4 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="mb-4 text-xs tracking-widest font-medium"
            style={{ color: "var(--gold)", letterSpacing: "0.3em" }}
          >
            THE VIGIL
          </div>
          <div className="text-xs space-x-6" style={{ color: "var(--text-dim)" }}>
            <a
              href="https://satoshistoploss.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              SSL Protocol
            </a>
            <a
              href="https://twitter.com/thevigilnft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Twitter / X
            </a>
            <a
              href="https://discord.gg/thevigilnft"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Discord
            </a>
          </div>
          <div className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
            The Vigil NFT grants protocol utility in the SSL ecosystem. Not an investment. No promises.
          </div>
        </footer>

      </div>
    </>
  );
}

// =========================================================
// FAQ Item component
// =========================================================

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <button
        className="w-full text-left py-5 flex items-center justify-between gap-4"
        onClick={() => setOpen(o => !o)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span className="text-sm" style={{ color: "var(--text-primary)", lineHeight: 1.5 }}>
          {q}
        </span>
        <span
          style={{
            color:      "var(--gold-dim)",
            fontSize:   "1rem",
            flexShrink: 0,
            transform:  open ? "rotate(45deg)" : "none",
            transition: "transform 0.2s ease",
          }}
        >
          +
        </span>
      </button>

      {open && (
        <div
          className="pb-5 text-sm"
          style={{ color: "var(--text-dim)", lineHeight: 1.8 }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// Need useState imported for FAQItem
import { useState } from "react";
