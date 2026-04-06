/**
 * DormancyCounter.jsx
 *
 * The hero element of the minting site.
 * Shows real-time days of Satoshi dormancy, the current state, and a live
 * seconds-ticking counter. This is the emotional core of the page.
 */

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.thevigilnft.xyz";

// How each state looks on screen
const STATE_CONFIG = {
  awakened: {
    label:       "AWAKENED",
    tagline:     "The vigil has just begun.",
    color:       "#A0C8A0",
    glowColor:   "rgba(160, 200, 160, 0.3)",
  },
  watching: {
    label:       "THE WATCH",
    tagline:     "Years pass. The wallets remain still.",
    color:       "#C0A060",
    glowColor:   "rgba(192, 160, 96, 0.3)",
  },
  deep_watch: {
    label:       "THE DEEP WATCH",
    tagline:     "Patience beyond human comprehension.",
    color:       "#9080C0",
    glowColor:   "rgba(144, 128, 192, 0.3)",
  },
  eternal: {
    label:       "ETERNAL VIGIL",
    tagline:     "Even the stars have moved. Satoshi has not.",
    color:       "#C0A060",
    glowColor:   "rgba(192, 160, 96, 0.5)",
  },
  reckoning: {
    label:       "THE RECKONING",
    tagline:     "It happened. The wallets have moved.",
    color:       "#E05050",
    glowColor:   "rgba(224, 80, 80, 0.5)",
  },
};

function formatNumber(n) {
  return n?.toLocaleString("en-US") ?? "—";
}

function pad(n, digits = 2) {
  return String(n).padStart(digits, "0");
}

export default function DormancyCounter() {
  const [dormancy,    setDormancy]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);

  // Fetch dormancy data from API
  useEffect(() => {
    async function fetchDormancy() {
      try {
        const res  = await fetch(`${API_URL}/dormancy`);
        const data = await res.json();
        setDormancy(data);
        // Compute seconds since last activity
        const elapsed = Math.floor(Date.now() / 1000) - data.lastActivityTimestamp;
        setLiveSeconds(elapsed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dormancy:", err);
        setError(true);
        setLoading(false);
      }
    }

    fetchDormancy();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDormancy, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Live tick — increment seconds every second
  useEffect(() => {
    if (!dormancy) return;
    const timer = setInterval(() => {
      setLiveSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [dormancy]);

  // Convert live seconds to years/days/hours/minutes/seconds
  const totalSecs    = liveSeconds;
  const liveDays     = Math.floor(totalSecs / 86400);
  const liveHours    = Math.floor((totalSecs % 86400) / 3600);
  const liveMinutes  = Math.floor((totalSecs % 3600) / 60);
  const liveSecsDisp = totalSecs % 60;

  const state       = dormancy?.state || "eternal";
  const stateConfig = STATE_CONFIG[state] || STATE_CONFIG.eternal;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-center">
        <div style={{ color: "var(--gold-dim)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
          READING THE CHAIN…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-32 text-center">
        <div style={{ color: "#E05050", fontSize: "0.8rem" }}>
          Unable to connect to oracle. The vigil continues regardless.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">

      {/* State badge */}
      <div
        className="mb-6 px-4 py-1 text-xs tracking-widest font-medium rounded-sm"
        style={{
          color:           stateConfig.color,
          border:          `1px solid ${stateConfig.color}40`,
          backgroundColor: `${stateConfig.color}12`,
          letterSpacing:   "0.35em",
        }}
      >
        {stateConfig.label}
      </div>

      {/* Days dormant — the big number */}
      <div className="mb-2">
        <span
          className="counter-digit breathe gold-glow"
          style={{
            fontSize:      "clamp(64px, 12vw, 120px)",
            fontWeight:    "200",
            color:         stateConfig.color,
            textShadow:    `0 0 60px ${stateConfig.glowColor}`,
            letterSpacing: "-0.02em",
            lineHeight:    1,
          }}
        >
          {formatNumber(liveDays)}
        </span>
      </div>

      {/* Label */}
      <div
        className="mb-10"
        style={{ color: "var(--text-dim)", letterSpacing: "0.25em", fontSize: "0.7rem" }}
      >
        DAYS SINCE SATOSHI LAST MOVED
      </div>

      {/* Seconds ticker */}
      <div
        className="font-mono text-xs mb-8 px-6 py-3 rounded-sm"
        style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border:           "1px solid rgba(255,255,255,0.06)",
          color:            "var(--text-dim)",
          letterSpacing:    "0.1em",
        }}
      >
        <span style={{ color: "var(--text-dim)" }}>
          {pad(liveHours)}:{pad(liveMinutes)}:{pad(liveSecsDisp)}{" "}
        </span>
        <span style={{ color: "var(--gold-dim)", marginLeft: "4px" }}>
          HH:MM:SS TODAY
        </span>
      </div>

      {/* State tagline */}
      <div
        className="max-w-md text-sm"
        style={{ color: "var(--text-dim)", lineHeight: 1.7 }}
      >
        {stateConfig.tagline}
      </div>

      {/* BTC value hint */}
      <div
        className="mt-6 text-xs"
        style={{ color: "var(--gold-dim)", letterSpacing: "0.1em" }}
      >
        ~1,100,000 BTC untouched
      </div>

      {/* Reckoning warning */}
      {state === "reckoning" && (
        <div
          className="mt-10 px-8 py-6 rounded-sm max-w-lg"
          style={{
            backgroundColor: "rgba(224, 80, 80, 0.08)",
            border:          "1px solid rgba(224, 80, 80, 0.3)",
          }}
        >
          <div style={{ color: "#E05050", fontSize: "0.9rem", fontWeight: 500, marginBottom: "8px" }}>
            ⚠ THE RECKONING HAS BEEN DECLARED
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "0.8rem", lineHeight: 1.6 }}>
            A Satoshi wallet has moved. All Vigil NFTs have transformed.
            Governance voting is now open. SSL protocol is executing.
          </div>
        </div>
      )}
    </div>
  );
}
