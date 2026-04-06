/**
 * MintSection.jsx
 *
 * The minting UI. Shows:
 *   - Current supply / Tier A remaining
 *   - Tier info for the user's would-be mint
 *   - Free mint button with quantity selector
 *   - Post-mint state (Your Vigil)
 */

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseAbi } from "viem";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VIGIL_CONTRACT_ADDRESS;

const VIGIL_ABI = parseAbi([
  "function mint(uint256 quantity) external",
  "function totalSupply() view returns (uint256)",
  "function remainingSupply() view returns (uint256)",
  "function tierARemaining() view returns (uint256)",
  "function numberMinted(address addr) view returns (uint256)",
  "function mintActive() view returns (bool)",
  "function getTierInfo(address holder) view returns (uint8 highestTier, uint256 discountBps, uint256 tokensHeld)",
]);

const MAX_SUPPLY    = 2100;
const TIER_A_SUPPLY = 500;
const MAX_PER_WALLET = 2;

function SupplyBar({ remaining, total }) {
  const pct = ((total - remaining) / total) * 100;
  const tierAPct = (TIER_A_SUPPLY / total) * 100;

  return (
    <div className="w-full mb-6">
      {/* Labels */}
      <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text-dim)", letterSpacing: "0.1em" }}>
        <span>{(total - remaining).toLocaleString()} MINTED</span>
        <span>{remaining?.toLocaleString()} REMAINING</span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #7A6438, #C0A060)",
          }}
        />
      </div>

      {/* Tier A indicator */}
      <div className="flex justify-between mt-2">
        <div className="text-xs" style={{ color: "var(--gold-dim)", letterSpacing: "0.08em" }}>
          Tier A: {Math.min(total - remaining, TIER_A_SUPPLY)}/{TIER_A_SUPPLY} minted
        </div>
        <div className="text-xs" style={{ color: "var(--text-dim)", letterSpacing: "0.08em" }}>
          {total.toLocaleString()} total
        </div>
      </div>
    </div>
  );
}

function TierBadge({ tier, discount }) {
  if (!tier) return null;

  const isA = tier === 1;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-medium ${isA ? "tier-a-badge" : "tier-b-badge"}`}
    >
      <span style={{ letterSpacing: "0.1em" }}>
        {isA ? "TIER A — GENESIS" : "TIER B — VIGIL"}
      </span>
      <span style={{ opacity: 0.8 }}>
        {isA ? "20% SSL discount" : "10% SSL discount"}
      </span>
    </div>
  );
}

export default function MintSection() {
  const { address, isConnected } = useAccount();
  const [quantity, setQuantity]  = useState(1);
  const [mintedTokenIds, setMintedTokenIds] = useState([]);

  // Contract reads
  const { data: remaining } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          VIGIL_ABI,
    functionName: "remainingSupply",
    watch:        true,
  });

  const { data: tierARemaining } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          VIGIL_ABI,
    functionName: "tierARemaining",
  });

  const { data: mintActive } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          VIGIL_ABI,
    functionName: "mintActive",
  });

  const { data: numberMinted } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          VIGIL_ABI,
    functionName: "numberMinted",
    args:         [address],
    enabled:      !!address,
  });

  const { data: tierInfo } = useReadContract({
    address:      CONTRACT_ADDRESS,
    abi:          VIGIL_ABI,
    functionName: "getTierInfo",
    args:         [address],
    enabled:      !!address,
    watch:        true,
  });

  // Compute what tier this user's next mint would be
  const totalMinted    = remaining !== undefined ? MAX_SUPPLY - Number(remaining) : 0;
  const nextTokenId    = totalMinted + 1;
  const wouldBeTierA   = nextTokenId <= TIER_A_SUPPLY;
  const alreadyMinted  = numberMinted ? Number(numberMinted) : 0;
  const canMintMore    = alreadyMinted < MAX_PER_WALLET;
  const maxCanMint     = Math.min(MAX_PER_WALLET - alreadyMinted, quantity);
  const isSoldOut      = remaining !== undefined && Number(remaining) === 0;

  // Write contract
  const { writeContract, data: txHash, isPending: isSending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isLoading = isSending || isConfirming;

  function handleMint() {
    if (!isConnected || !mintActive || !canMintMore) return;

    writeContract({
      address:      CONTRACT_ADDRESS,
      abi:          VIGIL_ABI,
      functionName: "mint",
      args:         [BigInt(quantity)],
    });
  }

  // Determine button state
  let buttonText = "Mint Your Vigil — Free";
  if (!mintActive)          buttonText = "Mint Not Active Yet";
  if (isSoldOut)            buttonText = "Sold Out";
  if (!canMintMore)         buttonText = "Wallet Limit Reached";
  if (isSending)            buttonText = "Confirm in Wallet…";
  if (isConfirming)         buttonText = "Confirming…";
  if (isConfirmed)          buttonText = "Vigil Awakened ✓";

  const isDisabled = !mintActive || isSoldOut || !canMintMore || isLoading || isConfirmed;

  return (
    <div
      className="rounded-sm p-8 w-full max-w-md mx-auto"
      style={{
        backgroundColor: "var(--void-3)",
        border:           "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Supply bar */}
      {remaining !== undefined && (
        <SupplyBar remaining={Number(remaining)} total={MAX_SUPPLY} />
      )}

      {/* Tier preview for next mint */}
      {isConnected && !alreadyMinted && !isSoldOut && (
        <div className="mb-5">
          <div className="text-xs mb-2" style={{ color: "var(--text-dim)", letterSpacing: "0.1em" }}>
            YOUR VIGIL WILL BE
          </div>
          <TierBadge
            tier={wouldBeTierA ? 1 : 2}
            discount={wouldBeTierA ? "20%" : "10%"}
          />
          {wouldBeTierA && (
            <div className="mt-2 text-xs" style={{ color: "var(--gold-dim)" }}>
              {Number(tierARemaining) || 0} Genesis spots remaining
            </div>
          )}
        </div>
      )}

      {/* Already holds a Vigil */}
      {isConnected && tierInfo && Number(tierInfo[2]) > 0 && (
        <div
          className="mb-5 p-4 rounded-sm"
          style={{ backgroundColor: "rgba(192,160,96,0.06)", border: "1px solid rgba(192,160,96,0.15)" }}
        >
          <div className="text-xs mb-1" style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>
            YOU ARE A WATCHER
          </div>
          <TierBadge tier={Number(tierInfo[0])} />
          <div className="mt-2 text-xs" style={{ color: "var(--text-dim)" }}>
            {Number(tierInfo[2])} Vigil{Number(tierInfo[2]) > 1 ? "s" : ""} held
            · {Number(tierInfo[1]) / 100}% SSL discount active
          </div>
        </div>
      )}

      {/* Quantity selector */}
      {isConnected && canMintMore && mintActive && !isSoldOut && !isConfirmed && (
        <div className="flex items-center gap-4 mb-5">
          <div className="text-xs" style={{ color: "var(--text-dim)", letterSpacing: "0.1em" }}>
            QUANTITY
          </div>
          <div className="flex items-center gap-2">
            {[1, 2].map(q => {
              const disabled = q > MAX_PER_WALLET - alreadyMinted;
              return (
                <button
                  key={q}
                  onClick={() => !disabled && setQuantity(q)}
                  disabled={disabled}
                  className="w-8 h-8 rounded-sm text-sm font-medium transition-all"
                  style={{
                    backgroundColor: quantity === q
                      ? "rgba(192,160,96,0.15)"
                      : "rgba(255,255,255,0.04)",
                    border: quantity === q
                      ? "1px solid rgba(192,160,96,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: disabled
                      ? "var(--text-dim)"
                      : quantity === q
                        ? "var(--gold)"
                        : "var(--text-primary)",
                    opacity: disabled ? 0.4 : 1,
                    cursor:  disabled ? "not-allowed" : "pointer",
                  }}
                >
                  {q}
                </button>
              );
            })}
          </div>
          <div className="text-xs" style={{ color: "var(--gold-dim)" }}>
            max {MAX_PER_WALLET} per wallet
          </div>
        </div>
      )}

      {/* Connect / Mint button */}
      {!isConnected ? (
        <div className="w-full">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                className="mint-btn w-full py-4 rounded-sm text-sm font-semibold text-black tracking-widest"
                style={{ letterSpacing: "0.2em" }}
                onClick={openConnectModal}
              >
                CONNECT WALLET
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      ) : (
        <button
          className="mint-btn w-full py-4 rounded-sm text-sm font-semibold text-black tracking-widest"
          style={{ letterSpacing: "0.2em" }}
          onClick={handleMint}
          disabled={isDisabled}
        >
          {buttonText.toUpperCase()}
        </button>
      )}

      {/* Error state */}
      {writeError && (
        <div
          className="mt-3 text-xs px-3 py-2 rounded-sm"
          style={{ backgroundColor: "rgba(224,80,80,0.08)", color: "#E07070", border: "1px solid rgba(224,80,80,0.2)" }}
        >
          {writeError.message?.includes("user rejected")
            ? "Transaction cancelled."
            : writeError.shortMessage || "Transaction failed. Please try again."}
        </div>
      )}

      {/* Success state */}
      {isConfirmed && (
        <div
          className="mt-4 p-4 rounded-sm text-center"
          style={{ backgroundColor: "rgba(192,160,96,0.06)", border: "1px solid rgba(192,160,96,0.2)" }}
        >
          <div style={{ color: "var(--gold)", fontSize: "1rem", marginBottom: "6px" }}>
            The oath is taken. 🜚
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "0.8rem", lineHeight: 1.6 }}>
            Your Vigil is awakened. View it on{" "}
            <a
              href={`https://opensea.io/collection/the-vigil`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              OpenSea
            </a>
            {" "}or{" "}
            <a
              href={`https://thevigilnft.xyz/vigil`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              your dashboard
            </a>.
          </div>
        </div>
      )}

      {/* Gas note */}
      <div className="mt-4 text-center text-xs" style={{ color: "var(--text-dim)" }}>
        Free to mint · You pay only gas · Base network (~$0.01)
      </div>
    </div>
  );
}
