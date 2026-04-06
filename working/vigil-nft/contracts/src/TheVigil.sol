// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * ████████╗██╗  ██╗███████╗    ██╗   ██╗██╗ ██████╗ ██╗██╗
 *    ██╔══╝██║  ██║██╔════╝    ██║   ██║██║██╔════╝ ██║██║
 *    ██║   ███████║█████╗      ██║   ██║██║██║  ███╗██║██║
 *    ██║   ██╔══██║██╔══╝      ╚██╗ ██╔╝██║██║   ██║██║██║
 *    ██║   ██║  ██║███████╗     ╚████╔╝ ██║╚██████╔╝██║███████╗
 *    ╚═╝   ╚═╝  ╚═╝╚══════╝     ╚═══╝  ╚═╝ ╚═════╝ ╚═╝╚══════╝
 *
 * The Vigil — 2,100 Watchers. One question. When will Satoshi move?
 *
 * An NFT collection tied to the Satoshi Stop Loss protocol.
 * Each Vigil NFT represents a Watcher: an entity that has taken
 * an oath to guard against the day the dormant wallets awaken.
 *
 * Utility:
 *   - Tier A (Token IDs 1–500):   20% permanent discount on SSL enrollment premiums
 *   - Tier B (Token IDs 501–2100): 10% permanent discount on SSL enrollment premiums
 *   - Priority SSL token TGE allocation
 *   - Governance voting rights
 *   - The Reckoning: if Satoshi moves, all Vigils transform simultaneously
 *
 * Deployed on Base mainnet.
 */

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract TheVigil is ERC721A, ERC721AQueryable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // =========================================================
    // CONSTANTS
    // =========================================================

    uint256 public constant MAX_SUPPLY       = 2100;
    uint256 public constant TIER_A_SUPPLY    = 500;
    uint256 public constant MAX_PER_WALLET   = 2;

    // Discount in basis points (1 bps = 0.01%)
    uint256 public constant TIER_A_DISCOUNT_BPS = 2000; // 20%
    uint256 public constant TIER_B_DISCOUNT_BPS = 1000; // 10%

    // =========================================================
    // STATE
    // =========================================================

    bool    public mintActive          = false;
    bool    public whitelistMintActive = false;
    bool    public reckoningDeclared   = false;

    string  private _baseTokenURI;
    string  private _reckoningBaseURI; // Set after governance vote resolves art variant

    bytes32 public merkleRoot; // For whitelist phase

    uint256 public reckoningBlock;
    uint256 public reckoningTimestamp;

    // Reckoning governance: 0 = undecided, 1 = The Storm, 2 = The Dawn
    uint8   public reckoningVariant = 0;

    // Per-token mint metadata (for lore — "Awakened at block X")
    mapping(uint256 => uint256) public awakenedAtBlock;
    mapping(uint256 => uint256) public awakenedAtTimestamp;

    // Reckoning governance votes (weighted by NFTs held)
    mapping(address => bool)    public hasVotedOnReckoning;
    uint256 public stormVotes;
    uint256 public dawnVotes;

    // Reserve mint tracking
    uint256 public totalReserved = 0;
    uint256 public constant MAX_RESERVE = 100;

    // =========================================================
    // EVENTS
    // =========================================================

    event VigillAwakened(
        address indexed minter,
        uint256 indexed firstTokenId,
        uint256 quantity,
        uint256 blockNumber
    );

    event TheReckoningDeclared(
        address indexed caller,
        uint256 blockNumber,
        uint256 timestamp
    );

    event ReckoningVoteCast(
        address indexed voter,
        uint8 variant,
        uint256 voteWeight
    );

    event ReckoningVariantFinalized(uint8 variant);

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    constructor(
        string memory baseURI,
        bytes32 _merkleRoot
    ) ERC721A("The Vigil", "VIGIL") Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        merkleRoot    = _merkleRoot;
    }

    // =========================================================
    // MINTING
    // =========================================================

    /**
     * @notice Whitelist mint phase (pre-launch waitlist)
     * @param quantity Number of tokens to mint (max MAX_PER_WALLET total)
     * @param proof    Merkle proof for whitelist verification
     */
    function whitelistMint(
        uint256 quantity,
        bytes32[] calldata proof
    ) external nonReentrant {
        require(whitelistMintActive,                             "Vigil: whitelist mint not active");
        require(quantity > 0 && quantity <= MAX_PER_WALLET,      "Vigil: invalid quantity");
        require(_numberMinted(msg.sender) + quantity <= MAX_PER_WALLET, "Vigil: wallet limit reached");
        require(totalSupply() + quantity <= MAX_SUPPLY,          "Vigil: supply exhausted");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(proof, merkleRoot, leaf),     "Vigil: not on whitelist");

        _mintAndRecord(msg.sender, quantity);
    }

    /**
     * @notice Public free mint — open to all
     * @param quantity Number of tokens to mint (max MAX_PER_WALLET total)
     */
    function mint(uint256 quantity) external nonReentrant {
        require(mintActive,                                              "Vigil: public mint not active");
        require(quantity > 0 && quantity <= MAX_PER_WALLET,             "Vigil: invalid quantity");
        require(_numberMinted(msg.sender) + quantity <= MAX_PER_WALLET, "Vigil: wallet limit reached");
        require(totalSupply() + quantity <= MAX_SUPPLY,                 "Vigil: supply exhausted");

        _mintAndRecord(msg.sender, quantity);
    }

    /**
     * @dev Internal: mint and record lore metadata
     */
    function _mintAndRecord(address to, uint256 quantity) internal {
        uint256 startId = _nextTokenId();
        _safeMint(to, quantity);

        for (uint256 i = 0; i < quantity; i++) {
            awakenedAtBlock[startId + i]     = block.number;
            awakenedAtTimestamp[startId + i] = block.timestamp;
        }

        emit VigillAwakened(to, startId, quantity, block.number);
    }

    // =========================================================
    // TIER SYSTEM
    // =========================================================

    /**
     * @notice Returns the tier of a given token ID
     * @return 1 = Tier A (Genesis), 2 = Tier B (Vigil)
     */
    function getTier(uint256 tokenId) public pure returns (uint8) {
        require(tokenId >= 1 && tokenId <= MAX_SUPPLY, "Vigil: invalid token ID");
        return tokenId <= TIER_A_SUPPLY ? 1 : 2;
    }

    /**
     * @notice Returns the highest discount in basis points for a given address.
     * @dev Called by SSL vault contracts to determine enrollment fee discount.
     *      Returns 0 if the address holds no Vigil tokens.
     *      Returns TIER_A_DISCOUNT_BPS (2000) if any held token is Tier A.
     *      Returns TIER_B_DISCOUNT_BPS (1000) otherwise.
     *
     *      Gas note: This is a view function intended for off-chain calls and
     *      SSL vault read operations. Iterates owned tokens (max 2 per wallet).
     *
     * @param holder The address to check
     * @return discountBps Discount in basis points (0, 1000, or 2000)
     */
    function getDiscount(address holder) external view returns (uint256 discountBps) {
        uint256 balance = balanceOf(holder);
        if (balance == 0) return 0;

        // ERC721AQueryable gives us tokensOfOwner — max 2 tokens per wallet
        uint256[] memory owned = tokensOfOwner(holder);

        for (uint256 i = 0; i < owned.length; i++) {
            if (owned[i] <= TIER_A_SUPPLY) {
                return TIER_A_DISCOUNT_BPS; // Can't do better; return early
            }
        }

        return TIER_B_DISCOUNT_BPS;
    }

    /**
     * @notice Returns both the tier and discount for a holder — convenience function
     */
    function getTierInfo(address holder) external view returns (
        uint8 highestTier,
        uint256 discountBps,
        uint256 tokensHeld
    ) {
        uint256 balance = balanceOf(holder);
        if (balance == 0) return (0, 0, 0);

        uint256[] memory owned = tokensOfOwner(holder);
        highestTier = 2; // Assume Tier B until proven otherwise
        discountBps = TIER_B_DISCOUNT_BPS;

        for (uint256 i = 0; i < owned.length; i++) {
            if (owned[i] <= TIER_A_SUPPLY) {
                highestTier = 1;
                discountBps = TIER_A_DISCOUNT_BPS;
                break;
            }
        }

        return (highestTier, discountBps, balance);
    }

    // =========================================================
    // THE RECKONING
    // =========================================================

    /**
     * @notice Declare The Reckoning — called when a Satoshi wallet spends a UTXO.
     * @dev In production this is called by the SSL oracle committee (multisig).
     *      All NFT metadata will shift to the Reckoning state on next tokenURI call.
     *      Simultaneously opens a 72-hour governance vote on the Reckoning art variant.
     */
    function declareReckoning() external onlyOwner {
        require(!reckoningDeclared, "Vigil: reckoning already declared");

        reckoningDeclared   = true;
        reckoningBlock      = block.number;
        reckoningTimestamp  = block.timestamp;

        emit TheReckoningDeclared(msg.sender, block.number, block.timestamp);
    }

    /**
     * @notice Vote on the Reckoning art variant.
     *         1 = The Storm (dark, foreboding — Satoshi returns as disruption)
     *         2 = The Dawn  (golden, triumphant — Satoshi returns as vindication)
     * @dev One vote per NFT held. Voting weight = number of Vigils held.
     * @param variant 1 or 2
     */
    function voteOnReckoning(uint8 variant) external {
        require(reckoningDeclared,           "Vigil: reckoning not declared");
        require(!hasVotedOnReckoning[msg.sender], "Vigil: already voted");
        require(variant == 1 || variant == 2, "Vigil: invalid variant (use 1 or 2)");

        uint256 voteWeight = balanceOf(msg.sender);
        require(voteWeight > 0, "Vigil: must hold a Vigil to vote");

        hasVotedOnReckoning[msg.sender] = true;

        if (variant == 1) {
            stormVotes += voteWeight;
        } else {
            dawnVotes += voteWeight;
        }

        emit ReckoningVoteCast(msg.sender, variant, voteWeight);
    }

    /**
     * @notice Finalize the Reckoning variant and update metadata.
     *         Can only be called after a minimum voting period (recommended: 72 hours).
     */
    function finalizeReckoning() external onlyOwner {
        require(reckoningDeclared,          "Vigil: reckoning not declared");
        require(reckoningVariant == 0,      "Vigil: variant already finalized");
        require(
            block.timestamp >= reckoningTimestamp + 72 hours,
            "Vigil: voting period not ended"
        );

        reckoningVariant = stormVotes >= dawnVotes ? 1 : 2;

        // Switch to Reckoning base URI (set separately via setReckoningBaseURI)
        if (bytes(_reckoningBaseURI).length > 0) {
            _baseTokenURI = _reckoningBaseURI;
        }

        emit ReckoningVariantFinalized(reckoningVariant);
    }

    function getReckoningStatus() external view returns (
        bool declared,
        uint256 declaredBlock,
        uint256 declaredTimestamp,
        uint8 variant,
        uint256 _stormVotes,
        uint256 _dawnVotes,
        bool votingOpen
    ) {
        bool _votingOpen = reckoningDeclared &&
            reckoningVariant == 0 &&
            block.timestamp < reckoningTimestamp + 72 hours;

        return (
            reckoningDeclared,
            reckoningBlock,
            reckoningTimestamp,
            reckoningVariant,
            stormVotes,
            dawnVotes,
            _votingOpen
        );
    }

    // =========================================================
    // METADATA
    // =========================================================

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A, IERC721A)
        returns (string memory)
    {
        require(_exists(tokenId), "Vigil: token does not exist");
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // ERC721A: Start token IDs at 1 (Vigil #1, not #0)
    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }

    // =========================================================
    // VIEW HELPERS
    // =========================================================

    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }

    function tierARemaining() external view returns (uint256) {
        uint256 minted = totalSupply();
        if (minted >= TIER_A_SUPPLY) return 0;
        return TIER_A_SUPPLY - minted;
    }

    function numberMinted(address addr) external view returns (uint256) {
        return _numberMinted(addr);
    }

    // =========================================================
    // ADMIN
    // =========================================================

    function setMintActive(bool active) external onlyOwner {
        mintActive = active;
    }

    function setWhitelistMintActive(bool active) external onlyOwner {
        whitelistMintActive = active;
    }

    function setMerkleRoot(bytes32 root) external onlyOwner {
        merkleRoot = root;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setReckoningBaseURI(string memory reckoningURI) external onlyOwner {
        _reckoningBaseURI = reckoningURI;
    }

    /**
     * @notice Owner reserve mint — for team, partnerships, giveaways
     * @dev Max 100 tokens total across all reserve calls (included in the 2,100 supply)
     */
    function reserveMint(address to, uint256 quantity) external onlyOwner {
        require(totalSupply() + quantity <= MAX_SUPPLY,         "Vigil: supply exhausted");
        require(totalReserved + quantity <= MAX_RESERVE,        "Vigil: reserve cap reached");
        totalReserved += quantity;

        uint256 startId = _nextTokenId();
        _safeMint(to, quantity);

        for (uint256 i = 0; i < quantity; i++) {
            awakenedAtBlock[startId + i]     = block.number;
            awakenedAtTimestamp[startId + i] = block.timestamp;
        }
    }

    // =========================================================
    // REQUIRED OVERRIDES
    // =========================================================

    // Bug fix: ERC721AQueryable also overrides supportsInterface, so it must
    // be included in the override specifier to satisfy the compiler.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721A, ERC721AQueryable, IERC721A)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
